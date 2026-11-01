import { FRESHNESS_HOURS, GITHUB_REPOSITORY, JIRA_PROJECT, githubKinds, githubStatuses, jiraLifecycle, type GithubKind, type GithubStatus, type JiraStatus } from './contract'

const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/

export type Freshness = 'unlinked' | 'undated' | 'stale' | 'fresh'

export type FreshnessReading = {
  freshness: Exclude<Freshness, 'unlinked'>
  ageHours: number | null
  usableAsCurrent: boolean
  statement: string
}

export function parseTimestamp(value: string | null | undefined): number | null {
  if (!value || !timestampPattern.test(value)) return null
  const ms = Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

export function assessFreshness(observedAt: string | null, asOf: string, freshnessHours = FRESHNESS_HOURS): FreshnessReading {
  const observedMs = parseTimestamp(observedAt)
  const asOfMs = parseTimestamp(asOf)
  if (observedMs === null || asOfMs === null) {
    return { freshness: 'undated', ageHours: null, usableAsCurrent: false, statement: 'This observation has no trusted time, so it is not current delivery status.' }
  }
  if (observedMs > asOfMs) {
    return { freshness: 'undated', ageHours: null, usableAsCurrent: false, statement: 'The observation time is after the review time, so it is not trusted as current delivery status.' }
  }
  const ageHours = (asOfMs - observedMs) / 3_600_000
  if (ageHours > freshnessHours) {
    return { freshness: 'stale', ageHours, usableAsCurrent: false, statement: `This linked source is ${formatAge(ageHours)} old. It is not current delivery status.` }
  }
  return { freshness: 'fresh', ageHours, usableAsCurrent: true, statement: `Pasted ${formatAge(ageHours)} ago. This is not a live read.` }
}

export function isJiraStatus(value: string): value is JiraStatus {
  return (jiraLifecycle as readonly string[]).includes(value)
}

export function parseJiraKey(value: string): { ok: true; key: string } | { ok: false; error: string } {
  const key = value.trim().toUpperCase()
  if (!new RegExp(`^${JIRA_PROJECT}-\\d+$`).test(key)) {
    return { ok: false, error: `Jira delivery for this module stays on project ${JIRA_PROJECT}. This key was not recorded.` }
  }
  return { ok: true, key }
}

export function isGithubKind(value: string): value is GithubKind {
  return (githubKinds as readonly string[]).includes(value)
}

export function isGithubStatus(kind: GithubKind, value: string): value is GithubStatus {
  return (githubStatuses[kind] as readonly string[]).includes(value)
}

export type GithubRef = { repository: typeof GITHUB_REPOSITORY; kind: GithubKind; key: string }

export function parseGithubReference(reference: string, kind: string): { ok: true; ref: GithubRef } | { ok: false; error: string } {
  if (!isGithubKind(kind)) return { ok: false, error: 'Choose a pull request, commit or branch. Nothing was recorded.' }
  const parsed = splitGithubReference(reference.trim())
  if (!parsed.ok) return parsed
  if (parsed.kind !== kind) return { ok: false, error: 'The GitHub reference does not match the selected record type. Nothing was recorded.' }
  return { ok: true, ref: { repository: GITHUB_REPOSITORY, kind: parsed.kind, key: parsed.key } }
}

/** A GitHub record is code history. It does not prove the public site is live. */
export function githubProvesProduction(): false {
  return false
}

export const githubProductionStatement = 'A GitHub record is code history. A merged pull request does not show that the public site is live. Branch names do not prove that staging and production are separate.'

export const confluenceStatement = 'The Confluence roadmap is reference material. It is not an approved release.'

function formatAge(hours: number): string {
  if (hours < 1) return 'less than an hour'
  const whole = Math.floor(hours)
  return whole === 1 ? '1 hour' : `${whole} hours`
}

function splitGithubReference(reference: string): { ok: true; kind: GithubKind; key: string } | { ok: false; error: string } {
  if (!reference) return { ok: false, error: 'Paste the GitHub reference. Nothing was recorded.' }
  const url = readGithubUrl(reference)
  if (url && !url.ok) return url
  const path = url && url.ok ? url.path : reference
  const repo = GITHUB_REPOSITORY
  const owned = new RegExp(`^${repo.replace('/', '\\/')}([#@:].+|/pull/\\d+|/commit/[0-9a-f]{7,40}|/tree/.+)$`, 'i').exec(path)
  if (!owned) return { ok: false, error: `Code records stay on ${repo}. This reference was not recorded.` }
  const rest = owned[1]
  const pull = /^#(\d+)$/.exec(rest) ?? /^\/pull\/(\d+)$/.exec(rest)
  if (pull) return { ok: true, kind: 'pull_request', key: `${repo}#${pull[1]}` }
  const commit = /^@([0-9a-f]{7,40})$/i.exec(rest) ?? /^\/commit\/([0-9a-f]{7,40})$/i.exec(rest)
  if (commit) return { ok: true, kind: 'commit', key: `${repo}@${commit[1].toLowerCase()}` }
  const branch = /^:([A-Za-z0-9._/-]+)$/.exec(rest) ?? /^\/tree\/([A-Za-z0-9._/-]+)$/.exec(rest)
  if (branch && !branch[1].includes('..')) return { ok: true, kind: 'branch', key: `${repo}:${branch[1]}` }
  return { ok: false, error: `Code records stay on ${repo}. This reference was not recorded.` }
}

function readGithubUrl(reference: string): { ok: true; path: string } | { ok: false; error: string } | null {
  if (!/^https?:\/\//i.test(reference)) return null
  let url: URL
  try {
    url = new URL(reference)
  } catch {
    return { ok: false, error: 'That GitHub link could not be read. Nothing was recorded.' }
  }
  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com') {
    return { ok: false, error: `Code records stay on ${GITHUB_REPOSITORY}. This reference was not recorded.` }
  }
  return { ok: true, path: url.pathname.replace(/^\//, '').replace(/\/$/, '') }
}

