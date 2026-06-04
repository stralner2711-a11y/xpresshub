-- Run this in Supabase SQL Editor if the database already exists.
-- It lets channel chat access follow work function, not only access_role.
-- Example: a chef/admin with role "LastbilchauffÃ¸r", vehicle_type "truck",
-- or C/E in license_summary can read Lastbilchat.

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
      and (
        c.channel_type = 'all'
        or (c.channel_type = 'van' and (p.vehicle_type = 'van' or p.role ilike '%varebil%'))
        or (c.channel_type = 'truck' and (p.vehicle_type = 'truck' or p.role ilike '%lastbil%' or p.license_summary ilike '%C/E%'))
        or (c.channel_type = 'direct' and private.is_conversation_member(c.id))
      )
  );
$$;
