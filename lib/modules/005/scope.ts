import { MODULE_COMPANY, MODULE_ID } from './types'

export function assertLivestockScope(record: { entity?: string; capability?: string }) {
  if (record.entity !== MODULE_COMPANY || record.capability !== MODULE_ID) {
    throw new Error('Livestock agency records stay inside Digikraal capability 005.')
  }
}

export function assertCaptureScope(entity: string | undefined, capability: string | undefined) {
  if ((entity && entity !== MODULE_COMPANY) || (capability && capability !== MODULE_ID)) {
    throw new Error('Livestock agency records stay inside Digikraal capability 005.')
  }
}

export function assertCapturedAt(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    throw new Error('A captured date is required.')
  }
}

export function assertDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('A calendar date is required.')
}

export function stableId(prefix: string, value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `${prefix}-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

export function dayFromCapturedAt(value: string) {
  assertCapturedAt(value)
  return value.slice(0, 10)
}
