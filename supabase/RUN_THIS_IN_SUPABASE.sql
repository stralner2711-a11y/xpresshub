-- XpressIntra samlet Supabase-fix
-- Oprettet automatisk fra den aktuelle sikkerhedsmigration.
-- Saadan bruges den:
-- 1. Aabn Supabase SQL Editor.
-- 2. Indsaet hele teksten.
-- 3. Tryk Run.
--
-- VIGTIGT:
-- Hvis databasen slet ikke er oprettet endnu, skal supabase/schema.sql koeres foerst.
-- Denne fil er til et projekt hvor grunddatabasen allerede findes.


-- ============================================================
-- migrations\20260714201233_xpressintra_security_stabilization.sql
-- ============================================================

-- XpressIntra security and stability hardening.
-- This migration preserves existing users and operational data.

create schema if not exists private;

create or replace function private.is_active_employee()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and employment_status = 'active'
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
    select 1
    from public.profiles
    where id = auth.uid()
      and access_role in ('admin', 'owner')
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
    select 1
    from public.profiles
    where id = auth.uid()
      and access_role in ('dispatcher', 'admin', 'owner')
      and employment_status = 'active'
  );
$$;

alter table public.employee_invitations
  alter column onboarding_method set default 'invite_link';

alter table public.employee_invitations
  drop constraint if exists employee_invitations_onboarding_method_check;

alter table public.employee_invitations
  add constraint employee_invitations_onboarding_method_check
  check (onboarding_method in ('invite_link', 'access_request', 'standard_password', 'manual'));

drop trigger if exists prevent_profile_privilege_escalation_trigger on public.profiles;
drop function if exists public.prevent_profile_privilege_escalation();

create or replace function private.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  protected_change boolean;
begin
  -- SQL Editor/service operations are trusted. Browser clients always have auth.uid().
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

create or replace function private.can_access_conversation(target_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select private.is_active_employee()
    and exists (
      select 1
      from public.conversations c
      join public.profiles p on p.id = auth.uid()
      where c.id = target_conversation
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

revoke all on function public.start_direct_conversation(uuid) from public, anon;
grant execute on function public.start_direct_conversation(uuid) to authenticated;

-- Profiles and private details.
drop policy if exists "profiles read authenticated" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
drop policy if exists "profiles admin update" on public.profiles;
drop policy if exists "employees can read profiles" on public.profiles;
drop policy if exists "employees can update own profile" on public.profiles;
drop policy if exists "admins can update employee profiles" on public.profiles;
drop policy if exists "admins can deactivate employee profiles" on public.profiles;

create policy "profiles read scoped"
on public.profiles for select to authenticated using (
  id = auth.uid()
  or private.is_admin()
  or (private.is_active_employee() and employment_status = 'active')
);
create policy "profiles update own safe fields"
on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin update"
on public.profiles for update to authenticated
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "admins can manage private profile details" on public.profile_private_details;
drop policy if exists "employees can manage own private profile details" on public.profile_private_details;
drop policy if exists "employees can read own private profile details" on public.profile_private_details;
drop policy if exists "private details manage own" on public.profile_private_details;
drop policy if exists "private details own or admin" on public.profile_private_details;

create policy "private details own read"
on public.profile_private_details for select to authenticated
using (user_id = auth.uid() or private.is_admin());
create policy "private details own manage"
on public.profile_private_details for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "private details admin manage"
on public.profile_private_details for all to authenticated
using (private.is_admin()) with check (private.is_admin());

-- Invitations are only managed by active admin/owner accounts.
drop policy if exists "admins can manage employee invitations" on public.employee_invitations;
drop policy if exists "employee invitations admin" on public.employee_invitations;

create policy "invitations admin read"
on public.employee_invitations for select to authenticated
using (private.is_admin());
create policy "invitations admin insert"
on public.employee_invitations for insert to authenticated
with check (private.is_admin() and created_by = auth.uid());
create policy "invitations admin update"
on public.employee_invitations for update to authenticated
using (private.is_admin()) with check (private.is_admin());
create policy "invitations admin delete"
on public.employee_invitations for delete to authenticated
using (private.is_admin());

-- Live GPS is voluntary. Admin/dispatch get no automatic bypass.
delete from public.location_shares
where (expires_at is not null and expires_at <= now())
   or last_updated_at < now() - interval '15 minutes';

drop policy if exists "location read scoped" on public.location_shares;
drop policy if exists "location own insert" on public.location_shares;
drop policy if exists "location own update" on public.location_shares;
drop policy if exists "location own delete" on public.location_shares;
drop policy if exists "employees can read shared locations" on public.location_shares;
drop policy if exists "employees can share own location" on public.location_shares;
drop policy if exists "employees can update own location" on public.location_shares;
drop policy if exists "employees can stop sharing own location" on public.location_shares;

create policy "location read scoped"
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
        visibility = 'team' and audience = 'truck'
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.vehicle_type = 'truck' and p.employment_status = 'active'
        )
      )
      or (
        visibility = 'team' and audience = 'van'
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.vehicle_type = 'van' and p.employment_status = 'active'
        )
      )
    )
  )
);
create policy "location own insert"
on public.location_shares for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "location own update"
on public.location_shares for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "location own delete"
on public.location_shares for delete to authenticated
using (user_id = auth.uid());

