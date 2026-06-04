-- XpressIntra fuld Supabase-opsaetning
-- Brug denne i ET Supabase SQL-vindue.
--
-- Saadan bruges den:
-- 1. Log ind i Supabase.
-- 2. Aabn SQL Editor.
-- 3. Indsaet hele denne tekst.
-- 4. Tryk Run.
--
-- VIGTIGT:
-- Denne fil nulstiller XpressIntra-tabellerne foerst og bygger derefter alt op igen.
-- Den sletter XpressIntra-data i public-tabeller.
-- Den sletter IKKE auth.users.
-- Den sletter IKKE filer direkte fra Supabase Storage, fordi Supabase blokerer direkte delete fra storage-tabeller.
--
-- Indeholder:
-- - Reset af gamle XpressIntra-tabeller og funktioner
-- - Hele database-strukturen
-- - Sikkerhedsregler/RLS
-- - Privat Storage-bucket til billeder
-- - Chatkanaler og direkte beskeder
-- - Livekort/GPS inkl. workday, hurtig deling og pickup-deling
-- - Medarbejderregistrering/invitationer
-- - Pickup live-noter
-- - Notifikationer, koeretoejer, dokumenter/opslag og logbog
-- - GDPR/dataanmodninger, retention/slettefrister og audit-log
-- - Creator-rettighed til stralner2711@gmail.com som Appansvarlig og Lastbilchauffoer
--
-- Hvis creator-rettigheden skal saettes med det samme, skal brugeren
-- stralner2711@gmail.com allerede vaere oprettet/logget ind i Supabase Auth.
-- Appen maa kun bruge Supabase publishable/anon key. Brug aldrig service-role i appen/APK.
-- Denne fil er ren fra bunden og indeholder ikke gamle fix-blokke.

-- ============================================================
-- RESET: ryd gamle XpressIntra-tabeller foerst
-- ============================================================

-- XpressIntra reset for Supabase
-- Brug kun denne hvis du vil starte app-databasen helt forfra.
--
-- VIGTIGT:
-- Denne fil sletter XpressIntra-tabeller, policies og funktioner.
-- Den sletter ikke auth.users. Storage-filer slettes ikke direkte, fordi Supabase blokerer direkte delete fra storage-tabeller.
--
-- Rigtig rækkefølge:
-- 1. Kør denne RESET_XPRESSINTRA_SUPABASE.sql.
-- 2. Kør derefter RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql.

do $$
begin
  if to_regclass('public.profiles') is not null then
    drop trigger if exists protect_profile_security_fields on public.profiles;
  end if;

  drop trigger if exists on_auth_user_created on auth.users;
end;
$$;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.start_direct_conversation(uuid) cascade;
drop function if exists public.can_access_conversation(uuid) cascade;
drop function if exists public.can_read_conversation(uuid) cascade;
drop function if exists public.is_conversation_member(uuid) cascade;
drop function if exists public.protect_profile_security_fields() cascade;
drop function if exists public.purge_expired_operational_data() cascade;
drop function if exists public.is_dispatcher_or_admin() cascade;
drop function if exists public.is_admin() cascade;
drop schema if exists private cascade;

drop table if exists public.notification_preferences cascade;
drop table if exists public.notifications cascade;
drop table if exists public.vehicles cascade;
drop table if exists public.data_subject_requests cascade;
drop table if exists public.retention_policies cascade;
drop table if exists public.legal_acceptances cascade;
drop table if exists public.core_settings cascade;
drop table if exists public.regulatory_updates cascade;
drop table if exists public.regulatory_sources cascade;
drop table if exists public.logbook_automation_settings cascade;
drop table if exists public.private_log_entries cascade;
drop table if exists public.announcement_comments cascade;
drop table if exists public.announcement_reactions cascade;
drop table if exists public.announcements cascade;
drop table if exists public.media_attachments cascade;
drop table if exists public.messages cascade;
drop table if exists public.conversation_members cascade;
drop table if exists public.conversations cascade;
drop table if exists public.pickup_tasks cascade;
drop table if exists public.workday_sessions cascade;
drop table if exists public.location_shares cascade;
drop table if exists public.employee_invitations cascade;
drop table if exists public.admin_audit_log cascade;
drop table if exists public.profile_private_details cascade;
drop table if exists public.profiles cascade;


-- ============================================================
-- schema.sql
-- ============================================================

