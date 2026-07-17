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
  onboarding_method text not null default 'invite_link' check (onboarding_method in ('invite_link', 'access_request', 'standard_password', 'manual')),
  password_reset_required boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  used_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists password_reset_required boolean not null default false;

alter table public.employee_invitations
  alter column role set default 'Chauffør',
  add column if not exists onboarding_method text not null default 'invite_link' check (onboarding_method in ('invite_link', 'access_request', 'standard_password', 'manual')),
  add column if not exists password_reset_required boolean not null default true,
  add column if not exists expires_at timestamptz not null default (now() + interval '14 days'),
  add column if not exists accepted_at timestamptz,
  add column if not exists used_by uuid references public.profiles(id) on delete set null;

alter table public.employee_invitations
  alter column onboarding_method set default 'invite_link';
alter table public.employee_invitations
  drop constraint if exists employee_invitations_onboarding_method_check;
alter table public.employee_invitations
  add constraint employee_invitations_onboarding_method_check
  check (onboarding_method in ('invite_link', 'access_request', 'standard_password', 'manual'));

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

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('bug', 'idea', 'design', 'content')),
  area text not null,
  message text not null check (length(message) between 1 and 4000),
  app_version text,
  route text,
  status text not null default 'open' check (status in ('open', 'in_review', 'completed', 'rejected')),
  handled_by uuid references public.profiles(id) on delete set null,
  handled_note text,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists support_requests_created_at_idx on public.support_requests (created_at desc);
create index if not exists support_requests_status_idx on public.support_requests (status, created_at desc);

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
  work_gps boolean not null default true,
  work_logbook boolean not null default true,
  work_notifications boolean not null default true,
  location_audience text not null default 'all' check (location_audience in ('all', 'truck', 'van', 'none')),
  show_speed boolean not null default false,
  show_vehicle boolean not null default true,
  show_status boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences
  add column if not exists work_gps boolean not null default true,
  add column if not exists work_logbook boolean not null default true,
  add column if not exists work_notifications boolean not null default true,
  add column if not exists location_audience text not null default 'all',
  add column if not exists show_speed boolean not null default false,
  add column if not exists show_vehicle boolean not null default true,
  add column if not exists show_status boolean not null default true;

do $$ begin
  alter table public.notification_preferences
    add constraint notification_preferences_location_audience_check
    check (location_audience in ('all', 'truck', 'van', 'none'));
exception when duplicate_object then null;
end $$;

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
  check (visibility = 'team' or visible_to_user_id is not null)
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
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table public.announcements
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'van', 'truck'));

alter table public.announcements
  add column if not exists updated_at timestamptz;

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
  topic text not null default 'transport' check (topic in ('transport', 'gdpr', 'terms', 'privacy', 'technology', 'operations')),
  active boolean not null default true,
  last_checked_at timestamptz,
  last_content_hash text,
  created_at timestamptz not null default now()
);

alter table public.regulatory_sources
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'van', 'truck'));

alter table public.regulatory_sources
  add column if not exists topic text not null default 'transport'
  check (topic in ('transport', 'gdpr', 'terms', 'privacy', 'technology', 'operations'));

create table if not exists public.regulatory_updates (
  id bigint generated always as identity primary key,
  source_id bigint not null references public.regulatory_sources(id) on delete cascade,
  title text not null,
  summary text not null,
  audience text not null default 'all' check (audience in ('all', 'van', 'truck')),
  topic text not null default 'transport' check (topic in ('transport', 'gdpr', 'terms', 'privacy', 'technology', 'operations')),
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected')),
  effective_date date,
  content_hash text,
  detected_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null
);

alter table public.regulatory_updates
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'van', 'truck'));

alter table public.regulatory_updates
  add column if not exists topic text not null default 'transport'
  check (topic in ('transport', 'gdpr', 'terms', 'privacy', 'technology', 'operations'));

alter table public.regulatory_updates
  add column if not exists content_hash text;

alter table public.regulatory_updates
  add column if not exists source_id bigint;

alter table public.regulatory_updates
  add column if not exists effective_date date;

