export type ProcessStatus = 'draft' | 'active' | 'waiting' | 'blocked' | 'done' | 'cancelled'
export type AgentStatus = 'active' | 'paused' | 'archived'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'edited' | 'cancelled'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type ToolPermissionLevel = 'none' | 'read' | 'draft' | 'execute_with_approval' | 'execute_auto'

export type Entity = { id: string; slug: string; name: string; sort_order: number }
export type Division = { id: string; entity_id: string; slug: string; name: string }
export type Agent = {
  id: string
  entity_id: string
  division_id: string | null
  slug: string
  name: string
  role: string
  job_description: string
  status: AgentStatus
  entities?: { slug: string; name: string }
}
export type Process = {
  id: string
  entity_id: string
  template_slug: string | null
  title: string
  status: ProcessStatus
  human_owner: string | null
  deadline: string | null
  assigned_agent_id: string | null
  agents?: { name: string } | null
  entities?: { slug: string; name: string }
  process_steps?: ProcessStep[]
}
export type ProcessStep = {
  id: string
  process_id: string
  sort_order: number
  title: string
  status: string
}
export type Approval = {
  id: string
  entity_id: string
  agent_id: string | null
  action_type: string
  payload: Record<string, unknown>
  reason: string
  risk_level: RiskLevel
  status: ApprovalStatus
  created_at: string
  agents?: { name: string } | null
  entities?: { name: string }
}
export type Tool = {
  id: string
  slug: string
  name: string
  provider: string
  category: string
}
export type ToolConnection = {
  id: string
  entity_id: string
  tool_id: string
  status: string
  connected_account: string | null
  last_sync_at: string | null
  tools?: Tool
  entities?: { name: string }
}
export type InboxItem = {
  id: string
  entity_id: string | null
  title: string | null
  content: string
  source: string | null
  meta: Record<string, unknown>
  suggested_process?: string
  suggested_agent?: string
  urgency?: string
  entities?: { slug: string; name: string }
}
export type Memory = {
  id: string
  kind: string
  key: string
  content: string
}
