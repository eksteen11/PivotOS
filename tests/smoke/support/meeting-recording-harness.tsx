import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import { MeetingRecording } from '@/components/meetings/MeetingRecording'

const fail = new URLSearchParams(location.search).has('offline')
const recordings: { id: string; state: string; duration_ms: number; created_at: string; expires_at: null; segments: unknown[] }[] = []
const uploads: { sequence: number; size: number; type: string }[] = []
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(String(input), location.origin)
  if (url.pathname.endsWith('/segment')) {
    if (fail) return json(503, { error: 'Connection dropped. Audio is kept on this device.' })
    const blob = init?.body as Blob
    uploads.push({ sequence: Number(url.searchParams.get('sequence')), size: blob.size, type: blob.type })
    return json(200, { saved: true })
  }
  if (url.pathname.endsWith('/finish')) {
    const body = JSON.parse(String(init?.body))
    const recording = recordings.find((item) => item.id === body.id)
    if (recording) recording.state = 'complete'
    return json(200, { saved: true })
  }
  if (init?.method === 'POST') {
    const body = JSON.parse(String(init.body))
    if (!recordings.some((item) => item.id === body.id)) recordings.push({ id: body.id, state: 'capturing', duration_ms: 1000, created_at: new Date().toISOString(), expires_at: null, segments: [] })
    return json(200, { id: body.id })
  }
  return json(200, { recordings })
}) as typeof fetch
export function Harness() {
  const [visible, setVisible] = useState(true)
  return <main className="pivot-workspace"><div className="meeting-body"><button onClick={() => setVisible((value) => !value)}>Switch view</button><MeetingRecording meetingId="aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" ownerId="11111111-1111-4111-8111-111111111111" visible={visible} onTranscript={() => {}} /></div></main>
}
createRoot(document.getElementById('root')!).render(<Harness />)
;(window as unknown as { uploads: typeof uploads }).uploads = uploads