insert into public.regulatory_sources (title, source_url, audience, topic)
values ('Færdselsstyrelsen · transportregler', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil', 'all', 'transport')
on conflict (source_url) do nothing;

update public.regulatory_updates
set source_id = (
  select id from public.regulatory_sources
  where source_url = 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil'
)
where source_id is null;

alter table public.regulatory_updates
  alter column source_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.regulatory_updates'::regclass
      and contype = 'f'
      and conname = 'regulatory_updates_source_id_fkey'
  ) then
    alter table public.regulatory_updates
      add constraint regulatory_updates_source_id_fkey
      foreign key (source_id) references public.regulatory_sources(id) on delete cascade;
  end if;
end $$;

create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index if not exists media_attachments_owner_created_idx on public.media_attachments (owner_id, created_at desc);
create index if not exists media_attachments_message_idx on public.media_attachments (message_id);
create index if not exists media_attachments_announcement_idx on public.media_attachments (announcement_id);
create index if not exists private_log_entries_user_created_idx on public.private_log_entries (user_id, created_at desc);
create index if not exists private_log_entries_user_source_idx on public.private_log_entries (user_id, source, created_at desc);
create index if not exists location_shares_last_updated_at_idx on public.location_shares (last_updated_at desc);
create index if not exists workday_sessions_user_started_idx on public.workday_sessions (user_id, started_at desc);
create index if not exists pickup_tasks_status_started_idx on public.pickup_tasks (status, started_at desc);
create index if not exists vehicles_assigned_driver_idx on public.vehicles (assigned_driver_id);
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index if not exists announcements_created_at_idx on public.announcements (created_at desc);
create index if not exists announcement_comments_announcement_created_idx on public.announcement_comments (announcement_id, created_at);
create index if not exists regulatory_updates_status_detected_idx on public.regulatory_updates (status, detected_at desc);
create unique index if not exists regulatory_updates_source_hash_idx on public.regulatory_updates (source_id, content_hash) where content_hash is not null;
create index if not exists profiles_access_role_idx on public.profiles (access_role);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists employee_invitations_status_created_idx on public.employee_invitations (status, created_at desc);
create unique index if not exists employee_invitations_one_pending_email_idx on public.employee_invitations (lower(email)) where status = 'pending';
create index if not exists employee_invitations_used_by_idx on public.employee_invitations (used_by);
create index if not exists support_requests_user_id_idx on public.support_requests (user_id);
create index if not exists support_requests_handled_by_idx on public.support_requests (handled_by);

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
alter table public.support_requests enable row level security;
alter table public.vehicles enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;

drop function if exists public.can_access_conversation(uuid) cascade;
drop function if exists public.can_read_conversation(uuid) cascade;
drop function if exists public.is_conversation_member(uuid) cascade;
drop function if exists public.is_dispatcher_or_admin() cascade;
drop function if exists public.is_admin() cascade;

create or replace function private.is_active_employee()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and employment_status = 'active'
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and access_role in ('admin', 'owner')
      and employment_status = 'active'
  );
$$;

create or replace function private.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and access_role = 'owner'
      and employment_status = 'active'
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
    where id = auth.uid()
      and access_role in ('dispatcher', 'admin', 'owner')
      and employment_status = 'active'
  );
$$;

drop function if exists public.protect_profile_security_fields() cascade;

create or replace function private.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  protected_change boolean;
  owner_sensitive_change boolean;
