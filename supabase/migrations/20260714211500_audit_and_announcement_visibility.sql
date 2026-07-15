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
