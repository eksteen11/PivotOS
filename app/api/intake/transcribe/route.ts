import { NextResponse } from 'next/server'

import { openaiApiKey, openaiTranscribeModel } from '@/lib/env'
import { requireFounderSession, sameOrigin, withTimeout } from '@/lib/intake/server'

const MAX_AUDIO_BYTES = 3 * 1024 * 1024
const SUPPORTED_AUDIO_MIME = new Set([
  'audio/mpeg',
  'audio/mp4',
  'audio/mpga',
  'audio/m4a',
  'audio/wav',
  'audio/webm',
  'video/mp4',
])
const SUPPORTED_EXTENSIONS = new Set(['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'])

function extension(name: string) {
  const index = name.lastIndexOf('.')
  return index >= 0 ? name.slice(index + 1).toLowerCase() : ''
}
function normalizeMime(value: string) {
  return value.split(';')[0].trim().toLowerCase()
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  }
  const auth = await requireFounderSession()
  if (!auth) {
    return NextResponse.json({ error: 'Founder sign-in required.' }, { status: 401 })
  }
  if (!openaiApiKey) {
    return NextResponse.json({ error: 'Transcription is unavailable until OpenAI is configured.' }, { status: 503 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('audio')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Audio file is required.' }, { status: 400 })
  }
  if (!file.size || file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: 'Audio must be greater than 0 bytes and below 3MB.' }, { status: 400 })
  }
  const fileExt = extension(file.name)
  if (!SUPPORTED_EXTENSIONS.has(fileExt) || !SUPPORTED_AUDIO_MIME.has(normalizeMime(file.type))) {
    return NextResponse.json(
      {
        error:
          'Unsupported audio format. Use mp3, mp4, mpeg, mpga, m4a, wav, or webm. WhatsApp .ogg/.opus is not accepted here unless converted first.',
      },
      { status: 400 },
    )
  }

  const outgoing = new FormData()
  outgoing.set('file', file, file.name)
  outgoing.set('model', openaiTranscribeModel)
  outgoing.set('response_format', 'text')
  const hints = String(form?.get('vocabularyHints') ?? '').trim().slice(0, 400)
  if (hints) outgoing.set('prompt', hints)

  const timeout = withTimeout(20000)
  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: outgoing,
      signal: timeout.signal,
    })
    if (!response.ok) {
      return NextResponse.json({ error: `Transcription failed (${response.status}).` }, { status: 502 })
    }
    const transcript = (await response.text()).trim()
    if (!transcript) {
      return NextResponse.json({ error: 'Transcription returned empty text.' }, { status: 502 })
    }
    return NextResponse.json({
      transcript,
      metadata: {
        model: openaiTranscribeModel,
        mimeType: file.type,
        fileName: file.name,
        sizeBytes: file.size,
        retainedAudio: false,
      },
    })
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'Transcription timed out. Please retry with a shorter recording.'
      : 'Transcription request failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  } finally {
    timeout.clear()
  }
}