-- XpressIntra database schema for Supabase.
-- Run this in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create schema if not exists private;
grant usage on schema private to authenticated, service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('xpressintra-media', 'xpressintra-media', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  department text,
  license_summary text,
  languages text,
  role text not null default 'Chauffør',
  access_role text not null default 'employee' check (access_role in ('employee', 'dispatcher', 'admin', 'owner')),
  vehicle_type text not null default 'van' check (vehicle_type in ('van', 'truck', 'dispatch')),
  truck text,
  employment_status text not null default 'active' check (employment_status in ('active', 'paused', 'offboarded')),
  logbook_enabled boolean not null default false,
  password_reset_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_private_details (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  emergency_contact text,
  private_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.employee_invitations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'Chauffør',
  access_role text not null default 'employee' check (access_role in ('employee', 'dispatcher', 'admin', 'owner')),
  vehicle_type text not null default 'van' check (vehicle_type in ('van', 'truck', 'dispatch')),
  truck text,
  department text,
  license_summary text,
  languages text,
  emergency_contact text,
  logbook_enabled boolean not null default false,
  onboarding_method text not null default 'standard_password' check (onboarding_method in ('standard_password', 'manual')),
  password_reset_required boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists password_reset_required boolean not null default false;

alter table public.employee_invitations
  alter column role set default 'Chauffør',
  add column if not exists onboarding_method text not null default 'standard_password' check (onboarding_method in ('standard_password', 'manual')),
  add column if not exists password_reset_required boolean not null default true;

create table if not exists public.core_settings (
  key text primary key,
  enabled boolean not null default true,
  description text not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_acceptances (
  user_id uuid not null references public.profiles(id) on delete cascade,
  policy_version text not null,
  accepted_at timestamptz not null default now(),
  primary key (user_id, policy_version)
);

create table if not exists public.retention_policies (
  key text primary key,
  label text not null,
  retention_days integer check (retention_days is null or retention_days > 0),
  description text not null,
  auto_delete boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.retention_policies
  add column if not exists auto_delete boolean not null default false;

create table if not exists public.data_subject_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('access', 'rectification', 'erasure', 'export', 'restriction', 'objection')),
  status text not null default 'open' check (status in ('open', 'in_review', 'completed', 'rejected')),
  message text,
  handled_by uuid references public.profiles(id) on delete set null,
  handled_note text,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  unit text not null,
  plate text unique,
  vehicle_type text not null check (vehicle_type in ('van', 'truck', 'other')),
  equipment text,
  status text not null default 'ready',
  assigned_driver_id uuid references public.profiles(id) on delete set null,
  next_check text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  level text not null default 'message' check (level in ('message', 'office', 'rule', 'task', 'privacy', 'urgent')),
  priority text not null default 'normal' check (priority in ('normal', 'medium', 'high')),
  category text not null default 'office' check (category in ('office', 'rules', 'chat', 'task', 'privacy')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  office boolean not null default true,
  rules boolean not null default true,
  chat boolean not null default true,
  daily_brief boolean not null default true,
  quiet_hours boolean not null default true,
  quiet_start time not null default '19:00',
  quiet_end time not null default '06:00',
  updated_at timestamptz not null default now()
);

create table if not exists public.location_shares (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  speed_kmh numeric(6, 2) check (speed_kmh is null or speed_kmh >= 0),
  visibility text not null default 'team' check (visibility in ('team', 'pickup')),
  visible_to_user_id uuid references public.profiles(id) on delete cascade,
  audience text not null default 'all' check (audience in ('all', 'truck', 'van', 'none')),
  show_speed boolean not null default false,
  show_vehicle boolean not null default true,
  show_status boolean not null default true,
  status text not null default 'sharing' check (status in ('sharing', 'driving', 'pause', 'pickup')),
  share_mode text not null default 'manual' check (share_mode in ('manual', 'workday', 'manuel', 'arbejdsdag', '15 min', '30 min', '60 min', 'pickup')),
  expires_at timestamptz,
  last_updated_at timestamptz not null default now(),
  check (visibility = 'team' or visible_to_user_id is not null),
  shared_at timestamptz not null default now()
);

alter table public.location_shares
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'truck', 'van', 'none'));

create table if not exists public.workday_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  ended_at timestamptz,
  status text not null default 'active' check (status in ('active', 'ended', 'auto_ended')),
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.pickup_tasks (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  colleague_id uuid not null references public.profiles(id) on delete cascade,
  note text check (length(note) <= 500),
  pickup_place text,
  dropoff_place text,
  reference text,
  priority text not null default 'Normal' check (priority in ('Normal', 'Haster', 'Kan vente')),
  status text not null default 'started' check (status in ('started', 'found', 'picked_up', 'delivered', 'blocked', 'cancelled')),
  checklist jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  started_location_sharing boolean not null default false,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text,
  channel_type text not null default 'direct' check (channel_type in ('direct', 'all', 'van', 'truck')),
  is_group boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.media_attachments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  message_id bigint references public.messages(id) on delete cascade,
  announcement_id bigint,
  log_entry_id bigint,
  bucket text not null default 'xpressintra-media',
  storage_path text not null,
  file_name text not null,
  mime_type text not null check (mime_type like 'image/%'),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  visibility text not null default 'conversation' check (visibility in ('conversation', 'announcement', 'private_log', 'profile')),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  body text not null check (length(body) between 1 and 4000),
  kind text not null default 'colleague' check (kind in ('office', 'colleague')),
  audience text not null default 'all' check (audience in ('all', 'van', 'truck')),
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.announcements
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'van', 'truck'));

