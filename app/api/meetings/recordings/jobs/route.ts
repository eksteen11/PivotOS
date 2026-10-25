import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { recordingAdmin } from '@/lib/meetings/recordingServer'
import { deleteExpiredRecordingAudio, transcribeRecordingSegment } from '@/lib/meetings/recordingJobs'

export async function GET(request: Request) {
  const secret = process.env.MEETINGS_JOB_SECRET
  const actual = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret ?? ''}`)
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 })
  const admin = recordingAdmin()
  if (!admin) return NextResponse.json({ error: 'Recording storage is unavailable.' }, { status: 503 })
  try {
    const retention = await deleteExpiredRecordingAudio(admin)
    const transcription = await transcribeRecordingSegment(admin)
    return NextResponse.json({ retention, transcription }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Recording jobs failed. Retry is safe.' }, { status: 503 })
  }
}
