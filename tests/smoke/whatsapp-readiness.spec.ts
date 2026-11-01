import { createHmac } from 'node:crypto'
import { expect, test } from '@playwright/test'
import {
  approveWhatsappReply,
  assertWhatsappWebhookBinding,
  assignInboundContext,
  buildWhatsappReadiness,
  captureInboundMessage,
  companyForWhatsappContext,
  draftWhatsappReply,
  inboundRowsFromWebhook,
  isFounderPrivateContext,
  parseWhatsappWebhook,
  readWhatsappEnvPresence,
  recommendCoexistenceRoute,
  sendWhatsappReply,
  verifyWhatsappChallenge,
  verifyWhatsappSignature,
  visibleWhatsappMessage,
  webhookCallbackUrl,
  whatsappContexts,
} from '../../lib/whatsapp'
import { authorizeWhatsappWebhookPost, handleWhatsappChallenge } from '../../lib/whatsapp/webhookHandlers'

test('shared contexts keep Lebab and DJ Eksteen distinct from catalogue companies', () => {
  expect(whatsappContexts).toEqual(['digikraal', 'farm-feed', 'northpoint', 'lebab', 'dj-eksteen'])
  expect(companyForWhatsappContext('digikraal')).toBe('digikraal')
  expect(companyForWhatsappContext('lebab')).toBeNull()
  expect(companyForWhatsappContext('dj-eksteen')).toBe('personal')
  expect(isFounderPrivateContext('lebab')).toBe(true)
  expect(isFounderPrivateContext('northpoint')).toBe(false)
})

test('inbound capture never invents a company from the contact alone', () => {
  const saved = captureInboundMessage({
    id: 'msg-1',
    providerMessageId: 'wamid.1',
    from: '27821234567',
    toPhoneNumberId: '1234567890',
    receivedAt: '2026-10-27T12:00:00.000Z',
    text: 'I have cattle in Ceres',
  })
  expect(saved.ok).toBe(true)
  if (!saved.ok) return
  expect(saved.message.context).toBeNull()
  expect(saved.message.companyInferred).toBe(false)
  expect(saved.message.status).toBe('needs-context')
  expect(saved.message.providerStatus).toBe('not-connected')
  const linked = assignInboundContext(saved.message, 'digikraal')
  expect(linked.status).toBe('linked')
  expect(linked.companyInferred).toBe(false)
  expect(captureInboundMessage({ ...saved.message, context: 'unknown-biz' }).ok).toBe(false)
})

test('approval records a decision and still refuses to send', () => {
  const drafted = draftWhatsappReply({
    id: 'out-1',
    to: '27821234567',
    context: 'digikraal',
    body: 'Thank you. I will confirm a visit time.',
  })
  expect(drafted.ok).toBe(true)
  if (!drafted.ok) return
  expect(drafted.draft.executes).toBe(false)
  const approved = approveWhatsappReply(drafted.draft, { approvedBy: 'Drikus', approvedAt: '2026-10-27T12:05:00.000Z' })
  expect(approved.ok).toBe(true)
  if (!approved.ok) return
  expect(approved.send.status).toBe('approved-not-sent')
  expect(approved.send.executes).toBe(false)
  expect(sendWhatsappReply(approved.send)).toEqual({
    ok: false,
    executes: false,
    error: 'Outbound WhatsApp is not connected. Approval does not send a message.',
  })
})

test('webhook helpers verify signatures and keep payloads local', () => {
  const secret = 'test-app-secret'
  const raw = JSON.stringify({
    entry: [{
      changes: [{
        value: {
          metadata: { phone_number_id: '999' },
          messages: [{ id: 'wamid.9', from: '27820000000', timestamp: '1761566400', type: 'text', text: { body: 'Hello' } }],
          statuses: [{ id: 'wamid.8', recipient_id: '27820000000', status: 'delivered' }],
        },
      }],
    }],
  })
  const signature = `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`
  expect(verifyWhatsappSignature(raw, signature, secret)).toBe(true)
  expect(verifyWhatsappSignature(raw, 'sha256=deadbeef', secret)).toBe(false)
  expect(verifyWhatsappChallenge({ mode: 'subscribe', token: 'verify-me', challenge: '123', expectedToken: 'verify-me' })).toEqual({ ok: true, challenge: '123' })
  expect(verifyWhatsappChallenge({ mode: 'subscribe', token: 'wrong', challenge: '123', expectedToken: 'verify-me' }).ok).toBe(false)
  const parsed = parseWhatsappWebhook(JSON.parse(raw))
  expect(parsed.phoneNumberId).toBe('999')
  expect(parsed.messages[0]?.text).toBe('Hello')
  expect(parsed.statuses[0]?.status).toBe('delivered')
})

