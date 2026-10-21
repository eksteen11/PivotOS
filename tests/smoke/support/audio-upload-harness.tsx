import { createRoot } from 'react-dom/client'

import { AudioUploadStatus, IntakeComposerDialog } from '@/components/workspace/IntakeComposerDialog'

export function AudioUploadHarness() {
  return (
    <>
      <AudioUploadStatus fileName="voice-note.opus" phase="processing" progress={45} />
      <AudioUploadStatus fileName="ready-note.ogg" phase="ready" progress={100} />
      <IntakeComposerDialog preview busy={false} draftNamespace="audio-picker-test" onClose={() => undefined} onSaved={() => undefined} />
    </>
  )
}

createRoot(document.getElementById('root')!).render(<AudioUploadHarness />)
