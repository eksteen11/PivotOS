import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'
import * as livestock from '../../../lib/modules/005'
import {
  SAMPLE_BUYER_TEXT,
  SAMPLE_CAPTURED_AT,
  SAMPLE_ON_DATE,
  SAMPLE_SELLER_TEXT,
  appendStage,
  approve,
  approvalHolds,
  assessCompleteness,
  assessPermit,
  buildDeskModel,
  buyerReadiness,
  canReleaseLoading,
  captureBuyer,
  captureSeller,
  confirmFact,
  draftInformationRequest,
  explainMatch,
  integrationContract,
  proposeBuyerFromText,
  proposeSellerFromText,
  recommendedDealStage,
  sampleCase,
  sampleDeskModel,
  statedFact,
} from '../../../lib/modules/005'
import type { SellerInput, StageEvent } from '../../../lib/modules/005'

const capturedAt = SAMPLE_CAPTURED_AT
const onDate = SAMPLE_ON_DATE

function seller(extra: Partial<SellerInput> & Pick<SellerInput, 'groups' | 'originalText'>): ReturnType<typeof captureSeller> {
  return captureSeller({
    capturedAt,
    sellerName: 'Test Seller',
    location: 'Ceres',
    ...extra,
  })
}

test('the Ceres example keeps separate counts and does not invent facts', () => {
  const first = proposeSellerFromText(SAMPLE_SELLER_TEXT, capturedAt, { sample: true })
  const second = proposeSellerFromText(SAMPLE_SELLER_TEXT, capturedAt, { sample: true })
  expect(first.id).toBe(second.id)
  expect(first.entity).toBe('digikraal')
  expect(first.capability).toBe('005')
  expect(first.offMarket).toBe(true)
  expect(first.originalText).toBe(SAMPLE_SELLER_TEXT)
  expect(first.sellerName?.value).toBe('CP van der Merwe')
  expect(first.location?.value).toBe('Ceres')
  expect(first.groups.map((group) => group.quantity?.value)).toEqual([50, 30])
  expect(first.groups.map((group) => group.originalWording)).toEqual(['50 Angus cows', '30 calves'])
  expect(first.groups[0].breed?.value).toBe('Angus')
  expect(first.groups[1].breed).toBeUndefined()
  expect(first.groups[0].species).toBe('cattle')
  expect(first.groups[1].species).toBe('cattle')
  expect(first.groups.every((group) => group.pregnancy === undefined)).toBe(true)
  expect(first.groups.every((group) => group.ageOrTooth === undefined && group.pairing === undefined)).toBe(true)
  expect(first.expectedPrice).toBeUndefined()
  expect(first.groups.every((group) => group.quantity?.verification === 'seller_stated')).toBe(true)
  expect(JSON.stringify(first)).not.toContain('"value":80')
  expect('viewing' in first).toBe(false)

  const held = proposeSellerFromText(`${SAMPLE_SELLER_TEXT}\nPregnancy: in calf`, capturedAt)
  expect(held.groups.every((group) => group.pregnancy === undefined)).toBe(true)
  expect(held.unassignedNotes.join(' ')).toContain('in calf')

  const unpriced = proposeSellerFromText('Seller: A; town: Ceres. 10 Angus cows. Price is R12000 per head.', capturedAt)
  expect(unpriced.expectedPrice).toBeUndefined()
  expect(unpriced.groups).toHaveLength(1)
})

