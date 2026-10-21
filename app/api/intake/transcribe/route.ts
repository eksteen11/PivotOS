import { NextResponse } from 'next/server'

import { openaiApiKey, openaiTranscribeModel } from '@/lib/env'
import { openAiAudioPart } from '@/lib/intake/audio'
import { requireFounderSession, sameOrigin, withTimeout } from '@/lib/intake/server'

const MAX_AUDIO_BYTES = 3 * 1024 * 1024

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
  const uploadPlan = await openAiAudioPart(file)
  if (!uploadPlan.ok) {
    return NextResponse.json({ error: uploadPlan.error }, { status: 400 })
  }

  const outgoing = new FormData()
  outgoing.set('file', uploadPlan.file, uploadPlan.uploadName)
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
        mimeType: uploadPlan.mimeType,
        fileName: uploadPlan.originalName,
        uploadFileName: uploadPlan.uploadName,
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