create table if not exists public.announcement_reactions (
  announcement_id bigint not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

create table if not exists public.announcement_comments (
  id bigint generated always as identity primary key,
  announcement_id bigint not null references public.announcements(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.private_log_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  place text not null,
  note text not null check (length(note) between 1 and 4000),
  category text not null default 'Andet',
  source text not null default 'manual' check (source in ('manual', 'auto')),
  kind text,
  status text not null default 'approved' check (status in ('draft', 'approved', 'deleted')),
  favorite boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

create table if not exists public.logbook_automation_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  smart_logbook boolean not null default true,
  auto_drafts boolean not null default true,
  auto_place boolean not null default true,
  auto_stops boolean not null default true,
  auto_pickup boolean not null default true,
  auto_vehicle boolean not null default true,
  auto_milestones boolean not null default false,
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_attachments_announcement_fk'
      and conrelid = 'public.media_attachments'::regclass
  ) then
    alter table public.media_attachments
      add constraint media_attachments_announcement_fk
      foreign key (announcement_id) references public.announcements(id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_attachments_log_entry_fk'
      and conrelid = 'public.media_attachments'::regclass
  ) then
    alter table public.media_attachments
      add constraint media_attachments_log_entry_fk
      foreign key (log_entry_id) references public.private_log_entries(id) on delete cascade;
  end if;
end $$;

create table if not exists public.regulatory_sources (
  id bigint generated always as identity primary key,
  title text not null,
  source_url text not null unique,
  audience text not null default 'all' check (audience in ('all', 'van', 'truck')),
  active boolean not null default true,
  last_checked_at timestamptz,
  last_content_hash text,
  created_at timestamptz not null default now()
);

alter table public.regulatory_sources
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'van', 'truck'));

create table if not exists public.regulatory_updates (
  id bigint generated always as identity primary key,
  source_id bigint not null references public.regulatory_sources(id) on delete cascade,
  title text not null,
  summary text not null,
  audience text not null default 'all' check (audience in ('all', 'van', 'truck')),
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected')),
  effective_date date,
  detected_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null
);

alter table public.regulatory_updates
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'van', 'truck'));

create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index if not exists media_attachments_owner_created_idx on public.media_attachments (owner_id, created_at desc);
create index if not exists media_attachments_message_idx on public.media_attachments (message_id);
create index if not exists private_log_entries_user_created_idx on public.private_log_entries (user_id, created_at desc);
create index if not exists private_log_entries_user_source_idx on public.private_log_entries (user_id, source, created_at desc);
create index if not exists location_shares_shared_at_idx on public.location_shares (shared_at desc);
create index if not exists workday_sessions_user_started_idx on public.workday_sessions (user_id, started_at desc);
create index if not exists pickup_tasks_status_started_idx on public.pickup_tasks (status, started_at desc);
create index if not exists vehicles_assigned_driver_idx on public.vehicles (assigned_driver_id);
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index if not exists announcements_created_at_idx on public.announcements (created_at desc);
create index if not exists announcement_comments_announcement_created_idx on public.announcement_comments (announcement_id, created_at);
create index if not exists regulatory_updates_status_detected_idx on public.regulatory_updates (status, detected_at desc);
create index if not exists profiles_access_role_idx on public.profiles (access_role);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists employee_invitations_status_created_idx on public.employee_invitations (status, created_at desc);

alter table public.profiles enable row level security;
alter table public.profile_private_details enable row level security;
alter table public.location_shares enable row level security;
alter table public.workday_sessions enable row level security;
alter table public.pickup_tasks enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.media_attachments enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_reactions enable row level security;
alter table public.announcement_comments enable row level security;
alter table public.private_log_entries enable row level security;
alter table public.logbook_automation_settings enable row level security;
alter table public.regulatory_sources enable row level security;
alter table public.regulatory_updates enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.employee_invitations enable row level security;
alter table public.core_settings enable row level security;
alter table public.legal_acceptances enable row level security;
alter table public.retention_policies enable row level security;
alter table public.data_subject_requests enable row level security;
alter table public.vehicles enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and access_role in ('admin', 'owner')
  );
$$;

create or replace function private.is_dispatcher_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and access_role in ('dispatcher', 'admin', 'owner')
  );
$$;