-- Shared content is only available to active employees.
drop policy if exists "announcements read" on public.announcements;
drop policy if exists "announcements insert" on public.announcements;
drop policy if exists "employees can read internal announcements" on public.announcements;
drop policy if exists "employees can create internal announcements" on public.announcements;
drop policy if exists "authors and admins can update announcements" on public.announcements;
drop policy if exists "authors and admins can delete announcements" on public.announcements;

create policy "announcements read active"
on public.announcements for select to authenticated using (
  private.is_active_employee()
  and (
    audience = 'all'
    or private.is_dispatcher_or_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.vehicle_type = announcements.audience
    )
  )
);
create policy "announcements insert active"
on public.announcements for insert to authenticated with check (
  private.is_active_employee()
  and author_id = auth.uid()
  and (kind = 'colleague' or private.is_dispatcher_or_admin())
);
create policy "announcements update author admin"
on public.announcements for update to authenticated
using (private.is_active_employee() and (author_id = auth.uid() or private.is_admin()))
with check (private.is_active_employee() and (author_id = auth.uid() or private.is_admin()));
create policy "announcements delete author admin"
on public.announcements for delete to authenticated
using (private.is_active_employee() and (author_id = auth.uid() or private.is_admin()));

drop policy if exists "announcement reactions own" on public.announcement_reactions;
drop policy if exists "announcement reactions read" on public.announcement_reactions;
drop policy if exists "employees can read announcement reactions" on public.announcement_reactions;
drop policy if exists "employees can react to announcements" on public.announcement_reactions;
drop policy if exists "employees can remove own reactions" on public.announcement_reactions;
create policy "announcement reactions read active"
on public.announcement_reactions for select to authenticated using (private.is_active_employee());
create policy "announcement reactions insert active"
on public.announcement_reactions for insert to authenticated
with check (
  private.is_active_employee()
  and user_id = auth.uid()
  and exists (select 1 from public.announcements a where a.id = announcement_id)
);
create policy "announcement reactions delete own"
on public.announcement_reactions for delete to authenticated
using (private.is_active_employee() and user_id = auth.uid());

drop policy if exists "announcement comments own insert" on public.announcement_comments;
drop policy if exists "announcement comments read" on public.announcement_comments;
drop policy if exists "employees can read announcement comments" on public.announcement_comments;
drop policy if exists "employees can comment on announcements" on public.announcement_comments;
create policy "announcement comments read active"
on public.announcement_comments for select to authenticated using (private.is_active_employee());
create policy "announcement comments insert active"
on public.announcement_comments for insert to authenticated
with check (
  private.is_active_employee()
  and author_id = auth.uid()
  and exists (select 1 from public.announcements a where a.id = announcement_id)
);

