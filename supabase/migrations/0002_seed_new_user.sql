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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_seed on auth.users;
create trigger on_auth_user_created_seed
after insert on auth.users
for each row execute procedure public.handle_new_user_seed();

