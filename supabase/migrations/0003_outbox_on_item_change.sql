create or replace function public.enqueue_item_outbox_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'item_id', new.id,
    'type', new.type,
    'status', new.status,
    'priority', new.priority,
    'title', new.title,
    'due_at', new.due_at,
    'deleted_at', new.deleted_at,
    'updated_at', new.updated_at
  );

  insert into public.sync_outbox (user_id, item_id, event_type, payload, status)
  values (new.user_id, new.id, 'item.upsert', payload, 'pending');

  return new;
end;
$$;

drop trigger if exists items_outbox_on_insert on public.items;
create trigger items_outbox_on_insert
after insert on public.items
for each row execute function public.enqueue_item_outbox_event();

drop trigger if exists items_outbox_on_update on public.items;
create trigger items_outbox_on_update
after update on public.items
for each row
when (
  (old.updated_at is distinct from new.updated_at) or
  (old.status is distinct from new.status) or
  (old.deleted_at is distinct from new.deleted_at)
)
execute function public.enqueue_item_outbox_event();