-- Profile images are visible to active colleagues, while chat images still use conversation access.
drop policy if exists "media read own related" on public.media_attachments;
drop policy if exists "employees can read visible media" on public.media_attachments;
create policy "media read active scoped"
on public.media_attachments for select to authenticated using (
  owner_id = auth.uid()
  or (
    private.is_active_employee()
    and (
      visibility = 'profile'
      or (
        message_id is not null
        and exists (
          select 1 from public.messages m
          where m.id = media_attachments.message_id
            and private.can_access_conversation(m.conversation_id)
        )
      )
      or (
        announcement_id is not null
        and exists (select 1 from public.announcements a where a.id = media_attachments.announcement_id)
      )
    )
  )
);

drop policy if exists "employees can read shared media objects" on storage.objects;
create policy "employees can read shared media objects"
on storage.objects for select to authenticated using (
  bucket_id = 'xpressintra-media'
  and exists (
    select 1 from public.media_attachments ma
    where ma.bucket = storage.objects.bucket_id
      and ma.storage_path = storage.objects.name
      and (
        ma.owner_id = auth.uid()
        or (
          private.is_active_employee()
          and (
            ma.visibility = 'profile'
            or (
              ma.visibility = 'announcement'
              and exists (select 1 from public.announcements a where a.id = ma.announcement_id)
            )
            or (
              ma.message_id is not null
              and exists (
                select 1 from public.messages m
                where m.id = ma.message_id
                  and private.can_access_conversation(m.conversation_id)
              )
            )
          )
        )
      )
  )
);

-- Operational reference data should not be visible to paused/rejected accounts.
drop policy if exists "core settings read" on public.core_settings;
drop policy if exists "employees can read core settings" on public.core_settings;
create policy "core settings read active"
on public.core_settings for select to authenticated using (private.is_active_employee());

drop policy if exists "retention read" on public.retention_policies;
drop policy if exists "employees can read retention policies" on public.retention_policies;
create policy "retention read active"
on public.retention_policies for select to authenticated using (private.is_active_employee());

drop policy if exists "vehicles read" on public.vehicles;
drop policy if exists "employees can read vehicles" on public.vehicles;
create policy "vehicles read active"
on public.vehicles for select to authenticated using (private.is_active_employee());

drop policy if exists "workday own" on public.workday_sessions;
drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
drop policy if exists "employees can start own workday sessions" on public.workday_sessions;
drop policy if exists "employees can end own workday sessions" on public.workday_sessions;
create policy "workday own select"
on public.workday_sessions for select to authenticated using (user_id = auth.uid());
create policy "workday own insert"
on public.workday_sessions for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "workday own update"
on public.workday_sessions for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

-- Keep accidentally mixed TruckLex data intact, but isolate it from this app's client roles and Realtime.
do $$
declare
  item record;
begin
  for item in
    select tablename from pg_tables
    where schemaname = 'public' and tablename like 'trucklex\_%' escape '\'
  loop
    execute format('revoke all privileges on table public.%I from anon, authenticated', item.tablename);
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
      begin
        execute format('alter publication supabase_realtime drop table public.%I', item.tablename);
      exception
        when undefined_object then null;
      end;
    end if;
  end loop;
end;
$$;

do $$
begin
  if to_regclass('public.regulatory_sources') is not null then
    execute $update$
      update public.regulatory_sources
      set source_url = 'https://www.ela.europa.eu/assets/lcv2026/index.html',
          title = 'European Labour Authority · varebil'
      where source_url = 'https://www.ela.europa.eu/en/light-commercial-vehicles'
    $update$;
  end if;
end;
$$;

notify pgrst, 'reload schema';


-- ============================================================
-- migrations\20260714204321_support_requests_and_announcement_updates.sql
-- ============================================================

alter table public.announcements
  add column if not exists updated_at timestamptz;

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

create index if not exists support_requests_created_at_idx
  on public.support_requests (created_at desc);
create index if not exists support_requests_status_idx
  on public.support_requests (status, created_at desc);

