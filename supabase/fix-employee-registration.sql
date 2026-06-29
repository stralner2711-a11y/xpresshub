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
