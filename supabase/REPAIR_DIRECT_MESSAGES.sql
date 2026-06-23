-- XpressIntra repair: direkte beskeder / start_direct_conversation
-- Koer denne i Supabase SQL Editor, hvis appen siger:
-- "Databasen mangler funktionen til direkte beskeder" eller
-- "Could not find the function public.start_direct_conversation".
--
-- Den sletter ikke data. Den genopretter kun de funktioner, som appen
-- bruger til sikre direkte samtaler, og beder Supabase API om at genlaese schema.

create schema if not exists private;

create or replace function private.is_conversation_member(target_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.conversation_members
    where conversation_id = target_conversation
      and user_id = auth.uid()
  );
$$;

create or replace function private.can_read_conversation(target_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.conversations c
    left join public.profiles p on p.id = auth.uid()
    where c.id = target_conversation
      and coalesce(p.employment_status, 'active') = 'active'
      and (
        c.channel_type = 'all'
        or (c.channel_type = 'van' and p.vehicle_type = 'van')
        or (c.channel_type = 'truck' and p.vehicle_type = 'truck')
        or (c.channel_type = 'direct' and private.is_conversation_member(c.id))
      )
  );
$$;

create or replace function public.start_direct_conversation(target_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_conversation_id uuid;
  new_conversation_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'cannot_start_direct_conversation_with_self';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = target_user_id
      and employment_status = 'active'
  ) then
    raise exception 'target_user_not_active';
  end if;

  select c.id into existing_conversation_id
  from public.conversations c
  join public.conversation_members me
    on me.conversation_id = c.id
   and me.user_id = auth.uid()
  join public.conversation_members them
    on them.conversation_id = c.id
   and them.user_id = target_user_id
  where c.channel_type = 'direct'
  limit 1;

  if existing_conversation_id is not null then
    return existing_conversation_id;
  end if;

  insert into public.conversations (title, channel_type, is_group)
  values ('Direkte samtale', 'direct', false)
  returning id into new_conversation_id;

  insert into public.conversation_members (conversation_id, user_id)
  values
    (new_conversation_id, auth.uid()),
    (new_conversation_id, target_user_id);

  return new_conversation_id;
end;
$$;

create or replace function public.start_direct_conversation_v2(target_user_id uuid)
returns uuid
language sql
security definer
set search_path = public
as $$
  select public.start_direct_conversation(target_user_id);
$$;

grant usage on schema public to authenticated;
revoke execute on function public.start_direct_conversation(uuid) from public, anon;
revoke execute on function public.start_direct_conversation_v2(uuid) from public, anon;
grant execute on function public.start_direct_conversation(uuid) to authenticated;
grant execute on function public.start_direct_conversation_v2(uuid) to authenticated;

notify pgrst, 'reload schema';
select pg_notification_queue_usage();
