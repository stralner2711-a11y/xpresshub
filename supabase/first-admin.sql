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