begin
  if auth.uid() is null then
    new.updated_at := now();
    return new;
  end if;

  protected_change :=
    old.email is distinct from new.email
    or old.department is distinct from new.department
    or old.license_summary is distinct from new.license_summary
    or old.role is distinct from new.role
    or old.access_role is distinct from new.access_role
    or old.vehicle_type is distinct from new.vehicle_type
    or old.truck is distinct from new.truck
    or old.employment_status is distinct from new.employment_status;

  owner_sensitive_change :=
    old.access_role = 'owner'
    or new.access_role = 'owner';

  if owner_sensitive_change and protected_change and not private.is_owner() then
    insert into public.admin_audit_log (actor_id, target_user_id, action, details)
    values (
      auth.uid(),
      old.id,
      'owner_security_change_blocked',
      jsonb_build_object(
        'old_access_role', old.access_role,
        'requested_access_role', new.access_role,
        'old_employment_status', old.employment_status,
        'requested_employment_status', new.employment_status
      )
    );
    raise exception 'owner_role_change_requires_owner';
  end if;

  if old.access_role = 'owner'
    and old.employment_status = 'active'
    and (new.access_role <> 'owner' or new.employment_status <> 'active')
    and not exists (
      select 1 from public.profiles p
      where p.id <> old.id
        and p.access_role = 'owner'
        and p.employment_status = 'active'
    ) then
    raise exception 'last_active_owner_required';
  end if;

  if auth.uid() = old.id and not private.is_admin() then
    if protected_change then
      insert into public.admin_audit_log (actor_id, target_user_id, action, details)
      values (
        auth.uid(),
        old.id,
        'profile_security_change_blocked',
        jsonb_build_object(
          'requested_access_role', new.access_role,
          'requested_role', new.role,
          'requested_employment_status', new.employment_status,
          'requested_vehicle_type', new.vehicle_type,
          'requested_department', new.department
        )
      );
    end if;
    new.email := old.email;
    new.department := old.department;
    new.license_summary := old.license_summary;
    new.role := old.role;
    new.access_role := old.access_role;
    new.vehicle_type := old.vehicle_type;
    new.truck := old.truck;
    new.employment_status := old.employment_status;
  elsif auth.uid() <> old.id and not private.is_admin() then
    raise exception 'profile_update_not_allowed';
  elsif private.is_admin() and protected_change then
    insert into public.admin_audit_log (actor_id, target_user_id, action, details)
    values (
      auth.uid(),
      new.id,
      'profile_security_change',
      jsonb_build_object(
        'old_access_role', old.access_role,
        'new_access_role', new.access_role,
        'old_role', old.role,
        'new_role', new.role,
        'old_department', old.department,
        'new_department', new.department,
        'old_license_summary', old.license_summary,
        'new_license_summary', new.license_summary,
        'old_truck', old.truck,
        'new_truck', new.truck,
        'old_employment_status', old.employment_status,
        'new_employment_status', new.employment_status,
        'old_vehicle_type', old.vehicle_type,
        'new_vehicle_type', new.vehicle_type
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
  for each row execute procedure private.protect_profile_security_fields();

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
      and coalesce(p.employment_status, 'active') = 'active'
      and (
        c.channel_type = 'all'
        or (c.channel_type = 'van' and p.vehicle_type = 'van')
        or (c.channel_type = 'truck' and p.vehicle_type = 'truck')
        or (c.channel_type = 'direct' and private.is_conversation_member(c.id))
      )
  );
$$;

create or replace function private.can_access_conversation(target_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select private.can_read_conversation(target_conversation);
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

  if not private.is_active_employee() then
    raise exception 'caller_not_active';
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

create or replace function public.start_direct_conversation_v2(target_user_id uuid)
returns uuid
language sql
security definer
set search_path = public
as $$
  select public.start_direct_conversation(target_user_id);
$$;

drop trigger if exists prevent_profile_privilege_escalation_trigger on public.profiles;
drop function if exists public.prevent_profile_privilege_escalation();

drop policy if exists "employees can read profiles" on public.profiles;
drop policy if exists "employees can update own profile" on public.profiles;
drop policy if exists "profiles update own safe fields" on public.profiles;
drop policy if exists "admins can update employee profiles" on public.profiles;
drop policy if exists "admins can deactivate employee profiles" on public.profiles;
drop policy if exists "employees can read own private profile details" on public.profile_private_details;
drop policy if exists "employees can manage own private profile details" on public.profile_private_details;
drop policy if exists "admins can manage private profile details" on public.profile_private_details;
drop policy if exists "private details own read" on public.profile_private_details;
drop policy if exists "private details own manage" on public.profile_private_details;
drop policy if exists "private details admin manage" on public.profile_private_details;
drop policy if exists "admins can read audit log" on public.admin_audit_log;
drop policy if exists "admins can create audit log" on public.admin_audit_log;
drop policy if exists "admins can manage employee invitations" on public.employee_invitations;
drop policy if exists "admins can read employee invitations" on public.employee_invitations;
drop policy if exists "admins can create employee invitations" on public.employee_invitations;
drop policy if exists "admins can update employee invitations" on public.employee_invitations;
drop policy if exists "admins can delete employee invitations" on public.employee_invitations;
drop policy if exists "employees can read core settings" on public.core_settings;
drop policy if exists "admins can manage core settings" on public.core_settings;
drop policy if exists "employees can read own legal acceptances" on public.legal_acceptances;
drop policy if exists "employees can accept legal policies" on public.legal_acceptances;
drop policy if exists "legal own" on public.legal_acceptances;
drop policy if exists "employees can read retention policies" on public.retention_policies;
drop policy if exists "admins can manage retention policies" on public.retention_policies;
drop policy if exists "employees can read own data requests" on public.data_subject_requests;
drop policy if exists "employees can create own data requests" on public.data_subject_requests;
drop policy if exists "admins can handle data requests" on public.data_subject_requests;
drop policy if exists "dsr own read" on public.data_subject_requests;
drop policy if exists "dsr own insert" on public.data_subject_requests;
drop policy if exists "dsr admin" on public.data_subject_requests;
drop policy if exists "support own read" on public.support_requests;
drop policy if exists "support own insert" on public.support_requests;
drop policy if exists "support admin update" on public.support_requests;
drop policy if exists "support admin delete" on public.support_requests;
drop policy if exists "employees can read vehicles" on public.vehicles;
drop policy if exists "admins can manage vehicles" on public.vehicles;
drop policy if exists "employees can read own notifications" on public.notifications;
drop policy if exists "employees can update own notifications" on public.notifications;
drop policy if exists "system roles can create notifications" on public.notifications;
drop policy if exists "notifications own" on public.notifications;
drop policy if exists "employees can read own notification preferences" on public.notification_preferences;
drop policy if exists "employees can manage own notification preferences" on public.notification_preferences;
drop policy if exists "notification prefs own" on public.notification_preferences;
drop policy if exists "employees can read shared locations" on public.location_shares;
drop policy if exists "employees can share own location" on public.location_shares;
drop policy if exists "employees can update own location" on public.location_shares;
drop policy if exists "employees can stop sharing own location" on public.location_shares;
drop policy if exists "admins can delete expired pickup tasks" on public.pickup_tasks;
drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
drop policy if exists "employees can start own workday sessions" on public.workday_sessions;
drop policy if exists "employees can end own workday sessions" on public.workday_sessions;
drop policy if exists "workday own select" on public.workday_sessions;
drop policy if exists "workday own insert" on public.workday_sessions;
drop policy if exists "workday own update" on public.workday_sessions;
drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
drop policy if exists "drivers can finish own pickup tasks" on public.pickup_tasks;
drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;
drop policy if exists "pickup create own" on public.pickup_tasks;
drop policy if exists "pickup participants read" on public.pickup_tasks;
drop policy if exists "pickup participants update" on public.pickup_tasks;
drop policy if exists "members can read conversations" on public.conversations;
drop policy if exists "members can read conversation membership" on public.conversation_members;
drop policy if exists "members can read messages" on public.messages;
drop policy if exists "members can send messages" on public.messages;
drop policy if exists "employees can read visible media" on public.media_attachments;
drop policy if exists "employees can add own media" on public.media_attachments;
drop policy if exists "employees can delete own media" on public.media_attachments;
drop policy if exists "media read own related" on public.media_attachments;
drop policy if exists "media insert own" on public.media_attachments;
drop policy if exists "media delete own" on public.media_attachments;
drop policy if exists "xpressintra media read own or admin" on storage.objects;
drop policy if exists "xpressintra media delete own or admin" on storage.objects;
drop policy if exists "xpressintra media update own" on storage.objects;
drop policy if exists "xpressintra media upload own" on storage.objects;
drop policy if exists "employees can upload own media objects" on storage.objects;
drop policy if exists "employees can read own media objects" on storage.objects;
drop policy if exists "employees can read shared media objects" on storage.objects;
drop policy if exists "employees can delete own media objects" on storage.objects;
drop policy if exists "employees can read internal announcements" on public.announcements;
drop policy if exists "employees can create internal announcements" on public.announcements;
drop policy if exists "authors and admins can update announcements" on public.announcements;
drop policy if exists "authors and admins can delete announcements" on public.announcements;
drop policy if exists "employees can read announcement reactions" on public.announcement_reactions;
drop policy if exists "announcement reactions read active" on public.announcement_reactions;
drop policy if exists "employees can react to announcements" on public.announcement_reactions;
drop policy if exists "employees can remove own reactions" on public.announcement_reactions;
drop policy if exists "employees can read announcement comments" on public.announcement_comments;
drop policy if exists "announcement comments read active" on public.announcement_comments;
drop policy if exists "employees can comment on announcements" on public.announcement_comments;
drop policy if exists "employees can read own private log" on public.private_log_entries;
drop policy if exists "employees can add to own private log" on public.private_log_entries;
drop policy if exists "employees can update own private log" on public.private_log_entries;
drop policy if exists "employees can delete from own private log" on public.private_log_entries;
drop policy if exists "private log own" on public.private_log_entries;
drop policy if exists "employees can read own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can create own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can update own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can delete own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "logbook settings own" on public.logbook_automation_settings;
drop policy if exists "employees can read monitored sources" on public.regulatory_sources;
drop policy if exists "employees can read approved regulatory updates" on public.regulatory_updates;
drop policy if exists "regulatory approved read" on public.regulatory_updates;

create policy "employees can read profiles"
on public.profiles for select to authenticated using (
  id = auth.uid()
  or private.is_admin()
  or (private.is_active_employee() and employment_status = 'active')
);
create policy "employees can update own profile"
on public.profiles for update to authenticated
using (id = auth.uid() and private.is_active_employee())
with check (id = auth.uid() and private.is_active_employee());
create policy "admins can update employee profiles"
on public.profiles for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own private profile details"
on public.profile_private_details for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can manage own private profile details"
on public.profile_private_details for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "admins can manage private profile details"
on public.profile_private_details for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins can read audit log"
on public.admin_audit_log for select to authenticated using (private.is_admin());
create policy "admins can create audit log"
on public.admin_audit_log for insert to authenticated with check (actor_id = auth.uid() and private.is_admin());
create policy "admins can read employee invitations"
on public.employee_invitations for select to authenticated using (private.is_admin());
create policy "admins can create employee invitations"
on public.employee_invitations for insert to authenticated with check (
  created_by = auth.uid()
  and private.is_admin()
  and (access_role <> 'owner' or private.is_owner())
);
create policy "admins can update employee invitations"
on public.employee_invitations for update to authenticated
using (private.is_admin() and (access_role <> 'owner' or private.is_owner()))
with check (private.is_admin() and (access_role <> 'owner' or private.is_owner()));
create policy "admins can delete employee invitations"
on public.employee_invitations for delete to authenticated
using (private.is_admin() and (access_role <> 'owner' or private.is_owner()));
create policy "employees can read core settings"
on public.core_settings for select to authenticated using (private.is_active_employee());
create policy "admins can manage core settings"
on public.core_settings for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own legal acceptances"
on public.legal_acceptances for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can accept legal policies"
on public.legal_acceptances for insert to authenticated with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can read retention policies"
on public.retention_policies for select to authenticated using (private.is_active_employee());
create policy "admins can manage retention policies"
on public.retention_policies for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own data requests"
on public.data_subject_requests for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can create own data requests"
on public.data_subject_requests for insert to authenticated with check (user_id = auth.uid() and private.is_active_employee());
create policy "admins can handle data requests"
on public.data_subject_requests for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "support own read"
on public.support_requests for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "support own insert"
on public.support_requests for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "support admin update"
on public.support_requests for update to authenticated
using (private.is_admin()) with check (private.is_admin());
create policy "support admin delete"
on public.support_requests for delete to authenticated using (private.is_admin());
create policy "employees can read vehicles"
on public.vehicles for select to authenticated using (private.is_active_employee());
create policy "admins can manage vehicles"
on public.vehicles for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "employees can read own notifications"
on public.notifications for select to authenticated using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own notifications"
on public.notifications for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "system roles can create notifications"
on public.notifications for insert to authenticated with check (
  private.is_active_employee() and (user_id = auth.uid() or private.is_dispatcher_or_admin())
);

create policy "employees can read own notification preferences"
on public.notification_preferences for select to authenticated using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can manage own notification preferences"
on public.notification_preferences for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

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

create or replace function private.protect_pickup_task_participants()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.driver_id is distinct from old.driver_id
    or new.colleague_id is distinct from old.colleague_id then
    if not private.is_admin() then
      raise exception 'pickup_participants_locked';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_pickup_task_participants on public.pickup_tasks;
create trigger protect_pickup_task_participants
  before update on public.pickup_tasks
  for each row execute procedure private.protect_pickup_task_participants();

create policy "employees can read shared locations"
on public.location_shares for select to authenticated using (
  user_id = auth.uid()
  or (
    private.is_active_employee()
    and (expires_at is null or expires_at > now())
    and last_updated_at > now() - interval '15 minutes'
    and (
      (visibility = 'pickup' and visible_to_user_id = auth.uid())
      or (visibility = 'team' and audience = 'all')
      or (
        visibility = 'team'
        and audience = 'truck'
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.vehicle_type = 'truck'
            and p.employment_status = 'active'
        )
      )
      or (
        visibility = 'team'
        and audience = 'van'
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.vehicle_type = 'van'
            and p.employment_status = 'active'
        )
      )
    )
  )
);
create policy "employees can share own location"
on public.location_shares for insert to authenticated with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own location"
on public.location_shares for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can stop sharing own location"
on public.location_shares for delete to authenticated using (user_id = auth.uid());