create or replace function public.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not private.is_admin() then
    new.department := old.department;
    new.license_summary := old.license_summary;
    new.role := old.role;
    new.access_role := old.access_role;
    new.vehicle_type := old.vehicle_type;
    new.truck := old.truck;
    new.employment_status := old.employment_status;
    new.logbook_enabled := old.logbook_enabled;
  end if;

  if old.department is distinct from new.department
    or old.license_summary is distinct from new.license_summary
    or old.role is distinct from new.role
    or old.access_role is distinct from new.access_role
    or old.vehicle_type is distinct from new.vehicle_type
    or old.truck is distinct from new.truck
    or old.employment_status is distinct from new.employment_status
    or old.logbook_enabled is distinct from new.logbook_enabled then
    insert into public.admin_audit_log (actor_id, target_user_id, action, details)
    values (
      auth.uid(),
      new.id,
      'profile_security_change',
      jsonb_build_object(
        'old_department', old.department,
        'new_department', new.department,
        'old_license_summary', old.license_summary,
        'new_license_summary', new.license_summary,
        'old_role', old.role,
        'new_role', new.role,
        'old_access_role', old.access_role,
        'new_access_role', new.access_role,
        'old_vehicle_type', old.vehicle_type,
        'new_vehicle_type', new.vehicle_type,
        'old_truck', old.truck,
        'new_truck', new.truck,
        'old_employment_status', old.employment_status,
        'new_employment_status', new.employment_status,
        'old_logbook_enabled', old.logbook_enabled,
        'new_logbook_enabled', new.logbook_enabled
      )
    );
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_security_fields on public.profiles;
create trigger protect_profile_security_fields
  before update on public.profiles
  for each row execute procedure public.protect_profile_security_fields();