test('species checklists change the gaps and missing facts do not block capture', () => {
  const empty = proposeSellerFromText('Hello', capturedAt)
  expect(empty.groups).toEqual([])
  expect(assessCompleteness(empty, 'capture', { onDate }).ready).toBe(false)

  const sample = proposeSellerFromText(SAMPLE_SELLER_TEXT, capturedAt)
  const listing = assessCompleteness(sample, 'listing', { onDate })
  const request = draftInformationRequest(sample, 'listing', { onDate })
  expect(assessCompleteness(sample, 'capture', { onDate }).ready).toBe(true)
  expect(listing.ready).toBe(false)
  expect(request.sent).toBe(false)
  expect(request.body).toContain('This has not been sent.')
  expect(request.body.toLowerCase()).not.toContain('pregnant')
  expect(request.body.toLowerCase()).not.toContain('pair')
  expect(request.askedFields.join(' ')).not.toContain('pregnancy')
  expect(request.askedFields.some((field) => field.startsWith('breed:'))).toBe(true)
  expect(listing.optional.some((gap) => gap.field === 'ratio')).toBe(true)
  expect(request.body).not.toContain('Male/female ratio')

  const cattle = seller({
    originalText: 'listing ready cattle',
    expectedPrice: 'R12000 per head',
    availability: 'Available now',
    contactPermission: 'granted',
    media: [{ id: 'm1', kind: 'photo', source: 'test', capturedAt, note: 'group photo' }],
    groups: [
      { species: 'cattle', originalWording: '40 Angus cows', breed: 'Angus', typeSex: 'cow', quantity: 40 },
      { species: 'cattle', originalWording: '10 Angus calves', breed: 'Angus', typeSex: 'calf', quantity: 10 },
    ],
  })
  expect(assessCompleteness(cattle, 'listing', { onDate }).ready).toBe(true)
  expect(recommendedDealStage(cattle, { onDate }).key).toBe('listing_preparation')
  const presentation = assessCompleteness(cattle, 'buyer_presentation', { onDate })
  expect(presentation.gaps.some((gap) => gap.field === 'pregnancy' && gap.componentId === cattle.groups[0].id)).toBe(true)
  expect(presentation.gaps.some((gap) => gap.field === 'pregnancy' && gap.componentId === cattle.groups[1].id)).toBe(false)
  expect(presentation.gaps.some((gap) => gap.field === 'wool' || gap.field === 'fibre')).toBe(false)
  expect(presentation.gaps.some((gap) => gap.field === 'youngAge' && gap.componentId === cattle.groups[1].id)).toBe(true)

  const bull = seller({ originalText: 'bulls', groups: [{ species: 'cattle', originalWording: '5 Brahman bulls', breed: 'Brahman', typeSex: 'bull', quantity: 5 }] })
  expect(assessCompleteness(bull, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'pregnancy')).toBe(false)

  const merino = seller({ originalText: 'merino', groups: [{ species: 'sheep', originalWording: '40 Merino ewes', breed: 'Merino', typeSex: 'ewe', quantity: 40 }] })
  const dorper = seller({ originalText: 'dorper', groups: [{ species: 'sheep', originalWording: '12 Dorper sheep', breed: 'Dorper', typeSex: 'sheep', quantity: 12 }] })
  expect(assessCompleteness(merino, 'listing', { onDate }).gaps.some((gap) => gap.field === 'wool')).toBe(false)
  expect(assessCompleteness(merino, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'wool')).toBe(true)
  expect(assessCompleteness(dorper, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'wool' || gap.field === 'earTag')).toBe(false)

  const angora = seller({ originalText: 'angora', groups: [{ species: 'goats', originalWording: '15 Angora does', breed: 'Angora', typeSex: 'doe', quantity: 15 }] })
  const boer = seller({ originalText: 'boer', groups: [{ species: 'goats', originalWording: '15 Boerbok goats', breed: 'Boerbok', typeSex: 'goat', quantity: 15 }] })
  expect(assessCompleteness(angora, 'listing', { onDate }).gaps.some((gap) => gap.field === 'fibre')).toBe(false)
  expect(assessCompleteness(angora, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'fibre')).toBe(true)
  expect(assessCompleteness(boer, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'fibre')).toBe(false)

  const dairy = seller({ originalText: 'dairy', groups: [{ species: 'cattle', originalWording: '8 dairy cows', breed: 'Holstein', typeSex: 'dairy cow', quantity: 8 }] })
  const beef = seller({ originalText: 'beef', groups: [{ species: 'cattle', originalWording: '8 Angus cows', breed: 'Angus', typeSex: 'cow', quantity: 8 }] })
  expect(assessCompleteness(dairy, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'dairy')).toBe(true)
  expect(assessCompleteness(beef, 'buyer_presentation', { onDate }).gaps.some((gap) => gap.field === 'dairy')).toBe(false)

  const conflict = proposeSellerFromText('10 Angus ewes', capturedAt)
  expect(conflict.groups[0].species).toBe('other')
  expect(conflict.groups[0].conflicts[0]).toContain('Neither was chosen')
  expect(assessCompleteness(conflict, 'listing', { onDate }).gaps.some((gap) => gap.kind === 'blocked')).toBe(true)

  const refused = seller({ originalText: 'refused', contactPermission: 'refused', groups: [{ species: 'cattle', originalWording: '2 cows', breed: 'Angus', typeSex: 'cow', quantity: 2 }] })
  expect(draftInformationRequest(refused, 'listing', { onDate }).body).toContain('Nothing was sent.')
})

