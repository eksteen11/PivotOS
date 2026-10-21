export const MEETING_REQUEST_MS = 35_000

export const unconfirmedRequest = 'The response could not be confirmed. Reload to check, or retry the same review safely.'

function timeoutError() {
  const error = new Error(unconfirmedRequest)
  error.name = 'AbortError'
  return error
}

async function readJson(response: Response, remainingMs: number) {
  if (remainingMs <= 0) throw timeoutError()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(timeoutError()), remainingMs)
  })
  try {
    return await Promise.race([
      response.json().catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') throw error
        return {}
      }),
      timeout,
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function boundedFetch(input: string, init: RequestInit, timeoutMs = MEETING_REQUEST_MS) {
  const started = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(input, { ...init, signal: controller.signal })
    const body = await readJson(response, timeoutMs - (Date.now() - started))
    return { response, body }
  } finally {
    clearTimeout(timer)
  }
}

export function meetingRequestError() {
  return unconfirmedRequest
}
