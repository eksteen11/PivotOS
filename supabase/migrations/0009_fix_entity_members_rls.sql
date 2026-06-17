-- Fix infinite recursion in entity_members RLS (42P17).
-- Policies that subquery entity_members from within entity_members policies recurse forever.
-- Use SECURITY DEFINER helpers so membership checks bypass RLS on entity_members.

create or replace function public.user_is_entity_member(p_entity_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entity_members em
    where em.entity_id = p_entity_id
      and em.user_id = auth.uid()
  );
$$;

create or replace function public.user_is_entity_admin(p_entity_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entity_members em
    where em.entity_id = p_entity_id
      and em.user_id = auth.uid()
      and em.role in ('owner', 'admin')
  );
$$;

revoke all on function public.user_is_entity_member(uuid) from public;
revoke all on function public.user_is_entity_admin(uuid) from public;
grant execute on function public.user_is_entity_member(uuid) to authenticated;
grant execute on function public.user_is_entity_admin(uuid) to authenticated;

-- entity_members
drop policy if exists entity_members_select on public.entity_members;
create policy entity_members_select on public.entity_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.user_is_entity_admin(entity_id)
);

drop policy if exists entity_members_insert on public.entity_members;
create policy entity_members_insert on public.entity_members
for insert
to authenticated
with check (public.user_is_entity_admin(entity_id));

drop policy if exists entity_members_update on public.entity_members;
create policy entity_members_update on public.entity_members
for update
to authenticated
using (public.user_is_entity_admin(entity_id))
with check (public.user_is_entity_admin(entity_id));

drop policy if exists entity_members_delete on public.entity_members;
create policy entity_members_delete on public.entity_members
for delete
to authenticated
using (public.user_is_entity_admin(entity_id));

-- entity_invites
drop policy if exists entity_invites_select on public.entity_invites;
create policy entity_invites_select on public.entity_invites
for select
to authenticated
using (
  public.user_is_entity_admin(entity_id)
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists entity_invites_insert on public.entity_invites;
create policy entity_invites_insert on public.entity_invites
for insert
to authenticated
with check (
  invited_by = auth.uid()
  and public.user_is_entity_admin(entity_id)
);

drop policy if exists entity_invites_update on public.entity_invites;
create policy entity_invites_update on public.entity_invites
for update
to authenticated
using (
  public.user_is_entity_admin(entity_id)
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  public.user_is_entity_admin(entity_id)
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- entities, divisions, items (avoid inline entity_members subqueries)
drop policy if exists entities_rw on public.entities;
create policy entities_rw on public.entities
for all
to authenticated
using (
  auth.uid() = user_id
  or public.user_is_entity_member(id)
)
with check (auth.uid() = user_id);

drop policy if exists divisions_rw on public.divisions;
create policy divisions_rw on public.divisions
for all
to authenticated
using (
  auth.uid() = user_id
  or public.user_is_entity_member(entity_id)
)
with check (
  auth.uid() = user_id
  or public.user_is_entity_admin(entity_id)
);

drop policy if exists items_rw on public.items;
create policy items_rw on public.items
for all
to authenticated
using (
  auth.uid() = user_id
  or (
    items.entity_id is not null
    and public.user_is_entity_member(items.entity_id)
  )
)
with check (
  auth.uid() = user_id
  and (
    items.entity_id is null
    or public.user_is_entity_member(items.entity_id)
  )
);

drop policy if exists item_links_rw on public.item_links;
create policy item_links_rw on public.item_links
for all
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.items i
    where i.id = item_links.from_item_id
      and i.entity_id is not null
      and public.user_is_entity_member(i.entity_id)
  )
)
with check (auth.uid() = user_id);

drop policy if exists outbox_rw on public.sync_outbox;
create policy outbox_rw on public.sync_outbox
for all
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.items i
    where i.id = sync_outbox.item_id
      and i.entity_id is not null
      and public.user_is_entity_member(i.entity_id)
  )
)
with check (auth.uid() = user_id);
