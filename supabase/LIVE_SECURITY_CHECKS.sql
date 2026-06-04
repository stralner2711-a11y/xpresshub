-- XpressIntra live security checks
-- Run in Supabase SQL Editor after schema changes.
-- These checks do not delete data.

-- 1. Project tables with personal data should have RLS enabled.
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'profile_private_details',
    'employee_invitations',
    'location_shares',
    'workday_sessions',
    'pickup_tasks',
    'conversations',
    'conversation_members',
    'messages',
    'media_attachments',
    'private_log_entries',
    'data_subject_requests'
  )
order by tablename;

-- 2. Internal helper functions must be in private schema, not public RPC.
select
  n.nspname as schema,
  p.proname as function_name,
  p.prosecdef as security_definer,
  p.proacl::text as privileges
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where p.proname in (
  'is_admin',
  'is_dispatcher_or_admin',
  'is_conversation_member',
  'can_access_conversation',
  'can_read_conversation'
)
order by n.nspname, p.proname;

-- 3. Public schema should not expose the internal RLS helper functions.
select count(*) as public_rls_helper_functions
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'is_admin',
    'is_dispatcher_or_admin',
    'is_conversation_member',
    'can_access_conversation',
    'can_read_conversation'
  );

-- 4. Storage bucket must stay private.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'xpressintra-media';

-- 5. Standard chats should exist.
select id, title, channel_type, is_default
from public.conversations
where is_default = true
order by channel_type, title;

-- 6. Creator profile check.
select email, full_name, access_role, vehicle_type, role, employment_status
from public.profiles
where email = 'stralner2711@gmail.com';
