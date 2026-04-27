-- Realistic meeting seed from DJ Werk 2026 spreadsheet (Digikraal, DJ Eksteen, Northpoint).
-- Idempotent per user via meta.seed_batch. Safe to re-run.

create or replace function public.seed_dj_werk_meetings(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n int := 0;
begin
  delete from public.items
  where user_id = p_user_id
    and type = 'meeting'
    and coalesce(meta->>'seed_batch', '') = 'dj_werk_2026_v1';

  insert into public.items (
    id,
    user_id,
    entity_id,
    division_id,
    type,
    status,
    priority,
    title,
    content,
    due_at,
    scheduled_blocks,
    meta,
    client_updated_at,
    updated_at
  )
  select
    gen_random_uuid(),
    p_user_id,
    e.id,
    null::uuid,
    'meeting'::item_type,
    'planned'::item_status,
    2,
    v.title,
    coalesce(v.agenda, ''),
    v.due_at,
    '[]'::jsonb,
    jsonb_build_object(
      'who', v.who,
      'where', v.loc,
      'entity_slug', v.entity_slug,
      'seed_batch', 'dj_werk_2026_v1'
    ),
    now(),
    now()
  from (
    values
      ('digikraal'::text, timestamptz '2026-04-27 15:00:00+02', 'DK Finansies'::text, 'Sonnica / Conrad'::text, 'KWV Kantoor'::text, null::text),
      ('digikraal', '2026-04-27 17:30:00+02', 'Bad / stort uitsorteer', 'Ria/Anwah', 'Paarl', null),
      ('digikraal', '2026-04-27 18:00:00+02', 'Bad / stort uitsorteer', '—', 'Paarl', null),
      ('digikraal', '2026-04-28 08:00:00+02', 'Parter Bad stort', 'Anwah', 'Paarl', null),
      ('digikraal', '2026-04-28 13:00:00+02', 'On tap Bad part Anway Ria', 'Rian/ Drikus', 'Paarl', null),
      ('digikraal', '2026-04-28 15:00:00+02', 'DI, 15h00 - DK - Beplanning', 'Emma / Conrad', 'KWV Kantoor', null),
      ('digikraal', '2026-04-29 08:00:00+02', 'Kalwers kyk (40)', 'Ettienne Saron', 'Saaron', null),
      ('digikraal', '2026-04-30 15:00:00+02', 'Do, 15h00 - Ryan Website', 'Emma / Conrad', 'KWV Kantoor', null),
      ('dj', '2026-04-26 18:00:00+02', 'Albert / Heidi', 'Albert / Heidi', '—', null),
      ('dj', '2026-04-28 08:00:00+02', 'Suzuki diens', 'Hammie', 'Paarl', null),
      ('dj', '2026-04-28 12:00:00+02', 'SAARTJIE teken testament', 'Ritz/ Saartjie', 'Paarl', null),
      ('dj', '2026-05-01 13:00:00+02', 'K-way', 'Drikus', 'Paarl Mall', null),
      ('dj', '2026-05-22 08:00:00+02', 'Attie Leon Annes weggaan', 'Annes', 'Elandsbaai', null),
      ('dj', '2026-09-12 08:00:00+02', 'Uitkyk familie plaas saamtrek', 'Eksteen', 'Uitkyk', null),
      ('northpoint', '2026-04-27 17:00:00+02', 'View Oude Chardonnay', 'Sonja Cilliers', 'Paarl', null),
      ('northpoint', '2026-04-28 08:30:00+02', 'Northpoint - Nuts & Bolts', 'Jacob', 'Online', null),
      ('northpoint', '2026-04-28 12:00:00+02', 'View Oude Chardonnay', 'Andrea', 'Paarl', null),
      ('northpoint', '2026-04-28 14:00:00+02', '2 x Commercial Properties Listings maak', 'Nick Vadas', 'Paarl', null),
      ('northpoint', '2026-04-29 12:00:00+02', 'View Hartebeesfontein', 'Molibiemang', 'Hopefield', null),
      ('northpoint', '2026-04-30 08:30:00+02', 'Northpoint - Pacesetter', 'Jacob', 'Online', null)
  ) as v(entity_slug, due_at, title, who, loc, agenda)
  join public.entities e
    on e.user_id = p_user_id
   and e.slug = v.entity_slug;

  get diagnostics n = row_count;
  return n;
end;
$$;

-- New signups get the same realistic schedule
create or replace function public.handle_new_user_seed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  digikraal_id uuid;
begin
  insert into public.entities (user_id, slug, name, sort_order)
  values
    (new.id, 'dj', 'DJ Eksteen', 0),
    (new.id, 'digikraal', 'Digikraal', 1),
    (new.id, 'farm_feed', 'Farm Feed', 2),
    (new.id, 'northpoint', 'Northpoint', 3)
  on conflict (user_id, slug) do nothing;

  insert into public.entity_members (entity_id, user_id, role)
  select e.id, new.id, 'owner'::entity_role
  from public.entities e
  where e.user_id = new.id
  on conflict (entity_id, user_id) do nothing;

  select id into digikraal_id
  from public.entities
  where user_id = new.id and slug = 'digikraal'
  limit 1;

  if digikraal_id is not null then
    insert into public.divisions (user_id, entity_id, slug, name, sort_order)
    values
      (new.id, digikraal_id, 'dk_agency', 'DK Agency', 0),
      (new.id, digikraal_id, 'dk_tech', 'DK Tech', 1),
      (new.id, digikraal_id, 'dk_property', 'DK Property', 2),
      (new.id, digikraal_id, 'dk_agri', 'DK Agri', 3)
    on conflict (user_id, entity_id, slug) do nothing;
  end if;

  perform public.seed_dj_werk_meetings(new.id);

  return new;
end;
$$;

-- Backfill for accounts that already have entities
do $$
declare
  u uuid;
begin
  for u in select distinct user_id from public.entities
  loop
    perform public.seed_dj_werk_meetings(u);
  end loop;
end $$;

-- Auth users created before handle_new_user_seed had no entities row → seed path never ran
do $$
declare
  r record;
  digikraal_id uuid;
begin
  for r in
    select u.id as user_id
    from auth.users u
    where not exists (select 1 from public.entities e where e.user_id = u.id)
  loop
    insert into public.entities (user_id, slug, name, sort_order)
    values
      (r.user_id, 'dj', 'DJ Eksteen', 0),
      (r.user_id, 'digikraal', 'Digikraal', 1),
      (r.user_id, 'farm_feed', 'Farm Feed', 2),
      (r.user_id, 'northpoint', 'Northpoint', 3)
    on conflict (user_id, slug) do nothing;

    insert into public.entity_members (entity_id, user_id, role)
    select e.id, r.user_id, 'owner'::entity_role
    from public.entities e
    where e.user_id = r.user_id
    on conflict (entity_id, user_id) do nothing;

    select id into digikraal_id
    from public.entities
    where user_id = r.user_id and slug = 'digikraal'
    limit 1;

    if digikraal_id is not null then
      insert into public.divisions (user_id, entity_id, slug, name, sort_order)
      values
        (r.user_id, digikraal_id, 'dk_agency', 'DK Agency', 0),
        (r.user_id, digikraal_id, 'dk_tech', 'DK Tech', 1),
        (r.user_id, digikraal_id, 'dk_property', 'DK Property', 2),
        (r.user_id, digikraal_id, 'dk_agri', 'DK Agri', 3)
      on conflict (user_id, entity_id, slug) do nothing;
    end if;

    perform public.seed_dj_werk_meetings(r.user_id);
  end loop;
end $$;