alter table public.support_requests enable row level security;

grant select, insert, update, delete on public.support_requests to authenticated;

drop policy if exists "support own read" on public.support_requests;
drop policy if exists "support own insert" on public.support_requests;
drop policy if exists "support admin update" on public.support_requests;
drop policy if exists "support admin delete" on public.support_requests;

create policy "support own read"
on public.support_requests for select to authenticated
using (user_id = auth.uid() or private.is_admin());

create policy "support own insert"
on public.support_requests for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());

create policy "support admin update"
on public.support_requests for update to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "support admin delete"
on public.support_requests for delete to authenticated
using (private.is_admin());

notify pgrst, 'reload schema';


-- ============================================================
-- migrations\20260714211500_audit_and_announcement_visibility.sql
-- ============================================================

-- Complete admin audit details and keep announcement activity behind announcement visibility.

create or replace function private.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  protected_change boolean;
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

drop policy if exists "employees can read announcement reactions" on public.announcement_reactions;
create policy "employees can read announcement reactions"
on public.announcement_reactions for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);

drop policy if exists "employees can read announcement comments" on public.announcement_comments;
create policy "employees can read announcement comments"
on public.announcement_comments for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);

notify pgrst, 'reload schema';


-- ============================================================
-- migrations\20260714213000_active_operational_access.sql
-- ============================================================

-- Paused or offboarded accounts must not retain operational access through an old session.

drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
create policy "employees can read own workday sessions"
on public.workday_sessions for select to authenticated using (
  user_id = auth.uid() and private.is_active_employee()
);

drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated using (
  private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid())
);

drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated with check (
  private.is_active_employee() and driver_id = auth.uid() and driver_id <> colleague_id
);

drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;
create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()))
with check (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()));

notify pgrst, 'reload schema';


-- ============================================================
-- migrations\20260714215500_persist_privacy_preferences.sql
-- ============================================================

-- Keep workday privacy settings consistent across the employee's devices.

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

drop policy if exists "employees can read own notification preferences" on public.notification_preferences;
create policy "employees can read own notification preferences"
on public.notification_preferences for select to authenticated using (
  user_id = auth.uid() and private.is_active_employee()
);

drop policy if exists "employees can manage own notification preferences" on public.notification_preferences;
create policy "employees can manage own notification preferences"
on public.notification_preferences for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

notify pgrst, 'reload schema';


-- ============================================================
-- migrations\20260714222500_consolidate_active_rls.sql
-- ============================================================

-- Consolidate XpressIntra RLS policies.
-- PostgreSQL combines permissive policies with OR, so legacy policies must be
-- removed before the stricter active-employee policies can be relied upon.

-- Bring older regulatory tables up to the canonical shape without deleting
-- legacy columns or rows.
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

alter table public.regulatory_sources enable row level security;

insert into public.regulatory_sources (title, source_url, audience, topic)
values ('Færdselsstyrelsen · transportregler', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil', 'all', 'transport')
on conflict (source_url) do nothing;

alter table public.regulatory_updates add column if not exists source_id bigint;
alter table public.regulatory_updates add column if not exists topic text not null default 'transport';
alter table public.regulatory_updates add column if not exists effective_date date;
alter table public.regulatory_updates add column if not exists content_hash text;

update public.regulatory_updates
set source_id = (
  select id from public.regulatory_sources
  where source_url = 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil'
)
where source_id is null;

alter table public.regulatory_updates alter column source_id set not null;

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

create index if not exists regulatory_updates_status_detected_idx
  on public.regulatory_updates (status, detected_at desc);
create unique index if not exists regulatory_updates_source_hash_idx
  on public.regulatory_updates (source_id, content_hash)
  where content_hash is not null;

-- Profiles and private profile data.
drop policy if exists "profiles update own safe fields" on public.profiles;
drop policy if exists "employees can update own profile" on public.profiles;
create policy "employees can update own profile"
on public.profiles for update to authenticated
using (id = auth.uid() and private.is_active_employee())
with check (id = auth.uid() and private.is_active_employee());

drop policy if exists "private details own read" on public.profile_private_details;
drop policy if exists "private details own manage" on public.profile_private_details;
drop policy if exists "private details admin manage" on public.profile_private_details;
drop policy if exists "employees can read own private profile details" on public.profile_private_details;
drop policy if exists "employees can manage own private profile details" on public.profile_private_details;
drop policy if exists "admins can manage private profile details" on public.profile_private_details;
create policy "employees can read own private profile details"
on public.profile_private_details for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can manage own private profile details"
on public.profile_private_details for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "admins can manage private profile details"
on public.profile_private_details for all to authenticated
using (private.is_admin()) with check (private.is_admin());

-- Legal, privacy and support requests.
drop policy if exists "legal own" on public.legal_acceptances;
drop policy if exists "employees can read own legal acceptances" on public.legal_acceptances;
drop policy if exists "employees can accept legal policies" on public.legal_acceptances;
create policy "employees can read own legal acceptances"
on public.legal_acceptances for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can accept legal policies"
on public.legal_acceptances for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());

