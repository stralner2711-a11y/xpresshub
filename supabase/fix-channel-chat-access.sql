-- Run this in Supabase SQL Editor if the database already exists.
-- It lets channel chat access follow the approved vehicle_type only.
-- Do not grant channel access from editable title text or license notes.
-- Safe to run more than once.

create or replace function private.can_access_conversation(target_conversation uuid)
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

create or replace function private.can_read_conversation(target_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select private.can_access_conversation(target_conversation);
$$;