test('matches explain themselves and do not treat unverified claims as proof', () => {
  const livestockCase = sampleCase()
  const match = explainMatch(livestockCase.seller, livestockCase.buyer!)
  expect(match.componentId).toBe(livestockCase.seller.groups[0].id)
  expect(match.assumptions).toEqual([])
  expect(match.estimatedDeliveredCost).toBeNull()
  expect(match.estimatedMargin).toBeNull()
  expect(match.outreachStarted).toBe(false)
  expect(match.sourcingOpened).toBe(false)
  expect(match.readyToReview).toBe(false)
  expect(match.score).toBeGreaterThan(0)
  expect(match.score).toBeLessThan(100)
  expect(match.hardMatches.join(' ')).toContain('Angus')
  expect(match.hardMatches.join(' ')).toContain('50')
  expect(match.missingInformation.join(' ')).toContain('Pregnancy status was not supplied')
  expect(match.distanceAndTransportImpact).toContain('No distance was calculated')
  expect(match.distanceAndTransportImpact.toLowerCase()).not.toMatch(/\bkm\b|kilomet/)
  expect(match.separations.join(' ')).toContain('30 calves')
  expect(match.separations.join(' ').toLowerCase()).not.toContain('pair')
  expect(match.draftMessages.buyer.sent).toBe(false)
  expect(match.draftMessages.seller.sent).toBe(false)
  expect(match.buyerFacingSummary).not.toContain('CP van der Merwe')
  expect(match.buyerFacingSummary).not.toContain('Ceres')
  expect(match.draftMessages.seller.body).not.toContain('Sample Buyer')
  expect(match.draftMessages.seller.body).not.toContain('R15000')
  expect(explainMatch(livestockCase.seller, livestockCase.buyer!, { disclosureApproved: true }).buyerFacingSummary).not.toContain('Ceres')
  const before = structuredClone(livestockCase.seller)
  explainMatch(livestockCase.seller, livestockCase.buyer!)
  expect(livestockCase.seller).toEqual(before)

  const sheepBuyer = proposeBuyerFromText('Buyer: Sheep Buyer\nSpecies: sheep\nBreed: Merino\nType: ewes\nQuantity: 10', capturedAt)
  const cross = explainMatch(livestockCase.seller, sheepBuyer)
  expect(cross.score).toBe(0)
  expect(cross.hardMismatches.join(' ')).toContain('does not match')
  expect(cross.recommendedAction).toBe('Do not present this group.')

  const stated = statedFact('in calf', 'in calf', 'test', 'seller', capturedAt)
  const sellerStock = seller({
    originalText: 'stated pregnancy',
    location: 'Ceres',
    expectedPrice: 'R12000 per head',
    groups: [{ species: 'cattle', originalWording: '50 Angus cows', breed: 'Angus', typeSex: 'cow', quantity: 50, pregnancy: 'in calf' }],
  })
  const statedBuyer = captureBuyer({
    originalText: 'buyer',
    capturedAt,
    buyerName: 'Sample Buyer',
    species: 'cattle',
    breed: 'Angus',
    typeSex: 'cows',
    quantityMin: 40,
    quantityMax: 60,
    pregnancyRequired: true,
    pregnancyWording: 'required',
    budget: 'R15000 per head',
    destination: 'Ceres',
  })
  const statedMatch = explainMatch(sellerStock, statedBuyer)
  expect(statedMatch.compromises.join(' ')).toContain('in calf')
  expect(statedMatch.compromises.join(' ')).toContain('not treated as verified')
  expect(statedMatch.readyToReview).toBe(false)
  expect(stated.verification).toBe('seller_stated')

  const payload = { field: 'pregnancy', value: 'in calf', wording: 'in calf', level: 'document_confirmed' }
  const approval = approve('health_or_pregnancy_confirmation', payload, 'Drikus', '2026-10-25T09:00:00.000Z')
  const confirmed = confirmFact(sellerStock.groups[0].pregnancy!, {
    field: 'pregnancy',
    level: 'document_confirmed',
    confirmer: 'Drikus',
    confirmedAt: '2026-10-25T09:00:00.000Z',
    approval,
    payload,
  })
  expect(sellerStock.groups[0].pregnancy?.verification).toBe('seller_stated')
  expect(confirmed.originalWording).toBe('in calf')
  expect(confirmed.value).toBe('in calf')
  const reviewed = explainMatch({ ...sellerStock, groups: [{ ...sellerStock.groups[0], pregnancy: confirmed }] }, statedBuyer)
  expect(reviewed.readyToReview).toBe(true)
  expect(reviewed.score).toBe(100)
  expect(reviewed.hardMatches.join(' ')).toContain('No extra veterinary conclusion was added')
  expect(reviewed.draftMessages.buyer.sent).toBe(false)
  expect(() => confirmFact(sellerStock.groups[0].pregnancy!, { field: 'pregnancy', level: 'document_confirmed', confirmer: 'ai', confirmedAt: capturedAt, approval, payload })).toThrow(/person/i)
  expect(() => confirmFact(sellerStock.groups[0].pregnancy!, { field: 'pregnancy', level: 'document_confirmed', confirmer: 'Drikus', confirmedAt: capturedAt, approval, payload: { ...payload, wording: 'clear' } })).toThrow(/approval/i)
})

