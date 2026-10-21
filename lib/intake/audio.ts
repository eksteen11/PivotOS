export const AUDIO_EXTENSIONS = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'ogg', 'oga', 'opus'] as const

export const AUDIO_FILE_ACCEPT = [
  '.mp3',
  '.mp4',
  '.mpeg',
  '.mpga',
  '.m4a',
  '.wav',
  '.webm',
  '.ogg',
  '.oga',
  '.opus',
  'audio/mpeg',
  'audio/mp4',
  'audio/mpga',
  'audio/m4a',
  'audio/wav',
  'audio/webm',
  'video/mp4',
  'audio/ogg',
  'audio/opus',
].join(',')

const DIRECT_MIME = new Set([
  'audio/mpeg',
  'audio/mp4',
  'audio/mpga',
  'audio/m4a',
  'audio/wav',
  'audio/webm',
  'video/mp4',
  'audio/ogg',
  'audio/oga',
  'audio/opus',
  'application/ogg',
])

const FALLBACK_MIME = new Set(['', 'application/octet-stream'])

const MIME_FOR_EXTENSION: Record<(typeof AUDIO_EXTENSIONS)[number], string> = {
  mp3: 'audio/mpeg',
  mpeg: 'audio/mpeg',
  mpga: 'audio/mpeg',
  mp4: 'audio/mp4',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  webm: 'audio/webm',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/ogg',
}

export const UNSUPPORTED_AUDIO_ERROR = 'Unsupported audio format. Use mp3, mp4, mpeg, mpga, m4a, wav, webm, ogg, oga, or opus.'
export const RAW_OPUS_ERROR = 'This .opus file is not an Ogg Opus recording. WhatsApp voice notes use an Ogg container and can be uploaded directly.'

const OGG_MAGIC = [0x4f, 0x67, 0x67, 0x53]
const OPUS_HEAD = [0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64]

export type AudioExtension = (typeof AUDIO_EXTENSIONS)[number]

export function audioExtension(fileName: string): AudioExtension | '' {
  const index = fileName.lastIndexOf('.')
  const value = (index >= 0 ? fileName.slice(index + 1) : '').toLowerCase()
  return (AUDIO_EXTENSIONS as readonly string[]).includes(value) ? (value as AudioExtension) : ''
}

export function normalizeMime(value: string) {
  return value.split(';')[0].trim().toLowerCase()
}

export function assessAudioUpload(fileName: string, mimeType: string) {
  const extension = audioExtension(fileName)
  const mime = normalizeMime(mimeType)
  if (!extension || !(DIRECT_MIME.has(mime) || FALLBACK_MIME.has(mime))) {
    return { ok: false as const, error: UNSUPPORTED_AUDIO_ERROR }
  }
  return { ok: true as const, extension, mime, fallbackMime: FALLBACK_MIME.has(mime) }
}

export function isOggOpus(bytes: Uint8Array) {
  if (bytes.length < OGG_MAGIC.length + OPUS_HEAD.length) return false
  if (!OGG_MAGIC.every((byte, index) => bytes[index] === byte)) return false
  for (let start = 0; start <= bytes.length - OPUS_HEAD.length; start += 1) {
    if (OPUS_HEAD.every((byte, index) => bytes[start + index] === byte)) return true
  }
  return false
}

export async function openAiAudioPart(file: File) {
  const header = new Uint8Array(await file.slice(0, 512).arrayBuffer())
  const plan = planTranscriptionUpload(file.name, file.type, header)
  if (!plan.ok || !plan.rewrite) return plan.ok ? { ...plan, file } : plan
  return { ...plan, file: new File([await file.arrayBuffer()], plan.uploadName, { type: plan.mimeType }) }
}

export function planTranscriptionUpload(fileName: string, mimeType: string, header: Uint8Array) {
  const assessment = assessAudioUpload(fileName, mimeType)
  if (!assessment.ok) return assessment
  if (assessment.extension === 'opus' && !isOggOpus(header)) {
    return { ok: false as const, error: RAW_OPUS_ERROR }
  }
  const uploadName = assessment.extension === 'opus' || assessment.extension === 'oga'
    ? fileName.replace(/\.(opus|oga)$/i, '.ogg')
    : fileName
  const rewrite = assessment.extension === 'opus' || assessment.extension === 'oga' || assessment.fallbackMime
  return {
    ok: true as const,
    originalName: fileName,
    uploadName,
    mimeType: rewrite ? MIME_FOR_EXTENSION[assessment.extension] : assessment.mime || MIME_FOR_EXTENSION[assessment.extension],
    rewrite,
  }
}