test('readiness stays send-disabled and recommends Meta coexistence without a paid BSP', () => {
  const empty = buildWhatsappReadiness(readWhatsappEnvPresence({}))
  expect(empty.status).toBe('not-connected')
  expect(empty.canSend).toBe(false)
  expect(empty.canImportHistory).toBe(false)
  expect(empty.coexistenceVerified).toBe(false)
  const named = buildWhatsappReadiness(readWhatsappEnvPresence({
    WHATSAPP_ACCESS_TOKEN: 'x',
    WHATSAPP_PHONE_NUMBER_ID: '1',
    WHATSAPP_APP_SECRET: 'y',
    WHATSAPP_VERIFY_TOKEN: 'z',
    WHATSAPP_OWNER_ID: '00000000-0000-4000-8000-000000000001',
  }))
  expect(named.status).toBe('setup-incomplete')
  expect(named.canSend).toBe(false)
  expect(named.checks.find((check) => check.id === 'webhook')?.status).toBe('local-only')
  expect(named.checks.find((check) => check.id === 'phone-app')?.status).toBe('needs-founder')
  const recommendation = recommendCoexistenceRoute()
  expect(recommendation.route).toBe('meta-tech-provider-embedded-signup-v4-coexistence')
  expect(recommendation.preservesPhoneApp).toBe(true)
  expect(recommendation.paidBspChosen).toBe(false)
  expect(webhookCallbackUrl()).toBe('https://pivot-os.vercel.app/api/whatsapp/webhook')
})

test('inbound rows keep private contexts off a company lens and stay idempotent by provider id', () => {
  const parsed = parseWhatsappWebhook({
    entry: [{ changes: [{ value: {
      metadata: { phone_number_id: '555' },
      messages: [
        { id: 'wamid.a', from: '27821111111', timestamp: '1761566400', type: 'text', text: { body: 'Farm Feed order' } },
        { id: 'wamid.a', from: '27821111111', timestamp: '1761566400', type: 'text', text: { body: 'duplicate' } },
      ],
    } }] }],
  })
  const rows = inboundRowsFromWebhook('owner-1', parsed)
  expect(rows).toHaveLength(1)
  expect(rows[0].provider_message_id).toBe('wamid.a')
  expect(rows[0].company_inferred).toBe(false)
  expect(rows[0].privacy).toBe('founder-private')
  expect(visibleWhatsappMessage({ ...rows[0], privacy: 'founder-private', company: null }, 'digikraal')).toBe(false)
  expect(visibleWhatsappMessage({ ...rows[0], privacy: 'company-visible', company: 'digikraal', context: 'digikraal' }, 'digikraal')).toBe(true)
})

test('webhook challenge and signature refuse bad tokens and never enable sending', () => {
  const previous = { ...process.env }
  process.env.WHATSAPP_OWNER_ID = '00000000-0000-4000-8000-000000000001'
  process.env.WHATSAPP_APP_SECRET = 'test-secret'
  process.env.WHATSAPP_VERIFY_TOKEN = 'verify-me'
  process.env.WHATSAPP_PHONE_NUMBER_ID = '555'
  process.env.WHATSAPP_WABA_ID = 'waba-9'
  try {
    const challenge = handleWhatsappChallenge('https://pivot-os.vercel.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=12345')
    expect(challenge).toEqual({ status: 200, body: '12345', contentType: 'text/plain' })
    expect(handleWhatsappChallenge('https://pivot-os.vercel.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=12345').status).toBe(403)
    const raw = JSON.stringify({
      object: 'whatsapp_business_account',
      entry: [{
        id: 'waba-9',
        changes: [{ value: { metadata: { phone_number_id: '555', display_phone_number: '27827721220' }, messages: [] } }],
      }],
    })
    expect(authorizeWhatsappWebhookPost(raw, 'sha256=deadbeef').ok).toBe(false)
    const goodSignature = `sha256=${createHmac('sha256', 'test-secret').update(raw).digest('hex')}`
    const accepted = authorizeWhatsappWebhookPost(raw, goodSignature)
    expect(accepted.ok).toBe(true)
    if (accepted.ok) expect(accepted.config.ownerId).toBe('00000000-0000-4000-8000-000000000001')
    const foreign = JSON.stringify({
      object: 'whatsapp_business_account',
      entry: [{ id: 'other-waba', changes: [{ value: { metadata: { phone_number_id: '999' }, messages: [] } }] }],
    })
    const foreignSig = `sha256=${createHmac('sha256', 'test-secret').update(foreign).digest('hex')}`
    expect(authorizeWhatsappWebhookPost(foreign, foreignSig).ok).toBe(false)
    const parsedForeign = parseWhatsappWebhook(JSON.parse(foreign))
    expect(assertWhatsappWebhookBinding(parsedForeign, { phoneNumberId: '555', wabaId: 'waba-9' }).ok).toBe(false)
  } finally {
    for (const key of ['WHATSAPP_OWNER_ID', 'WHATSAPP_APP_SECRET', 'WHATSAPP_VERIFY_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_WABA_ID']) {
      if (previous[key] === undefined) delete process.env[key]
      else process.env[key] = previous[key]
    }
  }
})