create or replace function private.is_conversation_member(target_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = target_conversation and user_id = auth.uid()
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
      and (
        c.channel_type = 'all'
        or (c.channel_type = 'van' and (p.vehicle_type = 'van' or p.role ilike '%varebil%'))
        or (c.channel_type = 'truck' and (p.vehicle_type = 'truck' or p.role ilike '%lastbil%' or p.license_summary ilike '%C/E%'))
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
    select 1 from public.profiles
    where id = target_user_id and employment_status = 'active'
  ) then
    raise exception 'target_user_not_active';
  end if;

  select c.id into existing_conversation_id
  from public.conversations c
  join public.conversation_members me
    on me.conversation_id = c.id and me.user_id = auth.uid()
  join public.conversation_members them
    on them.conversation_id = c.id and them.user_id = target_user_id
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

drop policy if exists "employees can read profiles" on public.profiles;
drop policy if exists "employees can update own profile" on public.profiles;
drop policy if exists "admins can update employee profiles" on public.profiles;
drop policy if exists "admins can deactivate employee profiles" on public.profiles;
drop policy if exists "employees can read own private profile details" on public.profile_private_details;
drop policy if exists "employees can manage own private profile details" on public.profile_private_details;
drop policy if exists "admins can manage private profile details" on public.profile_private_details;
drop policy if exists "admins can read audit log" on public.admin_audit_log;
drop policy if exists "admins can create audit log" on public.admin_audit_log;
drop policy if exists "admins can manage employee invitations" on public.employee_invitations;
drop policy if exists "employees can read core settings" on public.core_settings;
drop policy if exists "admins can manage core settings" on public.core_settings;
drop policy if exists "employees can read own legal acceptances" on public.legal_acceptances;
drop policy if exists "employees can accept legal policies" on public.legal_acceptances;
drop policy if exists "employees can read retention policies" on public.retention_policies;
drop policy if exists "admins can manage retention policies" on public.retention_policies;
drop policy if exists "employees can read own data requests" on public.data_subject_requests;
drop policy if exists "employees can create own data requests" on public.data_subject_requests;
drop policy if exists "admins can handle data requests" on public.data_subject_requests;
drop policy if exists "employees can read vehicles" on public.vehicles;
drop policy if exists "admins can manage vehicles" on public.vehicles;
drop policy if exists "employees can read own notifications" on public.notifications;
drop policy if exists "employees can update own notifications" on public.notifications;
drop policy if exists "system roles can create notifications" on public.notifications;
drop policy if exists "employees can read own notification preferences" on public.notification_preferences;
drop policy if exists "employees can manage own notification preferences" on public.notification_preferences;
drop policy if exists "employees can read shared locations" on public.location_shares;
drop policy if exists "employees can share own location" on public.location_shares;
drop policy if exists "employees can update own location" on public.location_shares;
drop policy if exists "employees can stop sharing own location" on public.location_shares;
drop policy if exists "admins can delete expired pickup tasks" on public.pickup_tasks;
drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
drop policy if exists "employees can start own workday sessions" on public.workday_sessions;
drop policy if exists "employees can end own workday sessions" on public.workday_sessions;
drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
drop policy if exists "drivers can finish own pickup tasks" on public.pickup_tasks;
drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;
drop policy if exists "members can read conversations" on public.conversations;
drop policy if exists "members can read conversation membership" on public.conversation_members;
drop policy if exists "members can read messages" on public.messages;
drop policy if exists "members can send messages" on public.messages;
drop policy if exists "employees can read visible media" on public.media_attachments;
drop policy if exists "employees can add own media" on public.media_attachments;
drop policy if exists "employees can delete own media" on public.media_attachments;
drop policy if exists "employees can upload own media objects" on storage.objects;
drop policy if exists "employees can read own media objects" on storage.objects;
drop policy if exists "employees can read shared media objects" on storage.objects;
drop policy if exists "employees can delete own media objects" on storage.objects;
drop policy if exists "employees can read internal announcements" on public.announcements;
drop policy if exists "employees can create internal announcements" on public.announcements;
drop policy if exists "employees can read announcement reactions" on public.announcement_reactions;
drop policy if exists "employees can react to announcements" on public.announcement_reactions;
drop policy if exists "employees can remove own reactions" on public.announcement_reactions;
drop policy if exists "employees can read announcement comments" on public.announcement_comments;
drop policy if exists "employees can comment on announcements" on public.announcement_comments;
drop policy if exists "employees can read own private log" on public.private_log_entries;
drop policy if exists "employees can add to own private log" on public.private_log_entries;
drop policy if exists "employees can update own private log" on public.private_log_entries;
drop policy if exists "employees can delete from own private log" on public.private_log_entries;
drop policy if exists "employees can read own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can create own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can update own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can delete own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can read monitored sources" on public.regulatory_sources;
drop policy if exists "employees can read approved regulatory updates" on public.regulatory_updates;

create policy "employees can read profiles"
on public.profiles for select to authenticated using (true);
create policy "employees can update own profile"
on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins can update employee profiles"
on public.profiles for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own private profile details"
on public.profile_private_details for select to authenticated using (
  user_id = auth.uid() or private.is_dispatcher_or_admin()
);
create policy "employees can manage own private profile details"
on public.profile_private_details for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins can manage private profile details"
on public.profile_private_details for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins can read audit log"
on public.admin_audit_log for select to authenticated using (private.is_admin());
create policy "admins can create audit log"
on public.admin_audit_log for insert to authenticated with check (actor_id = auth.uid() and private.is_admin());
create policy "admins can manage employee invitations"
on public.employee_invitations for all to authenticated using (private.is_admin()) with check (created_by = auth.uid() and private.is_admin());
create policy "employees can read core settings"
on public.core_settings for select to authenticated using (true);
create policy "admins can manage core settings"
on public.core_settings for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own legal acceptances"
on public.legal_acceptances for select to authenticated using (user_id = auth.uid() or private.is_admin());
create policy "employees can accept legal policies"
on public.legal_acceptances for insert to authenticated with check (user_id = auth.uid());
create policy "employees can read retention policies"
on public.retention_policies for select to authenticated using (true);
create policy "admins can manage retention policies"
on public.retention_policies for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own data requests"
on public.data_subject_requests for select to authenticated using (user_id = auth.uid() or private.is_admin());
create policy "employees can create own data requests"
on public.data_subject_requests for insert to authenticated with check (user_id = auth.uid());
create policy "admins can handle data requests"
on public.data_subject_requests for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read vehicles"
on public.vehicles for select to authenticated using (true);
create policy "admins can manage vehicles"
on public.vehicles for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own notifications"
on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "employees can update own notifications"
on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "system roles can create notifications"
on public.notifications for insert to authenticated with check (user_id = auth.uid() or private.is_dispatcher_or_admin());

create policy "employees can read own notification preferences"
on public.notification_preferences for select to authenticated using (user_id = auth.uid());
create policy "employees can manage own notification preferences"
on public.notification_preferences for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.purge_expired_operational_data()
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  deleted_locations integer := 0;
  deleted_pickups integer := 0;
begin
  if not private.is_admin() then
    raise exception 'not_allowed';
  end if;

  delete from public.location_shares
  where (expires_at is not null and expires_at < now())
     or last_updated_at < now() - interval '1 day';
  get diagnostics deleted_locations = row_count;

  delete from public.pickup_tasks
  where expires_at is not null
    and expires_at < now()
    and status in ('delivered', 'cancelled');
  get diagnostics deleted_pickups = row_count;

  return jsonb_build_object(
    'deleted_locations', deleted_locations,
    'deleted_pickups', deleted_pickups,
    'ran_at', now()
  );
end;
$$;

create policy "employees can read shared locations"
on public.location_shares for select to authenticated using (
  user_id = auth.uid()
  or (visibility = 'pickup' and visible_to_user_id = auth.uid())
  or (
    visibility = 'team'
    and audience = 'all'
  )
  or (
    visibility = 'team'
    and audience = 'truck'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.vehicle_type = 'truck' or p.role ilike '%lastbil%' or p.license_summary ilike '%C/E%')
    )
  )
  or (
    visibility = 'team'
    and audience = 'van'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.vehicle_type = 'van' or p.role ilike '%varebil%')
    )
  )
);
create policy "employees can share own location"
on public.location_shares for insert to authenticated with check (user_id = auth.uid());
create policy "employees can update own location"
on public.location_shares for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "employees can stop sharing own location"
on public.location_shares for delete to authenticated using (user_id = auth.uid() or private.is_admin());