drop policy if exists "dsr own read" on public.data_subject_requests;
drop policy if exists "dsr own insert" on public.data_subject_requests;
drop policy if exists "dsr admin" on public.data_subject_requests;
drop policy if exists "employees can read own data requests" on public.data_subject_requests;
drop policy if exists "employees can create own data requests" on public.data_subject_requests;
drop policy if exists "admins can handle data requests" on public.data_subject_requests;
create policy "employees can read own data requests"
on public.data_subject_requests for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can create own data requests"
on public.data_subject_requests for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "admins can handle data requests"
on public.data_subject_requests for update to authenticated
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "support own read" on public.support_requests;
drop policy if exists "support own insert" on public.support_requests;
drop policy if exists "support admin update" on public.support_requests;
drop policy if exists "support admin delete" on public.support_requests;
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

-- Notifications and device/privacy preferences.
drop policy if exists "notifications own" on public.notifications;
drop policy if exists "employees can read own notifications" on public.notifications;
drop policy if exists "employees can update own notifications" on public.notifications;
drop policy if exists "system roles can create notifications" on public.notifications;
create policy "employees can read own notifications"
on public.notifications for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own notifications"
on public.notifications for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "system roles can create notifications"
on public.notifications for insert to authenticated with check (
  private.is_active_employee()
  and (user_id = auth.uid() or private.is_dispatcher_or_admin())
);

drop policy if exists "notification prefs own" on public.notification_preferences;
drop policy if exists "employees can read own notification preferences" on public.notification_preferences;
drop policy if exists "employees can manage own notification preferences" on public.notification_preferences;
create policy "employees can read own notification preferences"
on public.notification_preferences for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can manage own notification preferences"
on public.notification_preferences for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

-- Workday and pickup tasks.
drop policy if exists "workday own select" on public.workday_sessions;
drop policy if exists "workday own insert" on public.workday_sessions;
drop policy if exists "workday own update" on public.workday_sessions;
drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
drop policy if exists "employees can start own workday sessions" on public.workday_sessions;
drop policy if exists "employees can end own workday sessions" on public.workday_sessions;
create policy "employees can read own workday sessions"
on public.workday_sessions for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can start own workday sessions"
on public.workday_sessions for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can end own workday sessions"
on public.workday_sessions for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

drop policy if exists "pickup create own" on public.pickup_tasks;
drop policy if exists "pickup participants read" on public.pickup_tasks;
drop policy if exists "pickup participants update" on public.pickup_tasks;
drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;
create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated using (
  private.is_active_employee()
  and (driver_id = auth.uid() or colleague_id = auth.uid())
);
create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated with check (
  private.is_active_employee()
  and driver_id = auth.uid()
  and driver_id <> colleague_id
);
create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()))
with check (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()));

