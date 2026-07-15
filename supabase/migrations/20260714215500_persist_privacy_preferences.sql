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