create policy "employees can read own workday sessions"
on public.workday_sessions for select to authenticated using (user_id = auth.uid() or private.is_dispatcher_or_admin());
create policy "employees can start own workday sessions"
on public.workday_sessions for insert to authenticated with check (user_id = auth.uid());
create policy "employees can end own workday sessions"
on public.workday_sessions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "admins can deactivate employee profiles"
on public.profiles for update to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated using (driver_id = auth.uid() or colleague_id = auth.uid());
create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated with check (driver_id = auth.uid() and driver_id <> colleague_id);
create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (driver_id = auth.uid() or colleague_id = auth.uid())
with check (driver_id = auth.uid() or colleague_id = auth.uid());
create policy "admins can delete expired pickup tasks"
on public.pickup_tasks for delete to authenticated
using (private.is_admin() and expires_at is not null and expires_at < now());

create policy "members can read conversations"
on public.conversations for select to authenticated using (private.can_read_conversation(id));
create policy "members can read conversation membership"
on public.conversation_members for select to authenticated using (private.is_conversation_member(conversation_id));
create policy "members can read messages"
on public.messages for select to authenticated using (private.can_read_conversation(conversation_id));
create policy "members can send messages"
on public.messages for insert to authenticated with check (
  sender_id = auth.uid() and private.can_read_conversation(conversation_id)
);

create policy "employees can read visible media"
on public.media_attachments for select to authenticated using (
  owner_id = auth.uid()
  or (
    message_id is not null
    and exists (
      select 1 from public.messages
      where messages.id = media_attachments.message_id
        and private.can_read_conversation(messages.conversation_id)
    )
  )
  or (
    announcement_id is not null
    and exists (select 1 from public.announcements where id = media_attachments.announcement_id)
  )
);
create policy "employees can add own media"
on public.media_attachments for insert to authenticated with check (owner_id = auth.uid());
create policy "employees can delete own media"
on public.media_attachments for delete to authenticated using (owner_id = auth.uid());

create policy "employees can upload own media objects"
on storage.objects for insert to authenticated with check (
  bucket_id = 'xpressintra-media'
  and split_part(name, '/', 1) = auth.uid()::text
);
create policy "employees can read own media objects"
on storage.objects for select to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
);
create policy "employees can read shared media objects"
on storage.objects for select to authenticated using (
  bucket_id = 'xpressintra-media'
  and exists (
    select 1 from public.media_attachments
    where media_attachments.bucket = storage.objects.bucket_id
      and media_attachments.storage_path = storage.objects.name
      and (
        media_attachments.owner_id = auth.uid()
        or media_attachments.visibility = 'announcement'
        or (
          media_attachments.message_id is not null
          and exists (
            select 1 from public.messages
            where messages.id = media_attachments.message_id
              and private.can_read_conversation(messages.conversation_id)
          )
        )
      )
  )
);
create policy "employees can delete own media objects"
on storage.objects for delete to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
);

create policy "employees can read internal announcements"
on public.announcements for select to authenticated using (
  audience = 'all'
  or exists (
    select 1 from public.profiles
    where id = auth.uid() and vehicle_type = announcements.audience
  )
);
create policy "employees can create internal announcements"
on public.announcements for insert to authenticated with check (
  author_id = auth.uid()
  and (
    kind = 'colleague'
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and access_role in ('dispatcher', 'admin', 'owner')
    )
  )
);

create policy "employees can read announcement reactions"
on public.announcement_reactions for select to authenticated using (
  exists (select 1 from public.announcements where id = announcement_id)
);
create policy "employees can react to announcements"
on public.announcement_reactions for insert to authenticated with check (
  user_id = auth.uid()
  and exists (select 1 from public.announcements where id = announcement_id)
);
create policy "employees can remove own reactions"
on public.announcement_reactions for delete to authenticated using (user_id = auth.uid());
create policy "employees can read announcement comments"
on public.announcement_comments for select to authenticated using (
  exists (select 1 from public.announcements where id = announcement_id)
);
create policy "employees can comment on announcements"
on public.announcement_comments for insert to authenticated with check (
  author_id = auth.uid()
  and exists (select 1 from public.announcements where id = announcement_id)
);