create policy "employees can read own workday sessions"
on public.workday_sessions for select to authenticated using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can start own workday sessions"
on public.workday_sessions for insert to authenticated with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can end own workday sessions"
on public.workday_sessions for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated using (
  private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid())
);
create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated with check (
  private.is_active_employee() and driver_id = auth.uid() and driver_id <> colleague_id
);
create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()))
with check (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()));
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
  private.is_active_employee()
  and (
    owner_id = auth.uid()
    or (
      visibility = 'profile'
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
    )
  )
);
create policy "employees can add own media"
on public.media_attachments for insert to authenticated with check (owner_id = auth.uid() and private.is_active_employee());
create policy "employees can delete own media"
on public.media_attachments for delete to authenticated using (owner_id = auth.uid() and private.is_active_employee());

create policy "employees can upload own media objects"
on storage.objects for insert to authenticated with check (
  bucket_id = 'xpressintra-media'
  and split_part(name, '/', 1) = auth.uid()::text
  and private.is_active_employee()
);
create policy "employees can read own media objects"
on storage.objects for select to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
  and private.is_active_employee()
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
        or (
          private.is_active_employee()
          and (
            media_attachments.visibility = 'profile'
            or (
              media_attachments.visibility = 'announcement'
              and exists (
                select 1 from public.announcements
                where announcements.id = media_attachments.announcement_id
              )
            )
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
      )
  )
);
create policy "employees can delete own media objects"
on storage.objects for delete to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
  and private.is_active_employee()
);

