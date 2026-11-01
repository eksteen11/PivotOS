import type { Company } from '../../workspace/catalogue'

/** Capability 011 stays inside Pivot OS. It is not a division app and it does not publish the public site. */
export const MODULE_011_ID = '011' as const
export const MODULE_011_COMPANY = 'digikraal' as const satisfies Company
export const JIRA_PROJECT = 'MRK' as const
export const GITHUB_REPOSITORY = 'Digikraal/digikraal-deftsoft' as const
export const PUBLIC_SITE = 'digikraal.co.za' as const
export const FRESHNESS_HOURS = 168
export const EXAMPLE_AS_OF = '2026-10-25T12:00:00.000Z'

export const workItemTypes = [
  'product_initiative',
  'epic',
  'feature',
  'improvement',
  'defect',
  'production_incident',
  'security_or_privacy',
  'technical_debt',
  'data_correction',
  'content_change',
  'analytics_or_tracking',
  'infrastructure_change',
  'investigation',
  'operational_task',
] as const

export type WorkItemType = (typeof workItemTypes)[number]

export const workItemLabels: Record<WorkItemType, string> = {
  product_initiative: 'Product initiative',
  epic: 'Epic',
  feature: 'Feature',
  improvement: 'Improvement',
  defect: 'Defect',
  production_incident: 'Production incident',
  security_or_privacy: 'Security or privacy issue',
  technical_debt: 'Technical debt',
  data_correction: 'Data correction',
  content_change: 'Content change',
  analytics_or_tracking: 'Analytics or tracking change',
  infrastructure_change: 'Infrastructure change',
  investigation: 'Investigation',
  operational_task: 'Operational task',
}

export const jiraLifecycle = [
  'captured',
  'needs_clarification',
  'backlog',
  'prioritised',
  'ready_for_development',
  'in_progress',
  'code_review',
  'ready_for_testing',
  'testing',
  'staging',
  'awaiting_business_approval',
  'ready_for_production',
  'deploying',
  'production_validation',
  'done',
  'blocked',
  'rework',
  'deferred',
  'duplicate',
  'rejected',
  'cancelled',
  'incident_monitoring',
] as const

export type JiraStatus = (typeof jiraLifecycle)[number]

export const jiraStatusLabels: Record<JiraStatus, string> = {
  captured: 'Captured',
  needs_clarification: 'Needs clarification',
  backlog: 'Backlog',
  prioritised: 'Prioritised',
  ready_for_development: 'Ready for development',
  in_progress: 'In progress',
  code_review: 'Code review',
  ready_for_testing: 'Ready for testing',
  testing: 'Testing',
  staging: 'Staging',
  awaiting_business_approval: 'Awaiting business approval',
  ready_for_production: 'Ready for production',
  deploying: 'Deploying',
  production_validation: 'Production validation',
  done: 'Done',
  blocked: 'Blocked',
  rework: 'Rework',
  deferred: 'Deferred',
  duplicate: 'Duplicate',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  incident_monitoring: 'Incident monitoring',
}

/** These pasted statuses look like a production outcome. They still need a real source and an identifiable approver. */
export const productionLookingStatuses = ['deploying', 'production_validation', 'done'] as const

export const releaseApprovers = ['Drikus', 'Conrad', 'Emma'] as const
export type ReleaseApprover = (typeof releaseApprovers)[number]

export const githubKinds = ['pull_request', 'commit', 'branch'] as const
export type GithubKind = (typeof githubKinds)[number]

export const githubStatuses = {
  pull_request: ['open', 'closed', 'merged', 'draft'],
  commit: ['referenced'],
  branch: ['named'],
} as const

export type GithubStatus = (typeof githubStatuses)[GithubKind][number]

/**
 * Live reads are unavailable. A pasted note is not a connection.
 * Confluence remains reference material and is not a release promise.
 */
export const module011Integrations = {
  jira: 'not_connected',
  github: 'not_connected',
  publicSite: 'not_published_from_pivot',
  payments: 'unavailable',
  confluence: 'reference_only',
  liveSync: false,
} as const

export const MODULE_011_INTEGRATION = {
  moduleId: MODULE_011_ID,
  product: 'Pivot OS',
  name: 'Digital products and marketplace',
  company: MODULE_011_COMPANY,
  separateApp: false,
  placement: 'internal-module',
  publicSite: PUBLIC_SITE,
  jiraProject: JIRA_PROJECT,
  githubRepository: GITHUB_REPOSITORY,
  freshnessHours: FRESHNESS_HOURS,
  ownedPaths: ['lib/modules/011/', 'components/modules/011/', 'tests/modules/011/', 'plan/CURSOR_MODULE_011_STATUS.md'],
  leavesToCeo: ['Shared routes', 'Desk shell', 'Auth', 'Schema', 'Inbox persistence', 'Approval persistence', 'Deployment'],
  consumes: ['Company'],
  doesNotDuplicate: ['Work save', 'Approval execution', 'Jira writes', 'GitHub writes', 'Public site publication'],
  systemsOfRecord: {
    jira: 'Roadmap selection, work items, acceptance, release status, testing evidence, approvals and production outcomes.',
    github: 'Source, branches, commits, pull requests, code-review evidence and technical change history.',
    pivot: 'Founder brief, pasted observations and whether those observations are still fresh. Pivot does not own the delivery record.',
    confluence: 'Historical roadmap reference. Not an approved release.',
  },
  mount: {
    when: "company === 'digikraal' && systemId === '011'",
    component: 'DigitalProductDesk',
    props: 'initial: DeskState',
    persistence: 'No table in this slice. CEO chooses where a request JSON is stored on the existing work record.',
  },
  entry: {
    capture: 'captureRequest',
    delivery: 'deliveryStatus',
    staleness: 'assessFreshness',
    next: 'nextMove',
    apply: 'applyDeskAction',
    example: 'exampleDeskState',
    component: 'DigitalProductDesk',
  },
  attributes: [
    'data-module="011"',
    'data-company="digikraal"',
    'data-jira="not-connected"',
    'data-github="not-connected"',
    'data-public-site="not-published-from-pivot"',
    'data-payments="unavailable"',
    'data-separate-app="false"',
  ],
  approval: 'A normal production note names Drikus, Conrad or Emma. The note does not deploy and does not publish the public site.',
  execution: 'publish, deploy, create Jira issue and open pull request are refused.',
} as const
