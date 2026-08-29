-- ARCHIVE-CLASS BULK IMPORT. Do not re-run in production.
-- Hardcoded founder UUID. Treat as a one-off migration snapshot, not live seed.
-- Full DJ Werk 2026 import. Re-runnable via seed_batch replace.
delete from public.items where user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Dewald Veearts',
  null,
  'FMD  - NIc',
  'FMD  - NIc ',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Dewald Veearts", "where": "Wellington", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Ria',
  null,
  'Huis Opmeet',
  'Huis Opmeet',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Ria ", "where": "Wellington", "time": "10h30", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Erhard',
  null,
  'Plaasvergadering - R2,2 M vir 10% en dan swaai ons skape om die paaiement te betaal en ook Cash Gemors uitsort',
  'Plaasvergadering - R2,2 M vir 10% en dan swaai ons skape om die paaiement te betaal en ook Cash Gemors uitsort',
  '2026-06-09T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Erhard", "where": "Klapmust", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Rohan Manual',
  null,
  'Het afspraak met hom gemaak op 28/5 , Don',
  'Het afspraak met hom gemaak op 28/5 , Don',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Rohan Manual", "where": "KWV Kantoor", "time": "12hoo", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Anwah',
  null,
  'Bad Ria stort',
  'Bad Ria stort',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Anwah", "where": "Paarl", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Arman',
  null,
  '5 + 2 Osse en Koeie - laai nic',
  '5 + 2 Osse en Koeie - laai nic',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": " Arman ", "where": "Sonchem", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jannie Durr',
  null,
  '22 x Limousin laai NIc',
  '22 x Limousin laai NIc',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Jannie Durr ", "where": "Sonchem", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Arman',
  null,
  'Laai 2 x Koeie - Armand Hermon',
  'Laai 2 x Koeie - Armand Hermon',
  '2026-06-12T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": " Arman ", "where": "Hermon", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'JP',
  null,
  'Gerhard en Deon laai 30 x Beeste in Suid-Kaap',
  'Gerhard en Deon laai 30 x Beeste in Suid-Kaap',
  '2026-06-16T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "JP", "where": "Mgaliesburg", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "workstream_slug": "agency_meetings", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_meetings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Amanda',
  null,
  'Sambreel',
  'Sambreel',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Amanda", "where": "Wellington", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Dokter',
  null,
  'Plantar Faccitiss',
  'Plantar Faccitiss',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Dokter", "where": "Paarl", "time": "12h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Drikus',
  null,
  'K-way',
  'K-way',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Drikus", "where": "Paarl Mall", "time": "13h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Drikus',
  null,
  'Tymebank',
  'Tymebank',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Drikus", "where": "Mbekweni", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Spar',
  null,
  'Kar was',
  'Kar was',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Spar", "where": "Wellington", "time": "12hoo", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Drikus',
  null,
  'Koop Drone vir fotos neem',
  'Koop Drone vir fotos neem',
  '2026-06-12T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Drikus", "where": "Kaap", "time": "7hoo", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Leslie',
  null,
  'Kerkvergadering',
  'Kerkvergadering',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Leslie", "where": "Paarl", "time": "17h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Albert Ahrens',
  null,
  'Create App',
  'Create App',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Albert Ahrens", "where": "Wellington", "time": "17h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Emma',
  null,
  'K-way - Solomons',
  'K-way - Solomons',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Emma", "where": "Paarl Mall", "time": "13h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Peet',
  null,
  'Volgende Kerkvergadering',
  'Volgende Kerkvergadering ',
  '2026-06-14T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Peet", "where": "Paarl", "time": "13h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Martin / Danie',
  null,
  'Gouda/Klipheuwel Sample optel',
  'Gouda/Klipheuwel Sample optel',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Martin / Danie", "where": "Gouda/Klipheuwel ", "time": "9h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jacob',
  null,
  'Don - Northpoint - Nuts & Bolts',
  'Don - Northpoint - Nuts & Bolts ',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Jacob", "where": "Online", "time": "8h30", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Eben',
  null,
  'Plaas gaan kyk',
  'Plaas gaan kyk',
  '2026-06-03T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Eben", "where": "Wemmershoek", "time": "15h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jacob',
  null,
  'Di - Northpoint - Pacesetter',
  'Di - Northpoint - Pacesetter',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Jacob", "where": "Online", "time": "8h30", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zahied',
  null,
  'Plaas gaan kyk',
  'Plaas gaan kyk',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Zahied", "where": "Hopefield", "time": "14h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zaid',
  null,
  'Plase Verkoop',
  'Plase Verkoop ',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Zaid", "where": "Hopefield", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Chandre',
  null,
  'Ria - #11 Oude Chardonnay',
  'Ria - #11 Oude Chardonnay ',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Chandre", "where": "Paarl", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Eben',
  null,
  'William Morelig',
  'William Morelig',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Eben", "where": "Wemmershoek", "time": "14h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'William B. Lefley / Eben Welby Solomon',
  null,
  '11 Oude Chardonnay',
  '11 Oude Chardonnay',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "William B. Lefley / Eben Welby Solomon", "where": "Paarl", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nadia Swanepoel',
  null,
  '11 Oude Chardonnay',
  '11 Oude Chardonnay',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Nadia Swanepoel", "where": "Paarl", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Torben Junker',
  null,
  '11 Oude Chardonnay',
  '11 Oude Chardonnay',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Torben Junker", "where": "Paarl", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tobi Retief',
  null,
  'Plase Verkoop',
  'Plase Verkoop ',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Tobi Retief", "where": "Wellington", "time": "8h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette',
  null,
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '2026-06-11T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Mariette", "where": "Paarl", "time": "12h30", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Estelle',
  null,
  '11 Oude Chardonnay - Pam Golding',
  '11 Oude Chardonnay - Pam Golding',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Estelle ", "where": "Paarl", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andrew',
  null,
  'Kyk na gebou Marterial Boards',
  'Kyk na gebou Marterial Boards',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Andrew ", "where": "Paarl", "time": "16h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jaco Gerber',
  null,
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '2026-06-11T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Jaco Gerber", "where": "Paarl", "time": "17h30", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Yolandi Muller',
  null,
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '2026-06-11T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Yolandi Muller", "where": "Paarl", "time": "17h00", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Werner Loubser - Rawson',
  null,
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '11 Oude Chardonnay - Chas Everitte imenad in die kompleks',
  '2026-06-11T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"who": "Werner Loubser - Rawson", "where": "Paarl", "time": "16h30?", "sheet": "1. Meet", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Beplan dag - Boekie / Google Sheets/Calendar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "Huis - Tafel", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Plekke"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Boekie/Google Sheets (Bou Pivot OS)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Beplan"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Whatsapp/Emails (AI Agents Bou)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Beplan"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Emails ( AI Agent Bou)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Beplan"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Calendar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Beplan"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cursor program skryf - Pivots OS - DJ Werk',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Beplan"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Notion - DJ Eksteen Werk - DK/FF/NP',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_planning", "workstream_label": "Beplan"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_planning'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan nuwe besigheid eiendom',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal  Ryan daagliks',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '''Clark'''' - Super Accountant - Connect to Xero',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_ideas", "workstream_label": "Inkomste/Idees"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_ideas'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK Werk - PivotOS',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard App',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Coop Dried Fruit App',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiaan - Livestock Digital Currency - Ubuntu Livestock',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan Manuel - Property Repo Buss Model $',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nonnie - Balm - Product !',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DJ Trendmint - Google trends app / google ads make money - Trendmint',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cattle Management App Tiaan',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Herder App',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Job Board',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Propverse alternative app',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie video editing',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Idea scraper app',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Sign request look alike',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '''Calling'''' - life purpose app',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Shiprazor - Courier System',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Grok Imagine  -  AI Images',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed - Replicate Deals',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiaan - 5 x Pillars - KPI''s (wat en hoev)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bou suksesvoll App Vir Albert Wine App',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Notion / Codex Productivity Tools',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed Website - Hydroponic Fodder',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie Raath Lusern - Cross Border uitvat na Afrika',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed Website - Charcoal',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Notion - DJ Eksteen Werk - DK/FF/NP',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_income", "workstream_label": "Income / Coding - Tools"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_income'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nonnie - Balm - Product !',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_ideas", "workstream_label": "Inkomste/Idees"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_ideas'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '''Clark'''' - Super Accountant - Connect to Xero',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_ideas", "workstream_label": "Inkomste/Idees"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_ideas'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Food Health Message - Leonie Kookboek - Doen iets daarmee',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_ideas", "workstream_label": "Inkomste/Idees"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_ideas'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lulaland - Affiliate',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_ideas", "workstream_label": "Inkomste/Idees"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_ideas'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'I Helped My 50-Year-Old Brother Build a One Person AI Business In 1 Month ($214/Day With Claude) - https://www.youtube.com/watch?v=VsSvHd1bO04',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_ideas", "workstream_label": "Inkomste/Idees"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_ideas'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nonnie Hendriksz Octavascene - Skuld - Staat uitstaande bedrag: R1747.58',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '5/5 - AW kry in R5550 van SASSA',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nelmari - Iphone Payments',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Marnus Octavascene - R2214.74',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Marian Boks skoen',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Skiklub 550 + 250',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Amanda Sambreel',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'K-way 500',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tymebank',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Albert Verjaarsdag R500',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Dringend rooi = 4/5 = R3514',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Toer - Oom Francois = R2500',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Ma 4/5 = R70 krag',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "70.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Di 5/5 = R830 (R600 ibits+ 120 petrol + 35 kos + R70 Marian airtime)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "830.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Vry 7/5 = R400 (AW Petrol lughawe)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "400.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Vry 8/5 = R1500 (leen by Emmie)(Amanda Lone)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "1500.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Vry 8/5 = R1300 (Kinders Kos 1000 en Krag 300)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "1300.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Sat 9/5 = R150 (Krag)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "150.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Ma 11/5 = R150 sambreel',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "150.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Don 11/5 = R120 ( 70 krah en 60 petrol )',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "120.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Leen : Vry 11/5 = R90 ( krag)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "90.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nonnie Hendriksz Octavascene',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'AW en Nonnie Present',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Huis PMT 31/5 !!!!!!!',
  '',
  '2026-05-15T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal FF terug 17800 op R3500',
  '',
  '2026-05-15T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Versekering betaal - R15818-96',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Elsabe R35000 betaal terug BKB MJ Conradie 25/9',
  '',
  '2026-05-15T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Skoolfonds ALbert 45000 op 1/6 uitstaande',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "45000.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'WCLA 8000 - Jannie - 7c',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "8000.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal Dewald Frey R1369-50 , Veewarts',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": "8000.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Budget opstel : DJ + Saartjie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Wins/State/Budget"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Villa Dorado - Stuperl en Berman - Marylyn -  011-4921424 - Standard Bank - 363490647 - R 908,000',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#129 Gordons Bay Golf Terraces - Karabo - 010-1092566 - Standard Bank - 362540365 - R374,100 - Sold 4/5/2022',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'BKB check en ook Usplau',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Jaco van Zyl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nonnie Hendriksz Octavascene - Skuld - Staat uitstaande bedrag: R1747.58',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Marnus Veearts Octacascen',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Shun Jannie Durr Hawerr hooi\',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '18/5/26 - Skuld - Shiraz trust  - Standard Bank - Email - Standard Bank Home Loan Account - Good day Mr Eksteen

Trust this email finds you well.

As per our telecom, please find the attached statemen',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Elsabe R35000 betaal terug BKB MJ Conradie 25/9',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '"Email Skuld Shiraz Trust - Gordons Bay Standard Bank Home Loan Account
Inbox 
33.3 Shiraz - Trusts - Acc no 362540365
Karabo Mthimkulu | Bokwa Incorporated <karabo@bokwalaw.co.za>
Attachments
Mon 18 ',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_finances", "workstream_label": "Skuld"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_finances'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Huis PMT 31/5 !!!!!!!',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Email Skuld Shiraz Trust - Gordons Bay Standard Bank Home Loan Account
Inbox 
33.3 Shiraz - Trusts - Acc no 362540365
Karabo Mthimkulu | Bokwa Incorporated <karabo@bokwalaw.co.za>
Attachments
Mon 18 M',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '*SARS DJ en AW uitsort',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '*Cancel DJBoerdery BK en VTrust  en VB Vennootsakp',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK Kwat SOloins omruil',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'AW en Nonnien  verjaar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Sassa',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'ID''s smart crads',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Testament AW/ME',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Christien Polisse en so aan vir AW en ME',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SARS AW testment tannie Retha uitbetaal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Doeke ekstra fondse',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Register on Sassa',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Magriet het geval - Arno kontak seun',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Teken Indeminty AW Eksteen Benificiary en getuies Gerrit ABSA',
  '',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Honda Tannie Retha 86k',
  '',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SARS  - AW en DJ Eksteen gaan saam soontoe',
  '',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Magriet eienaar van Bloemenprag',
  '',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Kry Huurkontrak by Magriet',
  '',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SASSA registrtasie M.Eksteen op foto profiel',
  '',
  '2026-06-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'GerritNicolaas.duPlessis@absa.africa  - EKSTEEN, MM (GP)(49665) - Gerrit Nicolaas Du P
Estate Administrator: Deceased Estates
Estate Services

T +27 113544673
F +27
E GerritNicolaas.duPlessis@absa.afr',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Vra Gerrit Nicolaas oor die SARS situasie AW Eksteen',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Magriet BKB Betaling Elsabe R35000',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_family", "workstream_label": "AW/ME"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_family'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Suzuki diens',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Voertuie"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Christien email',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saarthie kar vers. kry beter kwotasies',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Hennie Dux versekering',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK Besigheidsrekening DJ en Conrad ooreenkoms',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ritz ekseketeur - mag v. asumpsie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Begrafnis polis',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Christien email Saartjie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_admin", "workstream_label": "Testament / Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lig oranje gebreek',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Huis"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Matras nuew dj en saartjie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Huis"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Solar Felix',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Huis"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Does Geute',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Huis"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SkiUpcoming work party reminder!',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_label": "Huis"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Medies - Dokter voet seer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_health", "workstream_label": "Medies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_health'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Leonie/Dendrie - voet dokter - warm 3minute / koud 30 sekondes',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_health", "workstream_label": "Medies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_health'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Leonie/Dendrie - voet dokter - warm water - cayenne pepper halwe teelepel en koue water paar drupples tee tree olie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_health", "workstream_label": "Medies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_health'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Leonie/Dendrie - voet dokter - caster olie en cumfry poeier  - maak paste en sit onder voet',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_health", "workstream_label": "Medies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_health'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Sage leslie boeke',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal workserve en snake park',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Meeting 5/5/26 Leslie besluit opdeling vn fondes vn 1/3/2023',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Send monthly trust fund remittance reports email ‪+27 62 490 6628‬ Ps. Tumpkin
Short summary of the email:
Pastor John is reminding all Boland 1 District treasurers to send their monthly Trust Funds R',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Versekering betaal - R15818-96',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lubabalo Mboya SDA Finance Helderberg - supplier invoices remittance',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Offergawes split 50/50',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Snapscan App',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'App vir Boekies bestel',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Eben program aanbied',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bou Website vir Kerk',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Social by kerk na die tyd',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R115 vir boekies',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Volgende Kerkvergadering 21/6/26',
  '',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Dear Boland 1 District Treasurers 

Greetings in the name of the Lord!   Thank you for your faithfulness in the congregations in which you serve.   This is a reminder that we are about to complete the',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Kerkvergadering - 8h00 - 14/6',
  '',
  '2026-06-14T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "2. DJ", "where": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "dj", "workstream_slug": "dj_church", "workstream_label": "Kerk"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'dj_church'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'dj'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Sheet',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Jacob weekly activity',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Mandates',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Proeperty Condition report',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Prop 24 Listings opsit',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Propverse Pipeline',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Mandate stuur vir Conrad',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Eben Welby Soloman - prepare Pitch Deck',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Gerald K. +  - prepare Pitch Deck',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Expiry soon - Property 24 - Update Lsitings',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Eskom* uitvind Hartebeesfontein',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Fikle Fist Deal - Robert Cape Cork Supplies',
  '',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nortpoint Gmail Check',
  '',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Caro - Capital Growth Stats #11',
  '',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Brochure Verkope Sign-up Buyer',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bloemenprag - Kry eienaar - Magriet',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '***Lebab Enterprises - skryf vir Dean Syren',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cursor bou system',
  '',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_admin", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_admin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Robert / Shaun / Drikus',
  3100.0,
  'Lessor - Mikey / Lessee - Eve McKerchar - African Cellars',
  'gedeel deur 3: Rob , Shaun en Drikus - R3000',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "deal_code": "NP21-26-1", "location": "Paarl, Yara Site, Zuidmeer", "r_unit": "35.0", "sqm": "2000.0", "months": "3.0", "total": "35.0", "commission": "3100.0", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_deals", "workstream_label": "Deals"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_deals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zaid - Landsdowne',
  null,
  '#11 Oude Chardonnay',
  'Farms · Paarl',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farms", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_deals", "workstream_label": "OTP"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_deals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jacob se notes hoe om OTP in te vul',
  null,
  'Farms',
  'Farms',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farms", "location": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_deals", "workstream_label": "OTP"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_deals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Kristin',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andrea',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sonja Cilliers',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Amanda De Bruyn',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-07T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Shaun',
  null,
  'Yara',
  'Industrial · Paarl',
  '2026-05-15T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tersia (Fouche Properties)',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-15T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Izak Perold',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-18T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Eve McKerchar - African Cellars',
  null,
  'Yara',
  'Industrial  · Paarl',
  '2026-05-18T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial ", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-22T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Caro',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sanet Pienaar',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nerine de Kock',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette - Chas Everitt',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette  en Riaan Hanekom',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Gretha Bester - Mariette - Chas Everitt',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette  en Riaan Hanekom, dogter Ria',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Stefan Core , broer Jason , Christell ma',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zaid - Landsdowne',
  null,
  '#11 Oude Chardonnay',
  'Farms · Paarl',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farms", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Eben Welby Solomon / William Boerban Lefley',
  null,
  'Morelig en Loevenstein (55m en 300M)',
  'Farms · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farms", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_viewings", "workstream_label": "Viewings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_viewings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'JACOB PATIENCE',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Niel Grobbelaar',
  null,
  'Hochheim',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Niel Grobbelaar',
  null,
  'Goedeverwagting',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Melante van der walt',
  null,
  'Goede Hoop',
  'Farm · Tierfontein',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Tierfontein", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Willaim Bourbon Lefley - Geen mandaat, 3 %',
  null,
  'Morelig',
  'Farm · Wemmershoek',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wemmershoek", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jan Louw du Plessis',
  null,
  'Valencia',
  'Farm · Wellington',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wellington", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Jan Louw du Plessis',
  null,
  'Handelkraal',
  'Farm · Loeriesfontein',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Loeriesfontein", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Magriet',
  null,
  'Bloemenprag - Kry eienaar',
  'Farm · Loeriesfontein',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Loeriesfontein", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Willaim Bourbon Lefley - Geen mandaat, 3 %',
  null,
  'Loevenstein - R300M',
  'Farm · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Pierre Heyndenrich',
  null,
  '3 x plase',
  'Farm · Vredenburg / Paternoster',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Vredenburg / Paternoster", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Erhard Strooh',
  null,
  'Glen Gall',
  'Farm · Klapmuts',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Klapmuts", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andre Serdyn',
  null,
  '200ha Spilpunte onder Mielies',
  'Farm · Koringberg',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Koringberg", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Dewald Vorster',
  null,
  'Bluestone',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tobi Retief',
  null,
  'Sotheby''s',
  'Farm · Wellington',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wellington", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Gretha Bester - Chas Everitt',
  null,
  'Chas Everitt',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Rob/Shaun',
  null,
  'Yara',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_rentals", "workstream_label": "Rental"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_rentals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nick Vadas',
  null,
  'Bergrivier park x 2',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_rentals", "workstream_label": "Rental"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_rentals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Francois Hugo',
  null,
  'Faure Plaas opdelings Light Industrial',
  'Industrial · Somerset Wes',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Somerset Wes", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_rentals", "workstream_label": "Rental"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_rentals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Rob/Shaun',
  null,
  'Spilo',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_rentals", "workstream_label": "Rental"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_rentals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Balwin',
  null,
  'Big Developers - Buss Model good',
  'Industrial · JHB',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "JHB", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Rial Levitt',
  null,
  'Inospace - Good Business Model',
  'Industrial · JHB',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "JHB", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andrew',
  null,
  'Soek 3 x office/ 1 x boardroom / 1 x workshop / 1 x Groot plek om tenke te bou',
  'Industrial · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Xillin - Seeff',
  null,
  'no.8 - Oosterland - vir Andrew',
  'Industrial · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_marketing", "workstream_label": "Agent"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_marketing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'API and Annenberg',
  null,
  'Spilopark - R86,700 pm
1,445m² Warehouse To Let in Dal Josafat',
  'Industrial · Paarl',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_marketing", "workstream_label": "Agent"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_marketing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Trueprop - Britney',
  null,
  'Spilopark - Leasing Details
Occupation Date 1 July 2026Gross Lettable Area 1445Gross Price R 94,937Net Price R 86,700Unit Number 16',
  'Industrial · Paarl',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_marketing", "workstream_label": "Agent"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_marketing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Annenberg',
  null,
  'R55,000 pm
1,000m² Warehouse To Let in Paarl South',
  'Industrial · Paarl',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_marketing", "workstream_label": "Agent"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_marketing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Ria Nazeem',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tiaan Oosthuizen',
  null,
  'Verhuur',
  'Residential · Wellington',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Wellington", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_rentals", "workstream_label": "Rental"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_rentals'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nazeem Stemmet',
  null,
  'Cindy - 2 bedromm - R6 M',
  'Residential · Seapoint',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Seapoint", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nazeem Stemmet',
  null,
  'Boer - Frederick Smit - 13 Torrey Straat',
  'Residential · Stellenbosch',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Stellenbosch", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Alta Jacobs',
  null,
  'R1,6M - 2 bed Verdaux Apartment',
  'Residential · Wellington',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Wellington", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Digikraal',
  null,
  'Piet du Plessis Huis koop',
  'Residential · Vredendal',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Vredendal", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_leads", "workstream_label": "Nazeem"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_leads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Molebiemang',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andre Grobbelaar',
  null,
  'Plaas',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Ghoemie Human',
  null,
  'Plaas soos Hartebeesfontein',
  'Farm · Hopefield',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Eben Welby Soloman',
  null,
  'Farm - Residential Developments',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl ", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sedric Green',
  null,
  'Looking for Rock business',
  'Farm · Wemmershoek',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wemmershoek", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tobi Retief',
  null,
  'Looking for Buyers - got lots of stock at Sotheby''s',
  'Farm · Wellington',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wellington", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zelda',
  null,
  'Soek Equistrian Estate',
  'Farm · Paarl/ Wellington',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl/ Wellington", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Robert Whiteley',
  null,
  'Equestrian Farm - 20M tot 70M',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Gerard Krecklenberg',
  null,
  'Plaas soos Hartebeesfontein',
  'Farm · Hopefield',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Dave Dodge',
  null,
  'Plaas soos Hartebeesfontein',
  'Farm · Hopefield',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Eben Welby Soloman',
  null,
  'Morelig',
  'Farm · Wemmershoek',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wemmershoek", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Motato',
  null,
  'Handelskraal - Loeriesfontein',
  'Farm · Wemmershoek',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wemmershoek", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Robert Whiteley - looking for dev. space',
  null,
  'Hocheim',
  'Farm · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mr Peer - looking for dev. space',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Gerhodine Prins',
  null,
  'Morelig',
  'Farm · Wemmershoek',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wemmershoek", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Ahmed Bassa',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Gringo',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zahied',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'CJ Stander',
  null,
  'Goede Hoop',
  'Farm · Tierfontein',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Tierfontein", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Zaid - Landsdowne',
  null,
  '#11 Oude Chardonnay',
  'Farms · Paarl',
  '2026-06-04T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farms", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Willaim Bourbon Lefley - Geen mandaat, 3 %',
  null,
  'Loevenstein - R300M',
  'Farm · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Rob/Shaun',
  null,
  'Propverse Listing',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Rob/Shaun',
  null,
  'Eve McKerchar - African Cellars',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Danie Raath',
  null,
  'Het pel wat 5000 soek',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andre(Ro en Shaun)',
  null,
  'hulle soek 3 x kantore/ boradrooom/workshop en groot gedeelte om tanks aanmekaar te sit',
  'Industrial · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'James Jonk',
  null,
  'Soek 500sqm vir kwekery',
  'Industrial · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andrew',
  null,
  'Soek 3 x office/ 1 x boardroom / 1 x workshop / 1 x Groot plek om tenke te bou',
  'Industrial · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_tenants", "workstream_label": "Tenant"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_tenants'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Dionne Joubert',
  null,
  'Soek 1,5 - 2m commercial or resi',
  'Industrial · Oudtshoorn',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Oudtshoorn", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_leads", "workstream_label": "Investor"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_leads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sonja Cilliers',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Peter Jens',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Estelle / Oude Chardonnay',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Connie Ferguson',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Andrea',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Kristin',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Cara Thorn',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Margeaux',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sonette Dixon',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Pete Jens',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Shaun',
  null,
  'Blyplek',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Yusree',
  null,
  'Lemoenhout Straat 600K',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'JG Vlok',
  null,
  'Nazeem Auction Sheriff',
  'Residential · Oral',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Oral", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'X-Nita',
  null,
  'R1,4M Plek',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Keegan',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Amanda De Bruyn',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Shaun NP - Huis R5000 pm',
  null,
  'Container',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Izak Perold',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette - Chas Everitt',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Caro',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Henry Howard',
  null,
  'Kom van KZN soek vir R2,1 M',
  'Residential · KZN',
  '2026-05-27T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "KZN", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sanet Pienaar',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nerine de Kock',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Sanet Pienaar',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nerine de Kock',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette - Chas Everitt - Ma 2de',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette  en Riaan Hanekom, dogter Ria',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Justin Johansson',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Chandre',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Stefan Core , broer Jason , Christell ma',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Johan (Son) soek fotos',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tertia - Fouche Eiendomme',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-29T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Cor',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Johan Prop 24',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Phia Kotze',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Asya Ntshobodwana',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Hugo van Wyk',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Johan Havenga',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Tertia Fourie',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Estelle Pamgolding',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Torben Junker',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Nadia Swanepoel',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-05T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Yolandi Muller',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Mariette - Chs Everitt',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Lani Sonnekus',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Dionne Joubert',
  null,
  'Soek 1,5 - 2m commercial or resi',
  'Industrial · Oudtshoorn',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Industrial", "location": "Oudtshoorn", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_leads", "workstream_label": "Investor"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_leads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Werner Loubser - Rawson',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_buyers", "workstream_label": "Buyer"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_buyers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'JACOB PATIENCE',
  null,
  'Hartebeesfontein',
  'Farm · Hopefield',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Hopefield", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Melante van der walt',
  null,
  'Goede Hoop',
  'Farm · Tierfontein',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Tierfontein", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'lead'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Willaim Bourbon Lefley',
  null,
  'Morelig',
  'Farm · Wemmershoek',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Farm", "location": "Wemmershoek", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Sell"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  'Ria Nazeem',
  null,
  '#11 Oude Chardonnay',
  'Residential · Paarl',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "property_type": "Residential", "location": "Paarl", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_slug": "np_sellers", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'np_sellers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Dionne and all agents',
  '',
  '2026-05-21T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "Nuts & Bolts - National"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Week 22',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "3.NP", "seed_batch": "dj_werk_full_v1", "entity_slug": "northpoint", "workstream_label": "46170.0"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'northpoint'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Afrihost account',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Afrihost account hernieu',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'FF Kontrakte letter of intent and LC Botswana deal Martin',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SAFEX prices Martin everyday',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Fin State stuur kredietaansoek - Pieter Lambrechts - Overberg Agri',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Pieter  Lambrechts - Overberg Agri Krediet Aansoek - 30 dae geen rente, na dit Prima + 0,45',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Martin Letters of Intent and prelim contract',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Christo FNB - Uitvoer na Botswana - Christo LC or Payment instruments for Export',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Samples Courier Guy Wit mielies en Wheat',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_finadmin", "workstream_label": "Fin/Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_finadmin'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed Website - Hydroponic Fodder',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_trading", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_trading'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie Raath Lusern - Cross Border uitvat na Afrika',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_trading", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_trading'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed Website - Charcoal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_trading", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_trading'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ryno Nyati - Gars SKuif',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_logistics", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_logistics'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Martin - Botswana  - Mielies + Koring',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_logistics", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_logistics'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '-----',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_listings", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_listings'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Amandels - Stephan Malan - R3000 Paarl en R3250 Malmesbury',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lusern - Stephan Malan',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Koring - danie Raath - Botswana',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Wit Mielies - Danie Raath Botswana',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SAFEX  - 19300 Marge vir Safex + Maize 43700',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie Raath - Lusern - Bigpacks - R4750/ton - afgelaai - Kaap',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie Raath - Teff - R4550 -',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Hans Chop',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Jeanne de villiers Charcoal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie Raath Lusern - Cross Border uitvat na Afrika',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Gars - Rynmo Nyati - R5500',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Amandels - Herman Macdonald - R3450',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Hawerhooi - Meerlus - Innes',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Martin - Botswana  - Mielies + Koring',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'COnrad lusern - willie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Wilfred Lusern - R5050 - Danie Raath',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Wilfred - Teff - Klein Bale',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Arman - Charcoal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_sourcing", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_sourcing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ryno Nyati - Gars - Vaalharts - R5775 - 630 versak - R3950 = 34  ton = R40630 - R4000 vir DK',
  '',
  '2026-05-19T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_slug": "ff_logistics", "workstream_label": "Klaar gelaai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'ff_logistics'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'kg/ton',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_label": "Qty"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '1.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_label": "30.0"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'kg/ton',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_label": "Qty"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '1.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_label": "30.0"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  null,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '1.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "4. FF", "seed_batch": "dj_werk_full_v1", "entity_slug": "farm_feed", "workstream_label": "30.0"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id 
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'farm_feed'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '3 x Swazi',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '5 x JP Crafford - Magaliesburg / Deon Douglas - Michael Heidelberg WC - Jersey Koeie 17500/18500 en 29000 vervoer voor invoice: Kry by verkoper vir R17500 sonder VAT en kry vervoer by Gerhard vir R100',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Pierre 47+23 : Gemors 5 x Beeste dood',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ooie Attie / Danie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '350 x ooie van Attie na Erhard: R37,50 tot R38,00',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Laai Roy 12 x Koeie en 14 x Kalwers',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '369 + 5 ooie: 5 ooie, 215kg, R35 - 369 ooie, 20232kg, R37,50+btw - ATTIE VAN WYK NA JANNIE DURR - Moorreesburg - Jannie kry R38,00 by koper - 50c wins in / ek neem aan ons kan 25c na VB toe gooi: Dus ',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'More Jannie. Voorstel..kom ons split die 50c ...25c + 25c.....my 25c kan ons dalk kyk om 18c op Vredelus af te gooi en 7c vir wat ek vir ander fooi moet betaal..',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Laai Jannie - 17 x Limousin van Nic Smit na LRSA  Industries na Weskaap Lewende Hawe',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Laai Armaaan 12 x Beeste',
  '',
  '2026-06-12T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'NJ Neimansd soek 5 x Jersey verse',
  '',
  '2026-06-12T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '16/6 - 30 x Laai JP',
  '',
  '2026-06-16T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 25", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '40 x Ettienne Saaron',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Viewing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '26  x Kalwers - Conrad - Hermon - Armand van Deventer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Viewing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '190 x Ram Lammers - Cradock - Hans - R52,00 - No VAT',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '20 x R.Ang. OOp verse pierre Heyndenrich',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '20 x Swart Kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '26  x Kalwers - Conrad - Hermon - Armand van Deventer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '30 x Jersey Verse Deon Douglas Swellendam',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '560 Clint de Winnaar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '6 x Vincent Kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Francois Potgieter - 50 x Fries e verse oos-kaap',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Kyk Maandag 4/5 - 10h00 - 47+23 Rooi Angus K+K - Pierre Heyndenrich',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '250 Geurnsey Koeie - Deon',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Listing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '6 x Vincent Kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '47+23 Rooi Angus K+K - Pierre Heyndenrich',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '20 x R.Ang. OOp verse pierre Heyndenrich',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '40 x Ettienne Saaron',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '20 x Swart Kalwers Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '3 x Swazi Bullwe',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Attie Ooie Jannie Durr',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '26  x Kalwers - Conrad - Hermon - Armand van Deventer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '190 x Ram Lammers - Cradock - Hans - R52,00 - No VAT',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '30 x Jersey Verse Deon Douglas Swellendam',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '560 Clint de Winnaar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Francois Potgieter - 50 x Fries e verse oos-kaap',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '250 Geurnsey Koeie - Deon',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '25 x Kalwers Armand',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '2 x Koeie Armand',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nic 27 x Lim Osse',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nic 2 x Koeie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '15 x Gerhardt de Swart',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Francois Destroo 15 x Kruisras Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Neels Uys 47+17 R25,00 + R1,00  -  K+K George',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Neels Uys 47+17 R25,00 + R1,00  -  K+K George',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Verkoop 200 Attie Piketberg',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Deon  ... REosendal Osse en Verse',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 24 ", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Deon  - 30+30 Bonsmara Bulle en verse - Mosselbaai',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 24 ", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '600 x Stoorlammers - Christo Kirsten',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '40 x Herman Rentske Ngunis',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Abri van Deventer Calvinia - Ngunis x 20 soek',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '200 x Ooie Jannie Durr',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '190 x Razeen Lammers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Charl Meyer Melk Verse',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Charl Meyer Melk VerseDanie 200 ooie Week 23',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Joseph Masoabi - Jer verse en jerset kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Jacques de villiers 700 lammers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Jacques de villiers 90 kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Joseph Masoabi - Jer verse en jerset kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie 200 Piketberg',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'NJ Niemand soek 5 x Jersey verse',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ooie x 200 - Danie',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_label": "Soek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Pierre 47+23 9 5 x Beeste vrek(Inbetaal situasie)',
  '',
  '2026-04-20T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 22", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Klaar gelaai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '369 + 5 ooie: 5 ooie, 215kg, R35 - 369 ooie, 20232kg, R37,50+btw - ATTIE VAN WYK NA JANNIE DURR - Moorreesburg - Jannie kry R38,00 by koper - 50c wins in / ek neem aan ons kan 25c na VB toe gooi: Dus ',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Klaar gelaai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '4 x (no. 7772 kosprys) Koeie @ R7500 en 10 x (no. 7811 kalwers) @ R7000(Erhard deel nie in die verliese nie',
  '',
  '2026-05-31T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Klaar gelaai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Laai Roy 12 x Koeie en 14 x Kalwers - R1280000',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "5.1 DK % Agent", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_loads", "workstream_label": "Klaar gelaai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_loads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'process'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  12765.0,
  'Jannie Durr Pryse — price ladder',
  '13 kg/R/kg tiers',
  null,
  '[]'::jsonb,
  '{"sheet": "5.2 DK % Agent", "pricing_calculator": true, "scenario": "Jannie Durr Pryse", "tiers": [{"kg": 250.0, "r_per_kg": 38.0, "adjustment": 0, "total": 9500.0}, {"kg": 260.0, "r_per_kg": 38.0, "adjustment": 0, "total": 9880.0}, {"kg": 270.0, "r_per_kg": 38.0, "adjustment": 0, "total": 10260.0}, {"kg": 280.0, "r_per_kg": 38.0, "adjustment": 0, "total": 10640.0}, {"kg": 290.0, "r_per_kg": 38.0, "adjustment": 0, "total": 11020.0}, {"kg": 300.0, "r_per_kg": 38.0, "adjustment": 0, "total": 11400.0}, {"kg": 310.0, "r_per_kg": 37.5, "adjustment": -0.5, "total": 11625.0}, {"kg": 320.0, "r_per_kg": 37.0, "adjustment": -0.5, "total": 11840.0}, {"kg": 330.0, "r_per_kg": 36.5, "adjustment": -0.5, "total": 12045.0}, {"kg": 340.0, "r_per_kg": 36.0, "adjustment": -0.5, "total": 12240.0}, {"kg": 350.0, "r_per_kg": 35.5, "adjustment": -0.5, "total": 12425.0}, {"kg": 360.0, "r_per_kg": 35.0, "adjustment": -0.5, "total": 12600.0}, {"kg": 370.0, "r_per_kg": 34.5, "adjustment": -0.5, "total": 12765.0}], "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Pricing Calculator"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'process'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  12025.0,
  'Nic Prices — price ladder',
  '13 kg/R/kg tiers',
  null,
  '[]'::jsonb,
  '{"sheet": "5.2 DK % Agent", "pricing_calculator": true, "scenario": "Nic Prices", "tiers": [{"kg": 250.0, "r_per_kg": 36.0, "adjustment": 0, "total": 9000.0}, {"kg": 260.0, "r_per_kg": 36.0, "adjustment": 0, "total": 9360.0}, {"kg": 270.0, "r_per_kg": 36.0, "adjustment": 0, "total": 9720.0}, {"kg": 280.0, "r_per_kg": 36.0, "adjustment": 0, "total": 10080.0}, {"kg": 290.0, "r_per_kg": 36.0, "adjustment": 0, "total": 10440.0}, {"kg": 300.0, "r_per_kg": 36.0, "adjustment": 0, "total": 10800.0}, {"kg": 310.0, "r_per_kg": 35.5, "adjustment": -0.5, "total": 11005.0}, {"kg": 320.0, "r_per_kg": 35.0, "adjustment": -0.5, "total": 11200.0}, {"kg": 330.0, "r_per_kg": 34.5, "adjustment": -0.5, "total": 11385.0}, {"kg": 340.0, "r_per_kg": 34.0, "adjustment": -0.5, "total": 11560.0}, {"kg": 350.0, "r_per_kg": 33.5, "adjustment": -0.5, "total": 11725.0}, {"kg": 360.0, "r_per_kg": 33.0, "adjustment": -0.5, "total": 11880.0}, {"kg": 370.0, "r_per_kg": 32.5, "adjustment": -0.5, "total": 12025.0}], "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Pricing Calculator"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'process'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  20450.0,
  'George Koeie — price ladder',
  '1 kg/R/kg tiers',
  null,
  '[]'::jsonb,
  '{"sheet": "5.2 DK % Agent", "pricing_calculator": true, "scenario": "George Koeie", "tiers": [{"kg": 64.0, "r_per_kg": 319.53125, "adjustment": 0, "total": 20450.0}], "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Pricing Calculator"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'process'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  8425.0,
  'Sonchem Osse — price ladder',
  '1 kg/R/kg tiers',
  null,
  '[]'::jsonb,
  '{"sheet": "5.2 DK % Agent", "pricing_calculator": true, "scenario": "Sonchem Osse", "tiers": [{"kg": 27.0, "r_per_kg": 312.037037, "adjustment": 0, "total": 8425.0}], "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_agency", "workstream_slug": "agency_sales", "workstream_label": "Pricing Calculator"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_agency'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'agency_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_development", "workstream_label": "Build / Renovate"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_development'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_development", "workstream_label": "Build / Renovate"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_development'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_development", "workstream_label": "Electrical"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_development'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_development", "workstream_label": "Electrical"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_development'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_development", "workstream_label": "Electrical"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_development'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies / HOA"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_label": "Expenses (Other)"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_label": "Transfer Attorneys"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Lodge - Deeds Office"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Lodge - Deeds Office"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_bridging", "workstream_label": "Bridging Finance"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_bridging'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#4 Golden Pond , Kirstenhof',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_bridging", "workstream_label": "Bridging Finance"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_bridging'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_sales", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Legal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_acquisitions", "workstream_label": "Banks"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_acquisitions'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_acquisitions", "workstream_label": "Banks"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_acquisitions'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_acquisitions", "workstream_label": "Banks"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_acquisitions'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_acquisitions", "workstream_label": "Banks"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_acquisitions'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_otp", "workstream_label": "OTP"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_otp'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_otp", "workstream_label": "OTP"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_otp'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_label": "Bond Originating"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_label": "Agent/Facilitator"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_leads", "workstream_label": "Listings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_leads'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_label": "Foto''s en videos"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_sales", "workstream_label": "Viewings/Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_sales", "workstream_label": "Viewings/Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_sales", "workstream_label": "Viewings/Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_development", "workstream_label": "Build / Renovate"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_development'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Municipality"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_levies", "workstream_label": "Levies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_levies'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#11 Oude Chardonnay, Paarl',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "6. DK Eien", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_property", "workstream_slug": "property_legal", "workstream_label": "Lodge - Deeds Office"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_property'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'property_legal'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Meeting: Tiaan + Erhard + Conrad  - Plaas',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Plaas - Fotos Neem Verkope',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Plaasvergadering - R2,2 M vir 10% en dan swaai ons skape om die paaiement te betaal',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Teff Voorrraad vir Erhard stuur',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Daaglikse Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bees vorraad vir Erhard stuur',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Daaglikse Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Containers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Idees Planne"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Skaap voerkraal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Idees Planne"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Verhuring van eiendom industrial property',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Idees Planne"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'AirBNB containers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Idees Planne"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Niks meer cash FNB Payment gateway',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Idees Planne"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Container Park - 360k per maand -----gaan 160 containers op sit - 2M spandeer op draad',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Idees Planne"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Laai Roy 12 x Koeie en 14 x Kalwers',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Laai"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '4 x (no. 7772 kosprys) Koeie @ R7500 en 10 x (no. 7811 kalwers) @ R7000(Erhard deel nie in die verliese nie',
  '',
  '2026-05-31T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Reeds Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '23/4 - 1 x 15000 x anf koeie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '23/4 -  3 x skape verkoop',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '23/4 - #139',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tasmara betaal R17200 cash',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '4 x angus koeie R48000 cash',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '1 x angus vers R10000 - cash',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '23 x swart / rooi koeie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '20 x swart kalwers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '15 x Nguni Koeie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard weeklise verslag',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_purchases", "workstream_label": "Aankope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_purchases'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '120 x Ooie Andre Outdsthoorn',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_purchases", "workstream_label": "Aankope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_purchases'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Henry vervoer laaste skaope van Andre Kallis af',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_purchases", "workstream_label": "Aankope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_purchases'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R17000 Erhard Arbeid -29/4',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Arbeid per week',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'petrol per maand',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Voer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Môre Dricus , kan julle my laat weet wanneer hierdie invoice vereffen gaan word. Ek kan ongelukkig nie Digikraal finansier vir n onbepaalde tydperk nie.',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Deonita - R49K Feb,mrt,apr',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Deonita Invoice voer uitsorteer',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Weekliske lone +-R4000',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R17000 Erhard Arbeid',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_label": "Deelwins"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Weekly stock reports !!!!',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock Notes"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '22/4 - veearts Rudolf - staatsveearts inentings',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock Notes"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Drikus 40,000 cash optel op plaas - 13/4',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Cash"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Niks meer cash FNB Payment gateway',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Cash"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R17000 Erhard Arbeid',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Customers A/R Receivables"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Deonita Hooi Invoice Uistaande',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Customers A/R Receivables"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Milante rekening uitstaande',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Customers A/R Receivables"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R17000 Erhard Arbeid',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Supplier A/R Payables"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R49000 Erhard Arbeid',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_expenses", "workstream_label": "Supplier A/R Payables"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_expenses'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Koop nog 10 x containers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Eiendom - Containers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '10 x 35,000 ---> 100k --> 5336+1850 BTW',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Eiendom - Containers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Plaas verkoop R17M - Eben',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Eben Welby Solomon',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R11,000 ons kry 50%, maar moet self aankarring',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R17M ons kry 50% , maar ook 50% van inkomste gegenereer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Jean Kry Waardasie - R100k per ha R8,500,000 en inkomste waardasie +-13M',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lelanie Huis',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#1 AirBNB',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '#2 AirBNB (Nuut Bou)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Gras  - 6 ha',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '3 x Woonstelle',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Huis Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Deal - Offer aan Erhard: 
Gee hom ''n lening egter11,000,000 vir 30% aandeel. 
 Erhard betaalPMT  terug en ons kry 30% aandeel in die grond vir die fiet dat ons die l;ening gee
Ons onderneem om saam me',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard voorstel ons kry R2M vir 10% van die plaas',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ek Erhard praat weer vandag---soek Teff vorraad. ,maar doen die pkaas ding op 10% can 2,2 M ...skape en dalk ook contaienrs maandelikse besigheid',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_farming", "workstream_label": "Eiendom - Plaas"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Verkoop die Containers, of maak ''n plan',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_containers", "workstream_label": "Eiendom - Containers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_containers'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard weeklise verslag- Alle Reorts: I/S,B/S, Cashflow,Stock,A/R''s',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Inkomstetaat',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Balansstaat',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cashflow',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Stocksheet',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'A/R Payables',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'A/R Receivables',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Fin State / Reports"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Beeste en Skape - Animalsure/King Price',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_label": "Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Yoco / FNB Speed point',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Idees Planne',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Yoco / FNB Speed point',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Recon Erhard !!!!!',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cursor Nuwe program',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cash Sonnica/Conrad uifigure Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_cash", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_cash'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bou Erhard App',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Cursor/Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bou Form vir deals invul',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Cursor/Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Yoco / FNB Speed point',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_reports", "workstream_label": "Cursor/Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_reports'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46141.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '46129.0',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '4 x (no. 7772 kosprys) Koeie @ R7500 en 10 x (no. 7811 kalwers) @ R7000(Erhard deel nie in die verliese nie',
  '',
  '2026-05-31T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Reeds Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Laai Roy 12 x Koeie en 14 x Kalwers - R1280000',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "7. DK - Erhard", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_erhard", "workstream_slug": "erhard_sales", "workstream_label": "Reeds Verkoop"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_erhard'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'erhard_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Betaal R5000 lening terug',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan Nel - Rule 72 - Bridging Finance - #4 Golden Pond',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan Nel - Rule 72 - Joint venture - Koop Nazeem eiendomme',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard - plan vd week',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R234000 betaal vir klient',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cashflow vd week',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Drikus Dokter - afspraak voet nie reg',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Huis vredendal - Piet  du Plesis',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nuwe accouting persoon aanstel',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Conrad Bespreek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiaan - 40/30/30 - Shareholding - Andre Pienaar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '2 x Trust and 1 x Holding Compmnay',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lewens versekering Conrad/Drikus - Koop/Verkoop transaskie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lewens versekering Conrad/Drikus - Koop/Verkoop transaskie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Struktuur voorstel - Rohan Manual - SPV(special purpose vehicle)- 2 x trust trust + holding company',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Coop Tiaan Acess to Sites',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DJ en RE teken 40/30/30 op 18/5/26',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_structure", "workstream_label": "Struktuur/Organisasie/ Aandele"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_structure'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Piet du plessis - terug betaal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Investors"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie terug betaal35k',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Investors"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Sonnica Werkskontrak - Salaris is te min - 21/5',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_employees", "workstream_label": "Werknemers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_employees'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Emma Werkskontrak',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_employees", "workstream_label": "Werknemers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_employees'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nuwe accouting persoon aanstel - Mallies le Roux',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_employees", "workstream_label": "Werknemers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_employees'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'https://www.linkedin.com/jobs/view/4419251640 - Linkedin - Conrad Jobs',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_employees", "workstream_label": "Werknemers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_employees'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Koop Drone vir fotos neem',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Toerusting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Yoco / FNB Speed point',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Toerusting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lewens versekering Conrad/Drikus - Koop/Verkoop transaskie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_insurance", "workstream_label": "Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_insurance'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Beeste en Skape - Animalsure/King Price',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_insurance", "workstream_label": "Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_insurance'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Emma email uitsorteer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Giflo Parkering',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK Handelsnaam',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Vodacom Kontrak verval...laaste maand',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Richard Young skaap voerkraal',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'https://www.linkedin.com/jobs/view/4419251640 - Linkedin - Conrad Jobs',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_employees", "workstream_label": "Werknemers"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_employees'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bridge',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiny optics uitsorteer `meimeanad',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Derick btw',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Yoco / FNB Speed point',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'FNB Payment Gateway Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '''Clark'''' - Super Accountant - Connect to Xero',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Vodacom Kontrak verval...laaste maand',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard Teff Vorraad - Kry Teff voorrraasd',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": "Week 24", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_accounting", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_accounting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bridigng Rihan eiendom 700k  - golden p[ond',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiaan Bridge + Skape + Investors - week 20 - 12 Mei',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Gavin van Rohan Maneukl - Rule 72 sal ons bridge vir 10%',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan Rule 72 - het Kapitaal wat hy will stoot - NDA Teken',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan Rule 72 - het ''n ou van Zimbabwe wat platform wil bou',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_cashflow", "workstream_label": "Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_cashflow'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Swaziland Dambuza',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_compliance", "workstream_label": "Export"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_compliance'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Christo LC or Payment instruments for Export',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_compliance", "workstream_label": "Export"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_compliance'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Samtam Versekering Voertuig Toyota RAV 4',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_insurance", "workstream_label": "Versekering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_insurance'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Betaal R5000 lening terug',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal Austin tiny optics R3500',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Koop Drone vir fotos neem',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal 255k vir beeste',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Afrihost 250 FF betaal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Saartjie Betaal R35000 lening terug',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Gerhard vervoer betaal 20 k',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiny optics nog ''n maand betaal mei ??',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Swaziland Maandeliks betaal 10k',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Anwah betaal 16k vir oude chardonnay',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Piet du Plessis',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '21/5 - Betaal Saartjie - R5000',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal SPeedines DJ Eksteen = 220+400 ...etc.',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal Willie deal R100,000',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal Anwah R14300',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal Gerhard R56k en R60K',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'BBB Breytenbach 5 x Beeste gaan Lê',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ayaz Meeting - 29/5 - 11hoo- twee goed - cancel debit order with ABSA  and pay them monthly 15k derictly in account',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ayaz Meeting - 29/5 - 11hoo- Stop debit order - Co-Owener Sign - Jean Marais - Ghana  teken...net twee plekke...Embassy(of dalk ook by ''n Notiery Public)',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Vodacom Kontrak verval...laaste maand',
  '',
  '2026-06-02T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Gemors uitsort met Gerhard',
  '',
  '2026-06-03T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal Gerhard 40k vir Pierre Heynden rich se vrag',
  '',
  '2026-06-08T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'payment'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Betaal vir Johnnny AMT nog twee maande se pryse',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_payments", "workstream_label": "Betaal"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'New Accounting Program - Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '''Clark'''' - Super Accountant - Connect to Xero',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'AI Agents vir al ons werk',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan nuwe besigheid eiendom',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'deal'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Xero en 5.2 DK Deals Blou - integration',
  '',
  '2026-06-10T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bou Accounting System',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Systems"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bou system vir elke afdeling',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Systems"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'AI Agents',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Systems"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Nuwe accouting persoon aanstel',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "8. DK FinAd", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_finadmin", "workstream_slug": "finadmin_reporting", "workstream_label": "Systems"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_finadmin'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'finadmin_reporting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Skape Oudsthoorn',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Meeting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Shareholder Agreemnet',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Meeting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Business Model',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Meeting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard plaas',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Meeting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal Business Model',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Business Models"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Trek Besigheidsplan  op vir elke besigheid',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Business Models"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '% Agentskap APAC - Livestock Agency',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Main 1"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tech - Platform',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Main 1"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Boerdery',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Main 1"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Property',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Main 1"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Grain Trading',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Main 1"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farming/Trading',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Property',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed - Grain and Feed Exchange',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SME Livestock Finance Model',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Contracts - DK +FF',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Agency',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Containers',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Main 2"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK - SME Finance - Papi Plaas -  800ha - daar is alreeds 50 x beeste. Sit nog 50 beeste neer en leen daarop...hy doen 2 x goed...hy trade en hy boer...2 x concerns...die lang tydperk en ook die veilig',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Agro Processing - Papi Motibe',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK Vee Trade Skape',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK % Agency (Online Auctions)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK EIendom - Residential/Commercial - Flip/Invest/Developments',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Farm Feed Exchange Grains',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Container Park - Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'SME Ubuntu Livestock Financing  - Stilfontein  - 1000 ha kampe',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Coop Dried Fruit',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cattle Max Softeware - management',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Martin Oosthuizen Voerkjraal - Hoerskool',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Stamboom Family Tree App',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal Tech Platform - Major Project',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal Agritech - bv. Dronegaurd + Animal facial Recognition and tracking',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal Agritech - Herder App - tracking and management',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Industrial  Leasing Erhard',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'DK EIendom - Erhard Plaas Koop',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal Ubuntu Financing - https://digikraal-ubuntu-livestock-financin.vercel.app/#top',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Digikraal Ubuntu Financing - Sheet - https://docs.google.com/spreadsheets/d/1HCKEkmMSy4q8Jq-lv7V4me7SUhzsHaqF7dgRf9H2u9g/edit?usp=sharing',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Idees / Projekte"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Stilfontein',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Plekke/Locations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Augrabies HSMO',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Plekke/Locations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Fort HAre University',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Plekke/Locations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard Klapmuts',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Plekke/Locations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '13/5/2026 - Shareholding Meeting',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Workshop - kry ''n date',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '7/5/2026 - Week 19 - Aanvaar 40/30/30 split aandele',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_shareholding", "workstream_label": "Shareholding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_shareholding'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Andre Pienaar Experity',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_shareholding", "workstream_label": "Shareholding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_shareholding'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'ITS Asset Management - Martin Nel / Hendrik Rabie / Tiaan Oosthuizen',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_shareholding", "workstream_label": "Shareholding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_shareholding'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Re-finance lula en pollen - R10M',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '230k - shareholders loan  - 7/5/2026 - Golden Pond Week 19',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '300k - #11 Oude C. Property Loan (226k ABSA and 70k Nazeem)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '100k - Containers 3 x Erhard - 24 maande',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '100k Skape/Beeste -  3 maande',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '10M restructure loan',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Bridging 13/5 - Golden Pond',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Skape Oudsthoorn',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Huis Vredendal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '20 Mei Afskrif Lenings',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '10,000,000 - Miljoen - Martin Nel - ITS Asset Management',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Wespac Finance',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'ITS Asset Management - Martin Nel / Hendrik Rabie / Tiaan Oosthuizen',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiaan- neem Lula en Pollen oor 980k ...1,3k',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Kry 10 M Lening by Martin Nel !!!!',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Lenings / Finansiering"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiguan kar',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Admin"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Accounting System - Stilfontein',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Verbeter Accounting System - Digikraal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_financing", "workstream_label": "Finansies"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_financing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard Plaas 11M  - 17 ha - loan - mag niks doen vir 5 jaar - Chris Dry',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Plaas/Eiendom"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard Plaas 17M  - 17 ha - 50% of income',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Plaas/Eiendom"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Skape lesotho Papi',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Aankope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Week 18 - Brits Veiling - papi koop bokke en skape',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_investments", "workstream_label": "Aankope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_investments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Week 18 - Brits Veiling - papi koop bokke en skape',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Stilfontein - Running costs',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '---',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_label": "Wins"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '---',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id 
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Accounting Package - Stilfontein',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'gee syefers cashlwo KPI''s',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_ventures", "workstream_label": "Coding"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Voorlegging Tiaan / Martin Nel',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R10,000,000 Lening',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R2,460,000 Lula, Pollen, Investero loans, shareholder loans, oprational asset finance',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '3  year restructured loan 20% p.a.',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'R7.54 remians available for growth capital',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Capital allocation\',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '1: Livestock Agency - online auctions',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "9. DK Tiaan", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tiaan", "workstream_slug": "tiaan_strategic", "workstream_label": "Presentations"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tiaan'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tiaan_strategic'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'meeting'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ryan New Site - baie foute',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_dev", "workstream_label": "Meetings"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_dev'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'New Site - baie foute',
  '',
  '2026-05-28T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_bugs", "workstream_label": "Jira"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_bugs'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Images not Showing on Mobile',
  '',
  '2026-06-01T09:00:00+00'::timestamptz,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": "Week 23", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_bugs", "workstream_label": "Jira"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_bugs'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Tiny Optics cancel May',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_hosting", "workstream_label": "Hosting"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_hosting'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Emma Email fix',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_dev", "workstream_label": "Email"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_dev'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Cancel Sumsub, Didit new',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_features", "workstream_label": "Verification"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_features'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Paystack',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_payments", "workstream_label": "Payment Gateways"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Yoco System',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_payments", "workstream_label": "Payment Gateways"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'FNB Payment systems - API',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_payments", "workstream_label": "Payment Gateways"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ryan system where Buyer and seller pay each other with a pull request directly',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_payments", "workstream_label": "Payment Gateways"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_payments'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'PWA App - Mobile Friendly',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Agent Portal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Transporter Platform - ''''Farm Truck''''',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Online Auctions',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'CRM',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Escrow (Tradesafe)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Herder    App + Drone + Face Recog.',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Dronegaurd App + Drone + Face Recog.',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'expense'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Invoice Auto',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Contract Auto',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Accounting App for DK Farm Trading',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Major Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'New Market Prices',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_features", "workstream_label": "Features"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_features'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ad''s',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_features", "workstream_label": "Features"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_features'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Subscriptions (discuss roles)',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_features", "workstream_label": "Features"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_features'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Blog Pages',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_features", "workstream_label": "Features"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_features'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Verification - Didit replace Sumsub',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_features", "workstream_label": "Features"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_features'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Ad''s',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Agent Portal',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Transporter Platform - ''''Farm Truck''''',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Online Auctions',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Subscriptions',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Transactions - Payments % API',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Escrow',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lulaland - Affiliate',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "Revenue Producing Builds"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'AI Agents in the software',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_dev", "workstream_label": "AI"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_dev'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Get workflow right',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_dev", "workstream_label": "UX"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_dev'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Get the look like a billion dollar app',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_dev", "workstream_label": "UI"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_dev'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Upwork look for a pro',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_marketing", "workstream_label": "Marketing"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_marketing'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Erhard Software bou ERP Ryan',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "New Projects"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'project'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Rohan Rule 72 - het ''n ou van Zimbabwe wat platform wil bou',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "12. DK Web", "week": null, "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_website", "workstream_slug": "website_revenue", "workstream_label": "New Projects"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_website'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'website_revenue'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'CJ Stander',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "10. DK Tertius", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tertius", "workstream_slug": "tertius_farming", "workstream_label": "Deelwei"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tertius'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tertius_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'sale'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '23 Erhard Koeie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "10. DK Tertius", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tertius", "workstream_slug": "tertius_sales", "workstream_label": "Verkope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tertius'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tertius_sales'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '9 beeste in stock',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "10. DK Tertius", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tertius", "workstream_slug": "tertius_trading", "workstream_label": "Aankope"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tertius'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tertius_trading'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Voer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "10. DK Tertius", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tertius", "workstream_slug": "tertius_farming", "workstream_label": "Expenses"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tertius'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tertius_farming'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'task'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  '9 beeste in stock',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "10. DK Tertius", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_tertius", "workstream_slug": "tertius_stock", "workstream_label": "Stock"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_tertius'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'tertius_stock'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Lulaland - Affiliate',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Vrystaat Grond Koop',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Mohammed  -  Lesotho  -  PMB - Ooie',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Paul Dreyer',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Christiana Beef - Willie Jacobs',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Danie Raath Piketberg ooie eendekuile',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;

insert into public.items (
  id, user_id, entity_id, division_id, workstream_id,
  type, status, priority, source, owner, value,
  title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
)
select
  gen_random_uuid(),
  '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid,
  e.id,
  d.id,
  w.id,
  'idea'::item_type,
  'planned'::item_status,
  2,
  'sheet',
  null,
  null,
  'Stefan Lombard - ooie en koeie aanhou',
  '',
  null,
  '[]'::jsonb,
  '{"sheet": "11. DK Projekte", "seed_batch": "dj_werk_full_v1", "entity_slug": "digikraal", "division_slug": "dk_projects", "workstream_slug": "projects_ventures", "workstream_label": "Projek"}'::jsonb,
  now(),
  now()
from public.entities e
left join public.divisions d on d.user_id = e.user_id and d.entity_id = e.id and d.slug = 'dk_projects'
left join public.workstreams w on w.user_id = e.user_id and w.entity_id = e.id and w.slug = 'projects_ventures'
where e.user_id = '536d3701-329a-45b9-b683-4b2f9c7bdb53'::uuid and e.slug = 'digikraal'
limit 1;
