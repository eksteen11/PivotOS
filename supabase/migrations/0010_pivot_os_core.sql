-- Pivot OS V3 core schema: processes, agents, tools, approvals, memory, logs

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'process_status') then
    create type process_status as enum ('draft', 'active', 'waiting', 'blocked', 'done', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'step_status') then
    create type step_status as enum ('pending', 'in_progress', 'waiting', 'done', 'skipped');
  end if;
  if not exists (select 1 from pg_type where typname = 'agent_status') then
    create type agent_status as enum ('active', 'paused', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'tool_connection_status') then
    create type tool_connection_status as enum ('disconnected', 'connected', 'error', 'expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'tool_permission_level') then
    create type tool_permission_level as enum ('none', 'read', 'draft', 'execute_with_approval', 'execute_auto');
  end if;
  if not exists (select 1 from pg_type where typname = 'approval_status') then
    create type approval_status as enum ('pending', 'approved', 'rejected', 'edited', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'risk_level') then
    create type risk_level as enum ('low', 'medium', 'high', 'critical');
  end if;
  if not exists (select 1 from pg_type where typname = 'memory_kind') then
    create type memory_kind as enum (
      'contact', 'company', 'preference', 'decision', 'process_history',
      'document_summary', 'agent_performance', 'pattern', 'other'
    );
  end if;
end $$;

-- Agents (must exist before processes reference them)
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  division_id uuid references public.divisions (id) on delete set null,
  slug text not null,
  name text not null,
  role text not null default '',
  job_description text not null default '',
  responsibilities jsonb not null default '[]'::jsonb,
  approval_rules jsonb not null default '{}'::jsonb,
  memory_scope text not null default 'entity',
  supervisor_agent_id uuid references public.agents (id) on delete set null,
  escalation_rules jsonb not null default '{}'::jsonb,
  status agent_status not null default 'active',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entity_id, slug)
);

-- Tool catalog (global definitions)
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  provider text not null default '',
  category text not null default 'integration',
  oauth_config jsonb not null default '{}'::jsonb,
  capabilities jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User/entity tool connections
create table if not exists public.tool_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  tool_id uuid not null references public.tools (id) on delete cascade,
  status tool_connection_status not null default 'disconnected',
  oauth_tokens_ref text,
  scopes text[] not null default '{}',
  connected_account text,
  last_sync_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entity_id, tool_id)
);

-- Agent ↔ tool permissions
create table if not exists public.agent_tools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete cascade,
  tool_connection_id uuid not null references public.tool_connections (id) on delete cascade,
  permission_level tool_permission_level not null default 'none',
  constraints jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agent_id, tool_connection_id)
);