create policy "employees can read own private log"
on public.private_log_entries for select to authenticated using (user_id = auth.uid());
create policy "employees can add to own private log"
on public.private_log_entries for insert to authenticated with check (user_id = auth.uid());
create policy "employees can update own private log"
on public.private_log_entries for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "employees can delete from own private log"
on public.private_log_entries for delete to authenticated using (user_id = auth.uid());

create policy "employees can read own logbook automation settings"
on public.logbook_automation_settings for select to authenticated using (user_id = auth.uid());
create policy "employees can create own logbook automation settings"
on public.logbook_automation_settings for insert to authenticated with check (user_id = auth.uid());
create policy "employees can update own logbook automation settings"
on public.logbook_automation_settings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "employees can delete own logbook automation settings"
on public.logbook_automation_settings for delete to authenticated using (user_id = auth.uid());

create policy "employees can read monitored sources"
on public.regulatory_sources for select to authenticated using (active = true);
create policy "employees can read approved regulatory updates"
on public.regulatory_updates for select to authenticated using (status = 'approved');

-- Supabase Data API access.
-- RLS above is the final row-level lock; these grants only make the tables reachable
-- for signed-in users after Supabase's 2026 Data API default-privilege change.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to authenticated;
revoke execute on all functions in schema private from public, anon;
grant execute on all functions in schema private to authenticated, service_role;
grant execute on function public.start_direct_conversation(uuid) to authenticated;
grant execute on function public.purge_expired_operational_data() to authenticated;

insert into public.regulatory_sources (title, source_url, audience)
values
  ('Færdselsstyrelsen · varebil', 'https://www.fstyr.dk/erhverv/varebil', 'van'),
  ('Færdselsstyrelsen · køre- og hviletid', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid', 'truck'),
  ('Færdselsstyrelsen · arbejdstidsregler', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/arbejdstidsregler', 'all'),
  ('Færdselsstyrelsen · virksomhedskontrol', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/virksomhedskontrol', 'truck'),
  ('Færdselsstyrelsen · takograf', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/takograf', 'all'),
  ('Vejafgifter.dk', 'https://vejafgifter.dk/', 'truck'),
  ('Miljøzoner.dk · varebiler', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-varebiler/', 'van'),
  ('Miljøzoner.dk · lastbiler', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-lastbiler-busser/', 'truck'),
  ('European Labour Authority · varebil', 'https://www.ela.europa.eu/en/light-commercial-vehicles', 'van'),
  ('European Labour Authority · vejtransport', 'https://www.ela.europa.eu/en/campaign/road-fair-transport', 'all')
on conflict (source_url) do update
set title = excluded.title, audience = excluded.audience, active = true;

insert into public.core_settings (key, enabled, description)
values
  ('gps', true, 'Frivillig live-position'),
  ('media', true, 'Billeder i chat, opslag, profil og logbog'),
  ('logbook', true, 'Personlig privat logbog'),
  ('employee_posts', true, 'Kollegaopslag på forsiden'),
  ('rule_approval', true, 'Regelnyt kræver godkendelse før publicering')
on conflict (key) do update
set enabled = excluded.enabled, description = excluded.description;

insert into public.retention_policies (key, label, retention_days, description, auto_delete)
values
  ('live_gps', 'Live GPS', 1, 'Seneste position overskrives løbende; historik bør undgås i MVP', true),
  ('pickup_location', 'Afhentningsdeling', 1, 'Midlertidig GPS-deling afsluttes ved udløb eller færdigmelding', true),
  ('chat_messages', 'Chatbeskeder', 730, 'Intern chat bør have en aftalt slette- eller arkivfrist', false),
  ('media', 'Billeder', 365, 'Billeder gemmes efter dokumentationsformål og slettes når formålet ophører', false),
  ('audit_log', 'Audit-log', 730, 'Administrative ændringer gemmes af hensyn til sikkerhed og ansvarlighed', false)
on conflict (key) do update
set label = excluded.label, retention_days = excluded.retention_days, description = excluded.description, auto_delete = excluded.auto_delete;

insert into public.conversations (id, title, channel_type, is_group)
values
  ('00000000-0000-4000-8000-000000000001', 'Fælleschat · Alle medarbejdere', 'all', true),
  ('00000000-0000-4000-8000-000000000002', 'Lastbilchat', 'truck', true),
  ('00000000-0000-4000-8000-000000000003', 'Varebilchat', 'van', true)
on conflict (id) do update
set title = excluded.title, channel_type = excluded.channel_type, is_group = excluded.is_group;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invite public.employee_invitations%rowtype;
begin
  select *
  into invite
  from public.employee_invitations
  where lower(email) = lower(new.email)
    and status = 'pending'
  order by created_at desc
  limit 1;

  if invite.id is null and exists (select 1 from public.profiles) then
    raise exception 'Din arbejdsmail er ikke oprettet i XpressIntra endnu. Kontakt chef eller creator.';
  end if;

  insert into public.profiles (
    id,
    full_name,
    phone,
    email,
    department,
    license_summary,
    languages,
    role,
    access_role,
    vehicle_type,
    truck,
    employment_status,
    logbook_enabled,
    password_reset_required
  )
  values (
    new.id,
    coalesce(invite.full_name, new.raw_user_meta_data ->> 'full_name', new.email),
    invite.phone,
    new.email,
    invite.department,
    invite.license_summary,
    invite.languages,
    coalesce(invite.role, 'Chauffør'),
    coalesce(invite.access_role, 'employee'),
    coalesce(invite.vehicle_type, 'van'),
    invite.truck,
    'active',
    coalesce(invite.logbook_enabled, false),
    case
      when coalesce((new.raw_user_meta_data ->> 'first_personal_password')::boolean, false) then false
      else coalesce(invite.password_reset_required, false)
    end
  )
  on conflict (id) do nothing;

  if invite.id is not null then
    insert into public.profile_private_details (user_id, emergency_contact)
    values (new.id, invite.emergency_contact)
    on conflict (user_id) do update
    set emergency_contact = excluded.emergency_contact;

    update public.employee_invitations
    set status = 'accepted'
    where id = invite.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.location_shares'::regclass
    ) then
      alter publication supabase_realtime add table public.location_shares;
    end if;

    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.pickup_tasks'::regclass
    ) then
      alter publication supabase_realtime add table public.pickup_tasks;
    end if;

    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.messages'::regclass
    ) then
      alter publication supabase_realtime add table public.messages;
    end if;

    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.announcements'::regclass
    ) then
      alter publication supabase_realtime add table public.announcements;
    end if;

    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.announcement_comments'::regclass
    ) then
      alter publication supabase_realtime add table public.announcement_comments;
    end if;

    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.announcement_reactions'::regclass
    ) then
      alter publication supabase_realtime add table public.announcement_reactions;
    end if;

    if not exists (
      select 1 from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime' and pr.prrelid = 'public.notifications'::regclass
    ) then
      alter publication supabase_realtime add table public.notifications;
    end if;
  end if;