create policy "employees can read internal announcements"
on public.announcements for select to authenticated using (
  private.is_active_employee()
  and (
    audience = 'all'
    or private.is_dispatcher_or_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and vehicle_type = announcements.audience
    )
  )
);
create policy "employees can create internal announcements"
on public.announcements for insert to authenticated with check (
  private.is_active_employee()
  and author_id = auth.uid()
  and (
    kind = 'colleague'
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and access_role in ('dispatcher', 'admin', 'owner')
    )
  )
);
create policy "authors and admins can update announcements"
on public.announcements for update to authenticated using (
  private.is_active_employee() and (author_id = auth.uid() or private.is_admin())
) with check (
  private.is_active_employee()
  and (
    private.is_dispatcher_or_admin()
    or (author_id = auth.uid() and kind = 'colleague')
  )
);
create policy "authors and admins can delete announcements"
on public.announcements for delete to authenticated using (
  private.is_active_employee() and (author_id = auth.uid() or private.is_admin())
);

create policy "employees can read announcement reactions"
on public.announcement_reactions for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);
create policy "employees can react to announcements"
on public.announcement_reactions for insert to authenticated with check (
  private.is_active_employee()
  and user_id = auth.uid()
  and exists (select 1 from public.announcements where id = announcement_id)
);
create policy "employees can remove own reactions"
on public.announcement_reactions for delete to authenticated using (private.is_active_employee() and user_id = auth.uid());
create policy "employees can read announcement comments"
on public.announcement_comments for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);
create policy "employees can comment on announcements"
on public.announcement_comments for insert to authenticated with check (
  private.is_active_employee()
  and author_id = auth.uid()
  and exists (select 1 from public.announcements where id = announcement_id)
);

