import { createServer, type Server } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import esbuild from 'esbuild'

import {
  AUDIO_FILE_ACCEPT,
  assessAudioUpload,
  isOggOpus,
  openAiAudioPart,
  RAW_OPUS_ERROR,
  UNSUPPORTED_AUDIO_ERROR,
} from '../../lib/intake/audio'

function oggOpusBytes() {
  const payload = new Uint8Array(19)
  payload.set([0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], 0)
  payload[8] = 1
  payload[9] = 1
  const bytes = new Uint8Array(28 + payload.length)
  bytes.set([0x4f, 0x67, 0x67, 0x53], 0)
  bytes[26] = 1
  bytes[27] = payload.length
  bytes.set(payload, 28)
  return bytes
}

test('picker accept includes WhatsApp opus, ogg, and oga', () => {
  expect(AUDIO_FILE_ACCEPT).toContain('.opus')
  expect(AUDIO_FILE_ACCEPT).toContain('.ogg')
  expect(AUDIO_FILE_ACCEPT).toContain('.oga')
  expect(AUDIO_FILE_ACCEPT).toContain('audio/ogg')
})

test('browser MIME fallback allows a matching extension only', () => {
  expect(assessAudioUpload('voice-note.opus', '').ok).toBe(true)
  expect(assessAudioUpload('voice-note.opus', 'application/octet-stream').ok).toBe(true)
  expect(assessAudioUpload('voice-note.ogg', 'audio/ogg').ok).toBe(true)
  expect(assessAudioUpload('voice-note.oga', '').ok).toBe(true)
  expect(assessAudioUpload('notes.txt', '').ok).toBe(false)
  expect(assessAudioUpload('notes.txt', 'application/octet-stream').ok).toBe(false)
  const pdf = assessAudioUpload('voice-note.opus', 'application/pdf')
  expect(pdf.ok).toBe(false)
  if (!pdf.ok) expect(pdf.error).toBe(UNSUPPORTED_AUDIO_ERROR)
})

test('valid Ogg Opus bytes pass and raw or non-opus ogg bytes fail', () => {
  const ogg = oggOpusBytes()
  const raw = ogg.slice(28)
  const vorbis = ogg.slice()
  vorbis.set([0x76, 0x6f, 0x72, 0x62, 0x69, 0x73], 28)
  expect(isOggOpus(ogg)).toBe(true)
  expect(isOggOpus(raw)).toBe(false)
  expect(isOggOpus(vorbis)).toBe(false)
})

test('server normalizes a verified opus upload without changing bytes', async () => {
  const bytes = oggOpusBytes()
  const source = new File([bytes], 'voice-note.opus', { type: 'application/octet-stream' })
  const prepared = await openAiAudioPart(source)
  expect(prepared.ok).toBe(true)
  if (!prepared.ok) return
  expect(prepared.originalName).toBe('voice-note.opus')
  expect(prepared.uploadName).toBe('voice-note.ogg')
  expect(prepared.mimeType).toBe('audio/ogg')
  expect(Array.from(new Uint8Array(await prepared.file.arrayBuffer()))).toEqual(Array.from(bytes))

  const raw = new File([bytes.slice(28)], 'voice-note.opus', { type: '' })
  const rejected = await openAiAudioPart(raw)
  expect(rejected.ok).toBe(false)
  if (!rejected.ok) expect(rejected.error).toBe(RAW_OPUS_ERROR)
})

test('upload control and transcript status use the shared audio rules', async ({ page }) => {
  await esbuild.build({
    entryPoints: ['tests/smoke/support/audio-upload-harness.tsx'],
    bundle: true,
    outfile: 'test-results/audio-upload.js',
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    alias: { 'next/link': path.join(process.cwd(), 'tests/smoke/support/test-link.tsx') },
    plugins: [
      {
        name: 'at-alias',
        setup(build) {
          build.onResolve({ filter: /^@\// }, (args) => ({ path: resolveSource(path.join(process.cwd(), args.path.slice(2))) }))
        },
      },
    ],
  })
  const script = readFileSync('test-results/audio-upload.js')
  const server = createServer((request, response) => {
    if (request.url?.startsWith('/app.js')) {
      response.setHeader('content-type', 'text/javascript')
      response.end(script)
      return
    }
    response.setHeader('content-type', 'text/html')
    response.end('<!doctype html><html><body><div id="root"></div><script src="/app.js"></script></body></html>')
  })
  const port = await listen(server)
  try {
    await page.goto(`http://127.0.0.1:${port}/`)
    await expect(page.locator('input[type=file]')).toHaveAttribute('accept', AUDIO_FILE_ACCEPT)
    await expect(page.getByRole('status').filter({ hasText: 'voice-note.opus' })).toHaveText('voice-note.opus · Processing · 45%')
    await expect(page.getByRole('status').filter({ hasText: 'ready-note.ogg' })).toHaveText('ready-note.ogg · Transcript ready')
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

function resolveSource(base: string) {
  for (const ext of ['.tsx', '.ts', '.jsx', '.js']) {
    if (existsSync(base + ext)) return base + ext
    if (existsSync(path.join(base, `index${ext}`))) return path.join(base, `index${ext}`)
  }
  return base
}

function listen(server: Server) {
  return new Promise<number>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve(typeof address === 'object' && address ? address.port : 0)
    })
  })
}
