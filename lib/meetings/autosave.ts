export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export type AutosaveSnapshot = { status: AutosaveStatus; error: string; updatedAt: string }

export function createAutosave(options: {
  initialUpdatedAt: string
  delayMs?: number
  send: (input: { updatedAt: string; patch: Record<string, unknown> }) => Promise<{ ok: true; updatedAt: string } | { ok: false; error: string }>
}) {
  let updatedAt = options.initialUpdatedAt
  let status: AutosaveStatus = 'idle'
  let error = ''
  let timer: ReturnType<typeof setTimeout> | null = null
  let tail: Promise<void> = Promise.resolve()
  let lastPatch: Record<string, unknown> | null = null
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())

  function enqueue(patch: Record<string, unknown>) {
    lastPatch = patch
    const run = tail.then(async () => {
      status = 'saving'
      error = ''
      notify()
      try {
        const result = await options.send({ updatedAt, patch })
        if (!result.ok) {
          status = 'error'
          error = result.error
          notify()
          return
        }
        updatedAt = result.updatedAt
        status = 'saved'
        error = ''
        notify()
      } catch (thrown) {
        status = 'error'
        error = thrown instanceof Error && thrown.message ? thrown.message : 'The notes were not saved.'
        notify()
      }
    })
    tail = run.catch(() => undefined)
    return run
  }

  function snapshot(): AutosaveSnapshot {
    return { status, error, updatedAt }
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    snapshot,
    adopt(stamp: string) {
      updatedAt = stamp
    },
    hasPending() {
      return timer !== null || status === 'saving'
    },
    schedule(patch: Record<string, unknown>) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        void enqueue(patch)
      }, options.delayMs ?? 600)
    },
    async flush(patch: Record<string, unknown>) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      await enqueue(patch)
      return snapshot()
    },
    retry() {
      return lastPatch ? this.flush(lastPatch) : Promise.resolve(snapshot())
    },
  }
}
