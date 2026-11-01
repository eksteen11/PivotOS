import { clampText } from '@/lib/intake/shared'

export type VoiceTranscript = {
  id: string
  messageId: string
  originalLanguage: string
  originalText: string
  summary: string
  uncertain: boolean
  status: 'pending' | 'ready' | 'failed' | 'disconnected'
  provider: 'local-stub' | 'openai' | 'none'
  createdAt: string
}

/** Retain original-language transcript AND summary. Processing stays disconnected without credentials. */
export function buildVoiceTranscriptInterfaces(input: {
  id: string
  messageId: string
  originalLanguage?: string
  originalText?: string
  summary?: string
  uncertain?: boolean
  processingAvailable?: boolean
  at: string
}): VoiceTranscript {
  const available = Boolean(input.processingAvailable)
  const originalText = clampText(input.originalText ?? '', 20_000)
  const summary = clampText(input.summary ?? '', 4_000)
  if (!available) {
    return {
      id: input.id,
      messageId: input.messageId,
      originalLanguage: clampText(input.originalLanguage ?? '', 32) || 'undetected',
      originalText: originalText || '',
      summary: summary || '',
      uncertain: true,
      status: 'disconnected',
      provider: 'none',
      createdAt: input.at,
    }
  }
  return {
    id: input.id,
    messageId: input.messageId,
    originalLanguage: clampText(input.originalLanguage ?? 'undetected', 32) || 'undetected',
    originalText,
    summary,
    uncertain: Boolean(input.uncertain) || (!originalText && !summary),
    status: originalText || summary ? 'ready' : 'pending',
    provider: 'local-stub',
    createdAt: input.at,
  }
}

export function transcriptPanels(transcript: VoiceTranscript) {
  return {
    original: {
      label: 'Original-language transcript',
      text: transcript.originalText || (transcript.status === 'disconnected' ? 'Transcription is disconnected until processing credentials exist.' : 'Waiting for transcript.'),
      language: transcript.originalLanguage,
    },
    summary: {
      label: 'Summary',
      text: transcript.summary || (transcript.status === 'disconnected' ? 'Summary unavailable while transcription is disconnected.' : 'Waiting for summary.'),
    },
    uncertain: transcript.uncertain,
    status: transcript.status,
  }
}
