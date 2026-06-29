-- XpressIntra samlet Supabase-fix
-- Oprettet automatisk fra projektets Supabase-fixfiler.
-- Saadan bruges den:
-- 1. Aabn Supabase SQL Editor.
-- 2. Indsaet hele teksten.
-- 3. Tryk Run.
--
-- VIGTIGT:
-- Hvis databasen slet ikke er oprettet endnu, skal supabase/schema.sql koeres foerst.
-- Denne fil er til et projekt hvor grunddatabasen allerede findes.


-- ============================================================
-- fix-location-share-mode.sql
-- ============================================================

-- Fix for already-created Supabase projects where the old APK sends
-- Danish share_mode values: 'manuel' and 'arbejdsdag'.

alter table public.location_shares
  drop constraint if exists location_shares_share_mode_check;

alter table public.location_shares
  add constraint location_shares_share_mode_check
  check (share_mode in ('manual', 'workday', 'manuel', 'arbejdsdag', '15 min', '30 min', '60 min', 'pickup'));


-- ============================================================
-- fix-employee-registration.sql
-- ============================================================

-- Run this in Supabase SQL Editor if the database already exists.
-- Safe to run more than once.
-- It makes employee invitations auto-fill the new user's profile when they sign up.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'public.profiles mangler. Kør supabase/schema.sql først.';
  end if;
end;
$$;

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

create table if not exists public.profile_private_details (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  emergency_contact text,
  private_note text,
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists password_reset_required boolean not null default false;

alter table public.employee_invitations
  alter column role set default 'Chauffør',
  add column if not exists onboarding_method text not null default 'standard_password' check (onboarding_method in ('standard_password', 'manual')),
  add column if not exists password_reset_required boolean not null default true;

alter table public.employee_invitations enable row level security;
alter table public.profile_private_details enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.employee_invitations to authenticated;
grant select, insert, update, delete on public.profile_private_details to authenticated;

drop policy if exists "admins can manage employee invitations" on public.employee_invitations;
drop policy if exists "employees can read own private profile details" on public.profile_private_details;
drop policy if exists "employees can manage own private profile details" on public.profile_private_details;
drop policy if exists "admins can manage private profile details" on public.profile_private_details;

create policy "admins can manage employee invitations"
on public.employee_invitations for all to authenticated
using (private.is_admin())
with check (created_by = auth.uid() and private.is_admin());

create policy "employees can read own private profile details"
on public.profile_private_details for select to authenticated
using (user_id = auth.uid() or private.is_dispatcher_or_admin());

create policy "employees can manage own private profile details"
on public.profile_private_details for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "admins can manage private profile details"
on public.profile_private_details for all to authenticated
using (private.is_admin())
with check (private.is_admin());

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
    case
      when invite.id is not null then 'active'
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
    set emergency_contact = excluded.emergency_contact,
        updated_at = now();

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
  for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;


-- ============================================================
-- fix-pickup-live-notes.sql
-- ============================================================

-- Run this in Supabase SQL Editor if the database already exists.
-- Safe to run more than once.
-- It lets both pickup participants update the task, so both can add live notes.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'public.profiles mangler. Kør supabase/schema.sql først.';
  end if;
end;
$$;

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

alter table public.pickup_tasks enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.pickup_tasks to authenticated;

drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
drop policy if exists "drivers can finish own pickup tasks" on public.pickup_tasks;
drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;

create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated
using (driver_id = auth.uid() or colleague_id = auth.uid());

create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated
with check (driver_id = auth.uid() and driver_id <> colleague_id);

create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (driver_id = auth.uid() or colleague_id = auth.uid())
with check (driver_id = auth.uid() or colleague_id = auth.uid());


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