-- Announcements, comments and reactions must follow announcement visibility.
drop policy if exists "announcement comments read active" on public.announcement_comments;
drop policy if exists "employees can read announcement comments" on public.announcement_comments;
create policy "employees can read announcement comments"
on public.announcement_comments for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);

drop policy if exists "announcement reactions read active" on public.announcement_reactions;
drop policy if exists "employees can read announcement reactions" on public.announcement_reactions;
create policy "employees can read announcement reactions"
on public.announcement_reactions for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);

-- Media metadata and private Storage objects.
drop policy if exists "media read active scoped" on public.media_attachments;
drop policy if exists "media insert own" on public.media_attachments;
drop policy if exists "media delete own" on public.media_attachments;
drop policy if exists "employees can read visible media" on public.media_attachments;
drop policy if exists "employees can add own media" on public.media_attachments;
drop policy if exists "employees can delete own media" on public.media_attachments;
create policy "employees can read visible media"
on public.media_attachments for select to authenticated using (
  private.is_active_employee()
  and (
    owner_id = auth.uid()
    or visibility = 'profile'
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
      and exists (
        select 1 from public.announcements
        where announcements.id = media_attachments.announcement_id
      )
    )
  )
);
create policy "employees can add own media"
on public.media_attachments for insert to authenticated
with check (owner_id = auth.uid() and private.is_active_employee());
create policy "employees can delete own media"
on public.media_attachments for delete to authenticated
using (owner_id = auth.uid() and private.is_active_employee());

drop policy if exists "xpressintra media read own or admin" on storage.objects;
drop policy if exists "xpressintra media delete own or admin" on storage.objects;
drop policy if exists "xpressintra media update own" on storage.objects;
drop policy if exists "xpressintra media upload own" on storage.objects;
drop policy if exists "employees can upload own media objects" on storage.objects;
drop policy if exists "employees can read own media objects" on storage.objects;
drop policy if exists "employees can read shared media objects" on storage.objects;
drop policy if exists "employees can delete own media objects" on storage.objects;
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
  and private.is_active_employee()
  and exists (
    select 1 from public.media_attachments
    where media_attachments.bucket = storage.objects.bucket_id
      and media_attachments.storage_path = storage.objects.name
  )
);
create policy "employees can delete own media objects"
on storage.objects for delete to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
  and private.is_active_employee()
);

-- Private logbook data.
drop policy if exists "private log own" on public.private_log_entries;
drop policy if exists "employees can read own private log" on public.private_log_entries;
drop policy if exists "employees can add to own private log" on public.private_log_entries;
drop policy if exists "employees can update own private log" on public.private_log_entries;
drop policy if exists "employees can delete from own private log" on public.private_log_entries;
create policy "employees can read own private log"
on public.private_log_entries for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can add to own private log"
on public.private_log_entries for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own private log"
on public.private_log_entries for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can delete from own private log"
on public.private_log_entries for delete to authenticated
using (user_id = auth.uid() and private.is_active_employee());

drop policy if exists "logbook settings own" on public.logbook_automation_settings;
drop policy if exists "employees can read own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can create own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can update own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can delete own logbook automation settings" on public.logbook_automation_settings;
create policy "employees can read own logbook automation settings"
on public.logbook_automation_settings for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can create own logbook automation settings"
on public.logbook_automation_settings for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own logbook automation settings"
on public.logbook_automation_settings for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can delete own logbook automation settings"
on public.logbook_automation_settings for delete to authenticated
using (user_id = auth.uid() and private.is_active_employee());

-- Regulatory information remains readable only to active employees.
drop policy if exists "regulatory approved read" on public.regulatory_updates;
drop policy if exists "employees can read approved regulatory updates" on public.regulatory_updates;
drop policy if exists "employees can read monitored sources" on public.regulatory_sources;
create policy "employees can read monitored sources"
on public.regulatory_sources for select to authenticated
using (private.is_active_employee() and active = true);
create policy "employees can read approved regulatory updates"
on public.regulatory_updates for select to authenticated
using (private.is_active_employee() and status = 'approved');

notify pgrst, 'reload schema';


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

