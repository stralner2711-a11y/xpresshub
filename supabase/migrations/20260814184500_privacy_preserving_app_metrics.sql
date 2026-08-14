-- Privacy-preserving technical metrics for XpressIntra.
-- No profile id, email, message text, GPS, file name, URL or raw error is stored.

create table if not exists public.app_telemetry_daily (
  metric_date date not null,
  event_key text not null check (event_key in ('app_start', 'runtime_error', 'health_check', 'long_task')),
  result text not null check (result in ('success', 'warning', 'failure', 'offline')),
  detail_code text not null default 'none'
    check (detail_code in ('none', 'network', 'timeout', 'permission', 'authentication', 'database', 'javascript', 'unknown')),
  app_version text not null check (length(app_version) between 1 and 80),
  platform text not null check (platform in ('android', 'ios_pwa', 'web')),
  duration_bucket text not null default 'none'
    check (duration_bucket in ('none', 'under_500ms', '500_1500ms', '1500_4000ms', 'over_4000ms')),
  event_count bigint not null default 0 check (event_count between 0 and 100000000),
  updated_at timestamptz not null default now(),
  primary key (metric_date, event_key, result, detail_code, app_version, platform, duration_bucket)
);

create index if not exists app_telemetry_daily_date_idx
  on public.app_telemetry_daily (metric_date desc);

alter table public.app_telemetry_daily enable row level security;

revoke all on table public.app_telemetry_daily from public, anon, authenticated;
grant select on table public.app_telemetry_daily to authenticated;

drop policy if exists "admins can read aggregate app telemetry" on public.app_telemetry_daily;
create policy "admins can read aggregate app telemetry"
on public.app_telemetry_daily for select to authenticated
using ((select private.is_admin()));

create or replace function public.record_app_metric(
  p_metric_date date,
  p_event_key text,
  p_result text,
  p_detail_code text,
  p_event_count integer,
  p_app_version text,
  p_platform text,
  p_duration_bucket text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  safe_date date := coalesce(p_metric_date, current_date);
begin
  if auth.uid() is null or not private.is_active_employee() then
    raise exception 'Active employee session required' using errcode = '42501';
  end if;

  if safe_date < current_date - 7 or safe_date > current_date then
    raise exception 'Metric date outside accepted range' using errcode = '22023';
  end if;
  if p_event_key not in ('app_start', 'runtime_error', 'health_check', 'long_task')
     or p_result not in ('success', 'warning', 'failure', 'offline')
     or p_detail_code not in ('none', 'network', 'timeout', 'permission', 'authentication', 'database', 'javascript', 'unknown')
     or p_platform not in ('android', 'ios_pwa', 'web')
     or p_duration_bucket not in ('none', 'under_500ms', '500_1500ms', '1500_4000ms', 'over_4000ms')
     or p_event_count is null or p_event_count < 1 or p_event_count > 100
     or p_app_version is null or length(p_app_version) not between 1 and 80 then
    raise exception 'Invalid anonymous app metric' using errcode = '22023';
  end if;

  delete from public.app_telemetry_daily
  where metric_date < current_date - 90;

  insert into public.app_telemetry_daily (
    metric_date, event_key, result, detail_code, app_version, platform, duration_bucket, event_count
  ) values (
    safe_date, p_event_key, p_result, p_detail_code, p_app_version, p_platform, p_duration_bucket, p_event_count
  )
  on conflict (metric_date, event_key, result, detail_code, app_version, platform, duration_bucket)
  do update set
    event_count = least(100000000, public.app_telemetry_daily.event_count + excluded.event_count),
    updated_at = now();
end;
$$;

revoke all on function public.record_app_metric(date, text, text, text, integer, text, text, text) from public, anon;
grant execute on function public.record_app_metric(date, text, text, text, integer, text, text, text) to authenticated;

insert into public.retention_policies (key, label, retention_days, area, description, auto_delete)
values (
  'app_telemetry',
  'Anonym teknisk driftsstatistik',
  90,
  'Drift',
  'Sammenlagte tekniske tællere uden bruger-id, mail, beskedtekst, GPS, billeder eller rå fejltekst',
  true
)
on conflict (key) do update set
  label = excluded.label,
  retention_days = excluded.retention_days,
  area = excluded.area,
  description = excluded.description,
  auto_delete = excluded.auto_delete,
  updated_at = now();

notify pgrst, 'reload schema';