create policy "employees can read own private log"
on public.private_log_entries for select to authenticated using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can add to own private log"
on public.private_log_entries for insert to authenticated with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own private log"
on public.private_log_entries for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can delete from own private log"
on public.private_log_entries for delete to authenticated using (user_id = auth.uid() and private.is_active_employee());

create policy "employees can read own logbook automation settings"
on public.logbook_automation_settings for select to authenticated using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can create own logbook automation settings"
on public.logbook_automation_settings for insert to authenticated with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own logbook automation settings"
on public.logbook_automation_settings for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can delete own logbook automation settings"
on public.logbook_automation_settings for delete to authenticated using (user_id = auth.uid() and private.is_active_employee());

create policy "employees can read monitored sources"
on public.regulatory_sources for select to authenticated using (private.is_active_employee() and active = true);
create policy "employees can read approved regulatory updates"
on public.regulatory_updates for select to authenticated using (private.is_active_employee() and status = 'approved');

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
revoke execute on function public.start_direct_conversation(uuid) from public, anon;
revoke execute on function public.start_direct_conversation_v2(uuid) from public, anon;
grant execute on function public.start_direct_conversation(uuid) to authenticated;
grant execute on function public.start_direct_conversation_v2(uuid) to authenticated;
grant execute on function public.purge_expired_operational_data() to authenticated;
grant select, insert, update, delete on public.support_requests to authenticated;
revoke all on table public.regulatory_sources from anon;
revoke all on table public.support_requests from anon;

