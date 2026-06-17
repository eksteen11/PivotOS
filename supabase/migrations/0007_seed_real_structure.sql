-- PivotOS V2: seed the real Entity -> Division -> Workstream taxonomy from the
-- DJ Werk 2026 spreadsheet, plus a small set of realistic sample activities.
-- Idempotent per user. Safe to re-run.

create or replace function public.seed_pivotos_v2_structure(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  digikraal_id uuid;
begin
  -- Entities (idempotent; matches existing seed)
  insert into public.entities (user_id, slug, name, sort_order)
  values
    (p_user_id, 'dj', 'DJ Eksteen', 0),
    (p_user_id, 'digikraal', 'Digikraal', 1),
    (p_user_id, 'farm_feed', 'Farm Feed', 2),
    (p_user_id, 'northpoint', 'Northpoint Realty', 3)
  on conflict (user_id, slug) do nothing;

  select id into digikraal_id from public.entities where user_id = p_user_id and slug = 'digikraal' limit 1;

  -- Digikraal real divisions
  if digikraal_id is not null then
    insert into public.divisions (user_id, entity_id, slug, name, sort_order)
    values
      (p_user_id, digikraal_id, 'dk_agency', 'Agency', 0),
      (p_user_id, digikraal_id, 'dk_property', 'Property', 1),
      (p_user_id, digikraal_id, 'dk_erhard', 'Erhard', 2),
      (p_user_id, digikraal_id, 'dk_tiaan', 'Tiaan', 3),
      (p_user_id, digikraal_id, 'dk_finadmin', 'Finance & Admin', 4),
      (p_user_id, digikraal_id, 'dk_tertius', 'Tertius', 5),
      (p_user_id, digikraal_id, 'dk_projects', 'Projects', 6),
      (p_user_id, digikraal_id, 'dk_website', 'Website', 7)
    on conflict (user_id, entity_id, slug) do nothing;
  end if;

  -- Workstreams (slugs unique per entity)
  insert into public.workstreams (user_id, entity_id, division_id, slug, name, sort_order)
  select p_user_id, e.id, d.id, v.ws_slug, v.ws_name, v.sort
  from (
    values
      -- DJ Eksteen (personal, no division)
      ('dj', null, 'dj_planning', 'Planning', 0),
      ('dj', null, 'dj_income', 'Income / Coding', 1),
      ('dj', null, 'dj_ideas', 'Ideas', 2),
      ('dj', null, 'dj_finances', 'Finances', 3),
      ('dj', null, 'dj_family', 'Family', 4),
      ('dj', null, 'dj_church', 'Church', 5),
      ('dj', null, 'dj_admin', 'Admin', 6),
      ('dj', null, 'dj_health', 'Health', 7),

      -- Northpoint Realty
      ('northpoint', null, 'np_listings', 'Listings', 0),
      ('northpoint', null, 'np_buyers', 'Buyers', 1),
      ('northpoint', null, 'np_sellers', 'Sellers', 2),
      ('northpoint', null, 'np_viewings', 'Viewings', 3),
      ('northpoint', null, 'np_rentals', 'Rentals', 4),
      ('northpoint', null, 'np_tenants', 'Tenants', 5),
      ('northpoint', null, 'np_leads', 'Property Leads', 6),
      ('northpoint', null, 'np_followups', 'Follow Ups', 7),
      ('northpoint', null, 'np_marketing', 'Marketing', 8),
      ('northpoint', null, 'np_admin', 'Admin', 9),
      ('northpoint', null, 'np_deals', 'Deals', 10),
      ('northpoint', null, 'np_propverse', 'Propverse', 11),

      -- Farm Feed
      ('farm_feed', null, 'ff_trading', 'Commodity Trading', 0),
      ('farm_feed', null, 'ff_sourcing', 'Sourcing', 1),
      ('farm_feed', null, 'ff_logistics', 'Logistics', 2),
      ('farm_feed', null, 'ff_sales', 'Sales', 3),
      ('farm_feed', null, 'ff_crm', 'CRM', 4),
      ('farm_feed', null, 'ff_marketing', 'Marketing', 5),
      ('farm_feed', null, 'ff_finadmin', 'Finance & Admin', 6),
      ('farm_feed', null, 'ff_contracts', 'Contracts', 7),
      ('farm_feed', null, 'ff_listings', 'Listings', 8),
      ('farm_feed', null, 'ff_safex', 'SAFEX Prices', 9),

      -- Digikraal / Agency
      ('digikraal', 'dk_agency', 'agency_loads', 'Loads', 0),
      ('digikraal', 'dk_agency', 'agency_sales', 'Sales', 1),
      ('digikraal', 'dk_agency', 'agency_buyers', 'Buyers', 2),
      ('digikraal', 'dk_agency', 'agency_sellers', 'Sellers', 3),
      ('digikraal', 'dk_agency', 'agency_auctions', 'Auctions', 4),
      ('digikraal', 'dk_agency', 'agency_marketing', 'Marketing', 5),
      ('digikraal', 'dk_agency', 'agency_meetings', 'Meetings', 6),

      -- Digikraal / Property
      ('digikraal', 'dk_property', 'property_acquisitions', 'Acquisitions', 0),
      ('digikraal', 'dk_property', 'property_sales', 'Sales', 1),
      ('digikraal', 'dk_property', 'property_flips', 'Flips', 2),
      ('digikraal', 'dk_property', 'property_development', 'Development', 3),
      ('digikraal', 'dk_property', 'property_leads', 'Leads', 4),
      ('digikraal', 'dk_property', 'property_legal', 'Legal', 5),
      ('digikraal', 'dk_property', 'property_levies', 'Levies / HOA', 6),
      ('digikraal', 'dk_property', 'property_bridging', 'Bridging Finance', 7),
      ('digikraal', 'dk_property', 'property_otp', 'OTP', 8),

      -- Digikraal / Erhard
      ('digikraal', 'dk_erhard', 'erhard_farming', 'Farming', 0),
      ('digikraal', 'dk_erhard', 'erhard_stock', 'Livestock Stock', 1),
      ('digikraal', 'dk_erhard', 'erhard_sales', 'Sales', 2),
      ('digikraal', 'dk_erhard', 'erhard_purchases', 'Purchases', 3),
      ('digikraal', 'dk_erhard', 'erhard_expenses', 'Expenses', 4),
      ('digikraal', 'dk_erhard', 'erhard_reports', 'Reports', 5),
      ('digikraal', 'dk_erhard', 'erhard_containers', 'Containers', 6),
      ('digikraal', 'dk_erhard', 'erhard_cash', 'Cash', 7),

      -- Digikraal / Tiaan
      ('digikraal', 'dk_tiaan', 'tiaan_strategic', 'Strategic Projects', 0),
      ('digikraal', 'dk_tiaan', 'tiaan_investments', 'Investments', 1),
      ('digikraal', 'dk_tiaan', 'tiaan_ventures', 'New Ventures', 2),
      ('digikraal', 'dk_tiaan', 'tiaan_financing', 'Financing', 3),
      ('digikraal', 'dk_tiaan', 'tiaan_shareholding', 'Shareholding', 4),

      -- Digikraal / Finance & Admin
      ('digikraal', 'dk_finadmin', 'finadmin_accounting', 'Accounting', 0),
      ('digikraal', 'dk_finadmin', 'finadmin_payments', 'Payments', 1),
      ('digikraal', 'dk_finadmin', 'finadmin_cashflow', 'Cashflow', 2),
      ('digikraal', 'dk_finadmin', 'finadmin_compliance', 'Compliance', 3),
      ('digikraal', 'dk_finadmin', 'finadmin_reporting', 'Reporting', 4),
      ('digikraal', 'dk_finadmin', 'finadmin_employees', 'Employees', 5),
      ('digikraal', 'dk_finadmin', 'finadmin_structure', 'Structure', 6),
      ('digikraal', 'dk_finadmin', 'finadmin_insurance', 'Insurance', 7),

      -- Digikraal / Tertius
      ('digikraal', 'dk_tertius', 'tertius_farming', 'Farming', 0),
      ('digikraal', 'dk_tertius', 'tertius_trading', 'Trading', 1),
      ('digikraal', 'dk_tertius', 'tertius_sales', 'Sales', 2),
      ('digikraal', 'dk_tertius', 'tertius_stock', 'Stock', 3),

      -- Digikraal / Projects
      ('digikraal', 'dk_projects', 'projects_ventures', 'New Ventures', 0),
      ('digikraal', 'dk_projects', 'projects_experiments', 'Experiments', 1),
      ('digikraal', 'dk_projects', 'projects_ideas', 'Business Ideas', 2),
      ('digikraal', 'dk_projects', 'projects_partnerships', 'Partnerships', 3),

      -- Digikraal / Website
      ('digikraal', 'dk_website', 'website_dev', 'Development', 0),
      ('digikraal', 'dk_website', 'website_bugs', 'Bugs', 1),
      ('digikraal', 'dk_website', 'website_features', 'Features', 2),
      ('digikraal', 'dk_website', 'website_hosting', 'Hosting', 3),
      ('digikraal', 'dk_website', 'website_revenue', 'Revenue Builds', 4),
      ('digikraal', 'dk_website', 'website_payments', 'Payment Gateways', 5),
      ('digikraal', 'dk_website', 'website_marketing', 'Marketing', 6)
  ) as v(entity_slug, division_slug, ws_slug, ws_name, sort)
  join public.entities e on e.user_id = p_user_id and e.slug = v.entity_slug
  left join public.divisions d
    on d.user_id = p_user_id and d.entity_id = e.id and d.slug = v.division_slug
  on conflict (user_id, entity_id, slug) do nothing;
end;
$$;

-- Sample activities (idempotent via meta.seed_batch). Showcases the 4 panels.
create or replace function public.seed_pivotos_v2_samples(p_user_id uuid)
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
    and coalesce(meta->>'seed_batch', '') = 'v2_samples_v1';

  insert into public.items (
    id, user_id, entity_id, division_id, workstream_id,
    type, status, priority, source, owner, value,
    title, content, due_at, scheduled_blocks, meta, client_updated_at, updated_at
  )
  select
    gen_random_uuid(), p_user_id, e.id, w.division_id, w.id,
    v.atype::item_type, v.astatus::item_status, v.prio, v.asource, v.aowner, v.aval,
    v.title, '', now() + make_interval(days => v.due_days), '[]'::jsonb,
    jsonb_build_object('seed_batch', 'v2_samples_v1', 'entity_slug', v.entity_slug, 'workstream_slug', v.ws_slug),
    now(), now()
  from (
    values
      ('northpoint','np_deals','deal','planned',3,'manual','Sonja Cilliers',374100::numeric,'Oude Chardonnay sale',3),
      ('northpoint','np_followups','follow_up','waiting',3,'whatsapp','Molibiemang',null::numeric,'Follow up buyer - Hartebeesfontein viewing',1),
      ('northpoint','np_admin','task','planned',2,'manual','Jacob',null::numeric,'Update Property24 listings (expiring soon)',2),
      ('farm_feed','ff_sales','sale','planned',3,'manual','Stephan Malan',47500::numeric,'Lusern Bigpacks - Danie Raath',4),
      ('farm_feed','ff_finadmin','invoice','waiting',3,'email','Pieter Lambrechts',null::numeric,'Overberg Agri credit application',5),
      ('farm_feed','ff_logistics','task','planned',2,'whatsapp','Martin',null::numeric,'Laai Botswana mielies + koring',1),
      ('digikraal','agency_sales','deal','in_progress',3,'manual','Jannie Durr',165000::numeric,'Livestock bulk sale - 22x Limousin',2),
      ('digikraal','property_bridging','opportunity','planned',3,'manual','Rohan Nel',2000000::numeric,'Rule 72 bridging - Golden Pond',7),
      ('digikraal','erhard_sales','sale','planned',2,'manual','Tasmara',48000::numeric,'4x Angus koeie - cash',1),
      ('digikraal','finadmin_payments','payment','waiting',4,'manual','Conrad',49000::numeric,'Settle Deonita feed invoice',0),
      ('digikraal','tiaan_investments','opportunity','planned',3,'manual','Tiaan',null::numeric,'SME Ubuntu Livestock Financing - Stilfontein',14),
      ('digikraal','website_revenue','project','in_progress',3,'manual','Ryan',null::numeric,'Build Online Auctions module',10),
      ('digikraal','website_bugs','problem','planned',3,'website','Ryan',null::numeric,'Images not showing on mobile',1),
      ('dj','dj_ideas','idea','planned',2,'manual',null::text,null::numeric,'Trendmint - Google Trends + ads app',30),
      ('dj','dj_income','project','in_progress',4,'manual','DJ',null::numeric,'Build PivotOS',5),
      ('dj','dj_finances','payment','waiting',4,'manual',null::text,null::numeric,'Huis bond payment due',3)
  ) as v(entity_slug, ws_slug, atype, astatus, prio, asource, aowner, aval, title, due_days)
  join public.entities e on e.user_id = p_user_id and e.slug = v.entity_slug
  join public.workstreams w on w.user_id = p_user_id and w.entity_id = e.id and w.slug = v.ws_slug;

  get diagnostics n = row_count;
  return n;
end;
$$;

-- New signups also get V2 structure + samples
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
    (new.id, 'northpoint', 'Northpoint Realty', 3)
  on conflict (user_id, slug) do nothing;

  insert into public.entity_members (entity_id, user_id, role)
  select e.id, new.id, 'owner'::entity_role
  from public.entities e
  where e.user_id = new.id
  on conflict (entity_id, user_id) do nothing;

  select id into digikraal_id from public.entities where user_id = new.id and slug = 'digikraal' limit 1;

  if digikraal_id is not null then
    insert into public.divisions (user_id, entity_id, slug, name, sort_order)
    values
      (new.id, digikraal_id, 'dk_agency', 'Agency', 0),
      (new.id, digikraal_id, 'dk_property', 'Property', 1),
      (new.id, digikraal_id, 'dk_erhard', 'Erhard', 2),
      (new.id, digikraal_id, 'dk_tiaan', 'Tiaan', 3),
      (new.id, digikraal_id, 'dk_finadmin', 'Finance & Admin', 4),
      (new.id, digikraal_id, 'dk_tertius', 'Tertius', 5),
      (new.id, digikraal_id, 'dk_projects', 'Projects', 6),
      (new.id, digikraal_id, 'dk_website', 'Website', 7)
    on conflict (user_id, entity_id, slug) do nothing;
  end if;

  perform public.seed_pivotos_v2_structure(new.id);
  perform public.seed_dj_werk_meetings(new.id);
  perform public.seed_pivotos_v2_samples(new.id);

  return new;
end;
$$;

-- Backfill existing users
do $$
declare
  u uuid;
begin
  for u in select distinct user_id from public.entities
  loop
    perform public.seed_pivotos_v2_structure(u);
    perform public.seed_pivotos_v2_samples(u);
  end loop;
end $$;