end $$;


-- ============================================================
-- first-admin.sql
-- ============================================================

-- XpressIntra first admin bootstrap.
-- 1. Create/log in with the user in Supabase Auth first.
-- 2. Replace the email below with the real chef/admin email.
-- 3. Run this in the Supabase SQL editor.

do $$
declare
  admin_email text := 'stralner2711@gmail.com';
  admin_user_id uuid;
begin
  select id into admin_user_id
  from auth.users
  where lower(email) = lower(admin_email)
  limit 1;

  if admin_user_id is null then
    raise exception 'No Supabase Auth user found for email: %', admin_email;
  end if;

  insert into public.profiles (id, full_name, email)
  select
    admin_user_id,
    coalesce(raw_user_meta_data ->> 'full_name', email),
    email
  from auth.users
  where id = admin_user_id
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = now();

  update public.profiles
  set
    role = 'Appansvarlig · Lastbilchauffør',
    access_role = 'owner',
    vehicle_type = 'truck',
    department = case when department is null or department = '' or department = 'Ledelse' or department = 'Creator' then 'Lastbil' else department end,
    truck = case when truck is null or truck = '' or truck = 'Ledelse' or truck = 'Creator' or truck = 'Kontoret' then 'TR 42 918' else truck end,
    license_summary = case when license_summary is null or license_summary = '' or license_summary = 'Kontor' or license_summary = 'Administrator' then 'C/E · EU kvalifikationsbevis' else license_summary end,
    employment_status = 'active',
    updated_at = now()
  where id = admin_user_id;

  insert into public.admin_audit_log (actor_id, target_user_id, action, details)
  values (
    admin_user_id,
    admin_user_id,
    'first_admin_bootstrap',
    jsonb_build_object(
      'title', 'Forste creator oprettet',
      'body', 'Brugeren blev gjort til creator/owner via supabase/first-admin.sql',
      'email', admin_email
    )
  );
end $$;



-- ============================================================
-- Schema cache refresh
-- ============================================================

-- Sikrer at Supabase Data API opdager nye tabeller som public.location_shares.
notify pgrst, 'reload schema';
select pg_notification_queue_usage();
