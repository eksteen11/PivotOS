-- Pivot OS V3 demo seed: tools catalog + per-user agents, connections, processes, approvals

-- Global tool catalog
insert into public.tools (slug, name, provider, category, capabilities, sort_order) values
  ('gmail', 'Gmail', 'Google', 'email', '["read","draft","send"]', 0),
  ('google_calendar', 'Google Calendar', 'Google', 'calendar', '["read","create","update"]', 1),
  ('google_drive', 'Google Drive', 'Google', 'storage', '["read","upload"]', 2),
  ('whatsapp', 'WhatsApp Business', 'Meta', 'messaging', '["read","send"]', 3),
  ('xero', 'Xero', 'Xero', 'finance', '["read","draft_invoice"]', 4),
  ('sage', 'Sage', 'Sage', 'finance', '["read"]', 5),
  ('hubspot', 'HubSpot', 'HubSpot', 'crm', '["read","create_lead"]', 6),
  ('airtable', 'Airtable', 'Airtable', 'data', '["read","write"]', 7),
  ('property24', 'Property24', 'Property24', 'listings', '["read","publish"]', 8),
  ('webhook', 'Webhooks', 'Pivot OS', 'automation', '["receive","send"]', 9),
  ('custom_api', 'Custom API', 'Custom', 'integration', '["custom"]', 10)
on conflict (slug) do nothing;

