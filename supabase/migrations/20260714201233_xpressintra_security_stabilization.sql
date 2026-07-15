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
