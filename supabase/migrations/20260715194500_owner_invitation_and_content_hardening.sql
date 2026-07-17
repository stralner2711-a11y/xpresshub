-- Keep invitations single-use, reserve owner changes for an active owner,
-- and prevent ordinary employee posts from being promoted to office posts.

create or replace function private.is_owner()
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
      and access_role = 'owner'
      and employment_status = 'active'
  );
$$;

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
      select 1
      from public.profiles p
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

drop policy if exists "invitations admin insert" on public.employee_invitations;
create policy "invitations admin insert"
on public.employee_invitations for insert to authenticated
with check (
  private.is_admin()
  and created_by = auth.uid()
  and (access_role <> 'owner' or private.is_owner())
);

drop policy if exists "invitations admin update" on public.employee_invitations;
create policy "invitations admin update"
on public.employee_invitations for update to authenticated
using (private.is_admin() and (access_role <> 'owner' or private.is_owner()))
with check (private.is_admin() and (access_role <> 'owner' or private.is_owner()));

drop policy if exists "invitations admin delete" on public.employee_invitations;
create policy "invitations admin delete"
on public.employee_invitations for delete to authenticated
using (private.is_admin() and (access_role <> 'owner' or private.is_owner()));

drop policy if exists "announcements update author admin" on public.announcements;
create policy "announcements update author admin"
on public.announcements for update to authenticated
using (
  private.is_active_employee()
  and (author_id = auth.uid() or private.is_admin())
)
with check (
  private.is_active_employee()
  and (
    private.is_dispatcher_or_admin()
    or (author_id = auth.uid() and kind = 'colleague')
  )
);

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
    id, full_name, phone, email, department, license_summary, languages,
    role, access_role, vehicle_type, truck, employment_status,
    logbook_enabled, password_reset_required
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
    set emergency_contact = excluded.emergency_contact,
        updated_at = now();

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

create index if not exists support_requests_user_id_idx
  on public.support_requests (user_id);
create index if not exists support_requests_handled_by_idx
  on public.support_requests (handled_by);

revoke all on table public.regulatory_sources from anon;
revoke all on table public.support_requests from anon;
revoke execute on all functions in schema private from public, anon;
grant execute on all functions in schema private to authenticated, service_role;
revoke execute on function private.protect_profile_security_fields() from public, anon;
revoke execute on function private.protect_pickup_task_participants() from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

notify pgrst, 'reload schema';