-- Seed demo data for a user (idempotent)
create or replace function public.seed_pivot_os_demo(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  e_dj uuid; e_dk uuid; e_ff uuid; e_np uuid;
  a_ceo uuid; a_ea uuid; a_sales uuid; a_fin uuid; a_legal uuid;
  a_mkt uuid; a_ops uuid; a_list uuid; a_ff uuid; a_dk uuid; a_np uuid;
  tc_gmail uuid; tc_xero uuid; tc_wa uuid;
  p_lead uuid;
  t_gmail uuid; t_xero uuid; t_wa uuid;
begin
  select id into t_gmail from public.tools where slug = 'gmail';
  select id into t_xero from public.tools where slug = 'xero';
  select id into t_wa from public.tools where slug = 'whatsapp';

  select id into e_dj from public.entities where user_id = p_user_id and slug = 'dj' limit 1;
  select id into e_dk from public.entities where user_id = p_user_id and slug = 'digikraal' limit 1;
  select id into e_ff from public.entities where user_id = p_user_id and slug = 'farm_feed' limit 1;
  select id into e_np from public.entities where user_id = p_user_id and slug = 'northpoint' limit 1;

  if e_dk is null then return; end if;

  -- Agents
  insert into public.agents (user_id, entity_id, slug, name, role, job_description, status)
  values
    (p_user_id, e_dk, 'ceo', 'CEO Agent', 'Chief Executive', 'Strategic oversight and cross-entity coordination.', 'active'),
    (p_user_id, e_dj, 'executive_assistant', 'Executive Assistant', 'Executive Assistant', 'Triage inbox, schedule, draft communications.', 'active'),
    (p_user_id, e_dk, 'sales', 'Sales Agent', 'Sales', 'Lead qualification, quotes, follow-ups.', 'active'),
    (p_user_id, e_dk, 'finance', 'Finance Agent', 'Finance', 'Invoices, payments, debtor follow-up.', 'active'),
    (p_user_id, e_dk, 'legal', 'Legal Agent', 'Legal', 'Contract review, compliance checks.', 'paused'),
    (p_user_id, e_dk, 'marketing', 'Marketing Agent', 'Marketing', 'Content, campaigns, social.', 'active'),
    (p_user_id, e_dk, 'operations', 'Operations Agent', 'Operations', 'Projects, logistics, admin.', 'active'),
    (p_user_id, e_np, 'listing', 'Listing Agent', 'Listings', 'Property listings and viewings.', 'active'),
    (p_user_id, e_ff, 'quote', 'Farm Feed Quote Agent', 'Quotes', 'Commodity quotes and pricing.', 'active'),
    (p_user_id, e_dk, 'livestock', 'Digikraal Livestock Agent', 'Livestock', 'Livestock sales and logistics.', 'active'),
    (p_user_id, e_np, 'property', 'Northpoint Property Agent', 'Property', 'Buyer/seller pipeline management.', 'active')
  on conflict (user_id, entity_id, slug) do nothing;

  select id into a_ceo from public.agents where user_id = p_user_id and slug = 'ceo' and entity_id = e_dk;
  select id into a_ea from public.agents where user_id = p_user_id and slug = 'executive_assistant' and entity_id = e_dj;
  select id into a_sales from public.agents where user_id = p_user_id and slug = 'sales' and entity_id = e_dk;
  select id into a_fin from public.agents where user_id = p_user_id and slug = 'finance' and entity_id = e_dk;
  select id into a_list from public.agents where user_id = p_user_id and slug = 'listing' and entity_id = e_np;
  select id into a_ff from public.agents where user_id = p_user_id and slug = 'quote' and entity_id = e_ff;

  -- Placeholder tool connections (disconnected)
  insert into public.tool_connections (user_id, entity_id, tool_id, status, connected_account)
  values
    (p_user_id, e_dj, t_gmail, 'disconnected', null),
    (p_user_id, e_dk, t_xero, 'disconnected', null),
    (p_user_id, e_dk, t_wa, 'disconnected', null)
  on conflict (user_id, entity_id, tool_id) do nothing;

  select id into tc_gmail from public.tool_connections where user_id = p_user_id and entity_id = e_dj and tool_id = t_gmail;
  select id into tc_xero from public.tool_connections where user_id = p_user_id and entity_id = e_dk and tool_id = t_xero;
  select id into tc_wa from public.tool_connections where user_id = p_user_id and entity_id = e_dk and tool_id = t_wa;

  if a_ea is not null and tc_gmail is not null then
    insert into public.agent_tools (user_id, agent_id, tool_connection_id, permission_level)
    values (p_user_id, a_ea, tc_gmail, 'draft')
    on conflict (agent_id, tool_connection_id) do nothing;
  end if;

  if a_fin is not null and tc_xero is not null then
    insert into public.agent_tools (user_id, agent_id, tool_connection_id, permission_level)
    values (p_user_id, a_fin, tc_xero, 'execute_with_approval')
    on conflict (agent_id, tool_connection_id) do nothing;
  end if;

  -- Sample processes
  if not exists (select 1 from public.processes where user_id = p_user_id and title = 'Rohan Rule 72 — platform build lead') then
    insert into public.processes (user_id, entity_id, template_slug, title, status, assigned_agent_id, human_owner, deadline)
    values
      (p_user_id, e_dk, 'lead', 'Rohan Rule 72 — platform build lead', 'active', a_sales, 'DJ Eksteen', now() + interval '7 days'),
      (p_user_id, e_np, 'listing', 'Hartebeesfontein listing', 'waiting', a_list, 'DJ Eksteen', now() + interval '14 days'),
      (p_user_id, e_ff, 'quote', 'Maize quote — Western Cape', 'active', a_ff, 'DJ Eksteen', now() + interval '3 days'),
      (p_user_id, e_dk, 'finance', 'Invoice follow-up batch', 'blocked', a_fin, 'DJ Eksteen', now() + interval '2 days'),
      (p_user_id, e_dj, 'follow_up', 'Church trust remittance', 'active', a_ea, 'DJ Eksteen', now() + interval '5 days');
  end if;

  select id into p_lead from public.processes where user_id = p_user_id and title like 'Rohan Rule%' limit 1;

  if p_lead is not null and not exists (select 1 from public.process_steps where process_id = p_lead) then
    insert into public.process_steps (user_id, process_id, sort_order, title, status, assigned_agent_id)
    values
      (p_user_id, p_lead, 0, 'Qualify lead', 'done', a_sales),
      (p_user_id, p_lead, 1, 'Send proposal', 'in_progress', a_sales),
      (p_user_id, p_lead, 2, 'Schedule demo', 'pending', a_sales);
  end if;

  -- Demo inbox items (if none exist)
  if not exists (select 1 from public.items where user_id = p_user_id and status = 'inbox' and meta->>'seed_batch' = 'pivot_os_demo') then
    insert into public.items (user_id, entity_id, type, status, title, content, source, meta)
    values
      (p_user_id, e_dk, 'note', 'inbox', 'WhatsApp: New cattle enquiry', 'Hi, I have 50 Bonsmara for sale. Can you quote transport to Cape Town?', 'whatsapp',
        '{"seed_batch":"pivot_os_demo","suggested_process":"lead","suggested_agent":"sales","urgency":"high"}'::jsonb),
      (p_user_id, e_dj, 'note', 'inbox', 'Email: Trust fund reminder', 'Please send monthly trust fund remittance reports by Friday.', 'gmail',
        '{"seed_batch":"pivot_os_demo","suggested_process":"follow_up","suggested_agent":"executive_assistant","urgency":"normal"}'::jsonb),
      (p_user_id, e_np, 'note', 'inbox', 'Form lead: Hartebeesfontein viewing', 'Buyer wants viewing Saturday 10am. Budget R2.1M.', 'website',
        '{"seed_batch":"pivot_os_demo","suggested_process":"listing","suggested_agent":"property","urgency":"high"}'::jsonb);
  end if;

  -- Pending approvals
  if not exists (select 1 from public.approvals where user_id = p_user_id and status = 'pending' and action_type = 'send_email') then
    insert into public.approvals (user_id, entity_id, agent_id, action_type, payload, reason, risk_level, status)
    values
      (p_user_id, e_dk, a_sales, 'send_email',
        '{"to":"rohan@example.com","subject":"Digikraal platform proposal","body":"Please find attached our proposal..."}'::jsonb,
        'Sales Agent drafted follow-up email for Rohan Rule 72 lead.', 'medium', 'pending'),
      (p_user_id, e_dk, a_fin, 'send_whatsapp',
        '{"to":"+27821234567","body":"Reminder: invoice #1042 overdue by 14 days."}'::jsonb,
        'Finance Agent proposes debtor reminder via WhatsApp.', 'high', 'pending'),
      (p_user_id, e_dj, a_ea, 'create_calendar_event',
        '{"title":"Trust fund report deadline","when":"Friday 17:00"}'::jsonb,
        'Executive Assistant proposes calendar block for trust remittance.', 'low', 'pending');
  end if;

  -- Activity log samples
  insert into public.activity_logs (user_id, entity_id, agent_id, action, payload)
  select p_user_id, e_dk, a_sales, 'agent.suggested_action', '{"type":"send_email","process":"lead"}'::jsonb
  where not exists (select 1 from public.activity_logs where user_id = p_user_id and action = 'agent.suggested_action' limit 1);

  -- Memory sample
  insert into public.memories (user_id, entity_id, agent_id, kind, key, content)
  select p_user_id, e_dk, a_sales, 'pattern', 'invoice_follow_ups',
    '32 invoice follow-ups detected this month. Consider creating a Debtors Agent.'
  where not exists (select 1 from public.memories where user_id = p_user_id and key = 'invoice_follow_ups');
end;
$$;

-- Seed for primary user if exists
do $$
declare uid uuid;
begin
  select id into uid from auth.users where email = 'eksteen23@gmail.com' limit 1;
  if uid is not null then
    perform public.seed_pivot_os_demo(uid);
  end if;
end $$;