-- Business processes
create table if not exists public.processes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  division_id uuid references public.divisions (id) on delete set null,
  workstream_id uuid references public.workstreams (id) on delete set null,
  template_slug text,
  title text not null,
  status process_status not null default 'draft',
  assigned_agent_id uuid references public.agents (id) on delete set null,
  human_owner text,
  deadline timestamptz,
  inbox_item_id uuid references public.items (id) on delete set null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  process_id uuid not null references public.processes (id) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  status step_status not null default 'pending',
  assigned_agent_id uuid references public.agents (id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Link items to processes
alter table public.items add column if not exists process_id uuid references public.processes (id) on delete set null;
create index if not exists idx_items_process on public.items (user_id, process_id);

-- Approvals
create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  agent_id uuid references public.agents (id) on delete set null,
  process_id uuid references public.processes (id) on delete set null,
  action_type text not null,
  payload jsonb not null default '{}'::jsonb,
  reason text not null default '',
  risk_level risk_level not null default 'medium',
  status approval_status not null default 'pending',
  resolved_by uuid references auth.users (id) on delete set null,
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memory layer
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  agent_id uuid references public.agents (id) on delete set null,
  kind memory_kind not null default 'other',
  key text not null default '',
  content text not null default '',
  source_type text,
  source_id uuid,
  expires_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Activity logs (immutable trail)
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid references public.entities (id) on delete set null,
  agent_id uuid references public.agents (id) on delete set null,
  process_id uuid references public.processes (id) on delete set null,
  approval_id uuid references public.approvals (id) on delete set null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  title text not null,
  storage_path text,
  mime text,
  summary text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contacts (normalized)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Inbox classification view
create or replace view public.inbox_items as
select
  i.*,
  coalesce(i.meta->>'suggested_process', '') as suggested_process,
  coalesce(i.meta->>'suggested_agent', '') as suggested_agent,
  coalesce(i.meta->>'urgency', 'normal') as urgency
from public.items i
where i.status = 'inbox' and i.deleted_at is null;

-- Indexes
create index if not exists idx_agents_entity on public.agents (user_id, entity_id, status);
create index if not exists idx_processes_entity on public.processes (user_id, entity_id, status);
create index if not exists idx_process_steps_process on public.process_steps (process_id, sort_order);
create index if not exists idx_approvals_pending on public.approvals (user_id, status) where status = 'pending';
create index if not exists idx_activity_logs_entity on public.activity_logs (user_id, entity_id, created_at desc);
create index if not exists idx_memories_entity on public.memories (user_id, entity_id, kind);

-- updated_at triggers
drop trigger if exists agents_set_updated_at on public.agents;
create trigger agents_set_updated_at before update on public.agents for each row execute function public.set_updated_at();
drop trigger if exists tools_set_updated_at on public.tools;
create trigger tools_set_updated_at before update on public.tools for each row execute function public.set_updated_at();
drop trigger if exists tool_connections_set_updated_at on public.tool_connections;
create trigger tool_connections_set_updated_at before update on public.tool_connections for each row execute function public.set_updated_at();
drop trigger if exists agent_tools_set_updated_at on public.agent_tools;
create trigger agent_tools_set_updated_at before update on public.agent_tools for each row execute function public.set_updated_at();
drop trigger if exists processes_set_updated_at on public.processes;
create trigger processes_set_updated_at before update on public.processes for each row execute function public.set_updated_at();
drop trigger if exists process_steps_set_updated_at on public.process_steps;
create trigger process_steps_set_updated_at before update on public.process_steps for each row execute function public.set_updated_at();
drop trigger if exists approvals_set_updated_at on public.approvals;
create trigger approvals_set_updated_at before update on public.approvals for each row execute function public.set_updated_at();
drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at before update on public.memories for each row execute function public.set_updated_at();
drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at before update on public.documents for each row execute function public.set_updated_at();
drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at before update on public.contacts for each row execute function public.set_updated_at();

-- RLS enable
alter table public.agents enable row level security;
alter table public.tools enable row level security;
alter table public.tool_connections enable row level security;
alter table public.agent_tools enable row level security;
alter table public.processes enable row level security;
alter table public.process_steps enable row level security;
alter table public.approvals enable row level security;
alter table public.memories enable row level security;
alter table public.activity_logs enable row level security;
alter table public.documents enable row level security;
alter table public.contacts enable row level security;

-- tools catalog: readable by all authenticated
drop policy if exists tools_select on public.tools;
create policy tools_select on public.tools for select to authenticated using (true);

-- Entity-scoped tables: owner or member
drop policy if exists agents_rw on public.agents;
create policy agents_rw on public.agents for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

drop policy if exists tool_connections_rw on public.tool_connections;
create policy tool_connections_rw on public.tool_connections for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

drop policy if exists agent_tools_rw on public.agent_tools;
create policy agent_tools_rw on public.agent_tools for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists processes_rw on public.processes;
create policy processes_rw on public.processes for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

drop policy if exists process_steps_rw on public.process_steps;
create policy process_steps_rw on public.process_steps for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists approvals_rw on public.approvals;
create policy approvals_rw on public.approvals for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

drop policy if exists memories_rw on public.memories;
create policy memories_rw on public.memories for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

drop policy if exists activity_logs_rw on public.activity_logs;
create policy activity_logs_select on public.activity_logs for select to authenticated
using (auth.uid() = user_id or (entity_id is not null and public.user_is_entity_member(entity_id)));
create policy activity_logs_insert on public.activity_logs for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists documents_rw on public.documents;
create policy documents_rw on public.documents for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

drop policy if exists contacts_rw on public.contacts;
create policy contacts_rw on public.contacts for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));

-- workstreams RLS (was owner-only in 0006)
drop policy if exists workstreams_rw on public.workstreams;
create policy workstreams_rw on public.workstreams for all to authenticated
using (auth.uid() = user_id or public.user_is_entity_member(entity_id))
with check (auth.uid() = user_id and public.user_is_entity_member(entity_id));
