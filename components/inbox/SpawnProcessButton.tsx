'use client'

import { useRouter } from 'next/navigation'

export function SpawnProcessButton({ itemId }: { itemId: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className="btn-primary text-sm"
      onClick={async () => {
        await fetch(`/api/inbox/${itemId}/spawn-process`, { method: 'POST' })
        router.refresh()
      }}
    >
      Start process
    </button>
  )
}