test('permits, approvals and company scope stay closed', () => {
  const wording = 'Movement permit 123 as supplied'
  expect(assessPermit(undefined, onDate).blocksLoading).toBe(true)
  const expired = assessPermit({ exactWording: wording, issuer: 'State vet', expiresOn: '2026-10-24', documentConfirmed: true }, onDate)
  expect(expired.state).toBe('expired')
  expect(expired.detail).toContain(wording)
  const unverified = assessPermit({ exactWording: wording, issuer: 'State vet', expiresOn: '2026-10-26', documentConfirmed: false }, onDate)
  expect(unverified.state).toBe('unverified')
  expect(unverified.blocksLoading).toBe(true)
  const usable = { exactWording: wording, issuer: 'State vet', expiresOn: '2026-10-26', documentConfirmed: true }
  const payload = { stockId: 'seller-1', permitWording: wording, onDate }
  const approval = approve('loading_release', payload, 'Drikus', '2026-10-25T10:00:00.000Z')
  expect(canReleaseLoading({ permit: usable, onDate, quantityVerified: true, approval, payload }).ok).toBe(true)
  expect(canReleaseLoading({ permit: usable, onDate, quantityVerified: true, approval, payload: { ...payload, onDate: '2026-10-26' } }).ok).toBe(false)
  expect(approvalHolds(approval, 'loading_release', payload)).toBe(true)
  expect(() => approve('outgoing_message', payload, 'agent', '2026-10-25T10:00:00.000Z')).toThrow(/person/i)

  const history: StageEvent[] = []
  const event: StageEvent = { from: null, to: 'find_out_information', at: '2026-10-25T10:00:00.000Z', actor: 'Drikus', reason: 'Captured', evidence: 'seller message' }
  const next = appendStage(history, event)
  expect(history).toEqual([])
  expect(appendStage(next, event)).toHaveLength(1)
  expect(() => appendStage(next, { ...event, to: 'closed', reason: 'Skip', evidence: 'none' })).toThrow(/append-only/)
  expect(() => appendStage(history, { ...event, actor: 'ai' })).toThrow(/person/i)

  expect(() => captureSeller({ originalText: 'x', capturedAt, entity: 'farm_feed', groups: [] })).toThrow(/Digikraal/)
  expect(() => captureBuyer({ originalText: 'x', capturedAt, entity: 'northpoint', species: 'cattle' })).toThrow(/Digikraal/)
  const awkward = proposeBuyerFromText('Buyer: A\nSpecies: cattle\nQuantity: 60-40', capturedAt)
  expect(awkward.quantityUnusable).toBe(true)
  expect(awkward.status).toBe('new')
  expect(awkward.proposedLifecycle).toBe('needs_qualification')
  expect(buyerReadiness(awkward)).not.toHaveProperty('score')
  expect(buyerReadiness(awkward).notACreditDecision).toBe(true)

  expect(recommendedDealStage(proposeSellerFromText(SAMPLE_SELLER_TEXT, capturedAt), { onDate }).key).toBe('find_out_information')
  expect(sampleCase().sent).toBe(false)
  expect(sampleCase().published).toBe(false)
  expect(sampleCase().calendarWritten).toBe(false)
  expect(sampleCase().viewing?.location).toBeNull()
  expect(integrationContract.separateApp).toBe(false)
  expect(integrationContract.sendsMessages).toBe(false)
  expect(Object.keys(livestock).join(' ')).not.toMatch(/send|publish|whatsapp|invoice/i)
  expect(SAMPLE_BUYER_TEXT).toContain('Sample Buyer')
})

test('the desk shows the sample and does not send it', async ({ page }) => {
  const model = sampleDeskModel()
  expect(model.sample).toBe(true)
  expect(model.requestSent).toBe(false)
  expect(JSON.stringify(model).toLowerCase()).not.toContain('pregnant')
  expect(JSON.stringify(model).toLowerCase()).not.toMatch(/\bpairs?\b/)
  const { stdout: html } = await promisify(execFile)(process.execPath, ['tests/modules/005/render-desk.mjs'], { cwd: process.cwd(), maxBuffer: 2_000_000 })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.setContent(`<!doctype html><html><body>${html}</body></html>`)
  await expect(page.getByRole('heading', { name: 'Livestock agency' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '30 calves' })).toBeVisible()
  await expect(page.getByText('CP van der Merwe').first()).toBeVisible()
  await expect(page.getByText('Ceres').first()).toBeVisible()
  await expect(page.getByText('Seller stated · not verified').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Approve the information request' })).toBeDisabled()
  await expect(page.getByText(/This has not been sent/).first()).toBeVisible()
  await expect(page.getByText(/Movement permit not supplied/)).toBeVisible()
  await expect(page.getByText(/Nothing was written to a calendar/)).toBeVisible()
  const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  expect(overflows).toBe(false)
  expect(buildDeskModel(sampleCase(), onDate).audience).toBe('founder')
})