insert into public.regulatory_sources (title, source_url, audience, topic)
values
  ('Færdselsstyrelsen · varebil', 'https://www.fstyr.dk/erhverv/varebil', 'van', 'transport'),
  ('Færdselsstyrelsen · køre- og hviletid', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid', 'truck', 'transport'),
  ('Færdselsstyrelsen · arbejdstidsregler', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/arbejdstidsregler', 'all', 'transport'),
  ('Færdselsstyrelsen · virksomhedskontrol', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/virksomhedskontrol', 'truck', 'transport'),
  ('Færdselsstyrelsen · takograf', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/takograf', 'all', 'transport'),
  ('Vejafgifter.dk', 'https://vejafgifter.dk/', 'truck', 'transport'),
  ('Miljøzoner.dk · varebiler', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-varebiler/', 'van', 'transport'),
  ('Miljøzoner.dk · lastbiler', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-lastbiler-busser/', 'truck', 'transport'),
  ('European Labour Authority · varebil', 'https://www.ela.europa.eu/assets/lcv2026/index.html', 'van', 'transport'),
  ('European Labour Authority · vejtransport', 'https://www.ela.europa.eu/en/campaign/road-fair-transport', 'all', 'transport'),
  ('Datatilsynet · nyheder', 'https://www.datatilsynet.dk/aktuelt/nyheder', 'all', 'gdpr'),
  ('EDPB · news', 'https://www.edpb.europa.eu/news/news_en', 'all', 'gdpr'),
  ('Supabase · legal DPA', 'https://supabase.com/legal/dpa', 'all', 'terms'),
  ('Supabase · legal subprocessors', 'https://supabase.com/legal/subprocessors', 'all', 'privacy'),
  ('Vercel · legal terms', 'https://vercel.com/legal/terms', 'all', 'terms')
on conflict (source_url) do update
set title = excluded.title, audience = excluded.audience, topic = excluded.topic, active = true;

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
    and accepted_at is null
    and used_by is null
    and expires_at > now()
    and id::text = coalesce(nullif(new.raw_user_meta_data ->> 'invitation_id', ''), 'missing-invitation-id')
  order by created_at desc
  limit 1;

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
    case
      when invite.access_role = 'owner'
        and not exists (
          select 1 from public.profiles creator
          where creator.id = invite.created_by
            and creator.access_role = 'owner'
            and creator.employment_status = 'active'
        ) then 'employee'
      else coalesce(invite.access_role, 'employee')
    end,
    coalesce(invite.vehicle_type, 'van'),
    invite.truck,
    case
      when not exists (select 1 from public.profiles) then 'active'
      else 'paused'
    end,
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
    set status = 'accepted',
        accepted_at = now(),
        used_by = new.id
    where id = invite.id
      and status = 'pending'
      and accepted_at is null
      and used_by is null;
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

-- Repair the legacy owner title without overwriting other custom job titles.
update public.profiles
set
  role = 'Appansvarlig · Lastbilchauffør',
  updated_at = now()
where lower(coalesce(access_role, '')) = 'owner'
  and role = 'Appansvarlig ' || chr(194) || chr(183) || ' Lastbilchauff' || chr(195) || chr(184) || 'r';

notify pgrst, 'reload schema';
select pg_notification_queue_usage();
