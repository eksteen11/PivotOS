-- Import DJ Werk spreadsheet rows via JSON payload chunks.

create or replace function public.import_dj_werk_items(
  p_user_id uuid,
  p_items jsonb,
  p_replace boolean default false
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_count integer := 0;
  v_entity_id uuid;
  v_division_id uuid;
  v_workstream_id uuid;
begin
  if p_replace then
    delete from public.items where user_id = p_user_id;
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select e.id into v_entity_id
    from public.entities e
    where e.user_id = p_user_id
      and e.slug = v_item->>'entity_slug'
    limit 1;

    if v_entity_id is null then
      continue;
    end if;

    v_division_id := null;
    if coalesce(v_item->>'division_slug', '') <> '' then
      select d.id into v_division_id
      from public.divisions d
      where d.user_id = p_user_id
        and d.entity_id = v_entity_id
        and d.slug = v_item->>'division_slug'
      limit 1;
    end if;

    v_workstream_id := null;
    if coalesce(v_item->>'workstream_slug', '') <> '' then
      select w.id into v_workstream_id
      from public.workstreams w
      where w.user_id = p_user_id
        and w.entity_id = v_entity_id
        and w.slug = v_item->>'workstream_slug'
      limit 1;
    end if;

    insert into public.items (
      id,
      user_id,
      entity_id,
      division_id,
      workstream_id,
      type,
      status,
      priority,
      source,
      owner,
      value,
      title,
      content,
      due_at,
      scheduled_blocks,
      meta,
      client_updated_at,
      updated_at
    ) values (
      gen_random_uuid(),
      p_user_id,
      v_entity_id,
      v_division_id,
      v_workstream_id,
      (v_item->>'type')::item_type,
      'planned'::item_status,
      2,
      'sheet',
      nullif(v_item->>'owner', ''),
      nullif(v_item->>'value', '')::numeric,
      left(v_item->>'title', 200),
      coalesce(v_item->>'content', ''),
      case
        when coalesce(v_item->>'due_date', '') = '' then null
        else (v_item->>'due_date')::timestamptz + interval '9 hours'
      end,
      '[]'::jsonb,
      coalesce(v_item->'meta', '{}'::jsonb),
      now(),
      now()
    );

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

revoke all on function public.import_dj_werk_items(uuid, jsonb, boolean) from public;
revoke all on function public.import_dj_werk_items(uuid, jsonb, boolean) from anon;
revoke all on function public.import_dj_werk_items(uuid, jsonb, boolean) from authenticated;
