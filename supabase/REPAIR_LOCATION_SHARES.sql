-- XpressIntra GPS repair
-- Run this in Supabase SQL Editor if the app says:
-- "Could not find the table 'public.location_shares' in the schema cache"
--
-- It safely recreates only the live GPS table, policies, indexes and realtime setup.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'XpressIntra grundtabellen public.profiles mangler. Koer foerst supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql i denne Supabase, og koer derefter denne GPS-reparation hvis location_shares stadig mangler.';
  end if;
end;
$$;

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
  check (visibility = 'team' or visible_to_user_id is not null),
  shared_at timestamptz not null default now()
);

alter table public.location_shares
  add column if not exists audience text not null default 'all'
  check (audience in ('all', 'truck', 'van', 'none'));

alter table public.location_shares
  add column if not exists show_speed boolean not null default false,
  add column if not exists show_vehicle boolean not null default true,
  add column if not exists show_status boolean not null default true,
  add column if not exists expires_at timestamptz,
  add column if not exists last_updated_at timestamptz not null default now(),
  add column if not exists shared_at timestamptz not null default now();

alter table public.location_shares
  drop constraint if exists location_shares_share_mode_check;

alter table public.location_shares
  add constraint location_shares_share_mode_check
  check (share_mode in ('manual', 'workday', 'manuel', 'arbejdsdag', '15 min', '30 min', '60 min', 'pickup'));

create index if not exists location_shares_shared_at_idx on public.location_shares (shared_at desc);

alter table public.location_shares enable row level security;

grant select, insert, update, delete on public.location_shares to authenticated;

drop policy if exists "employees can read shared locations" on public.location_shares;
drop policy if exists "employees can share own location" on public.location_shares;
drop policy if exists "employees can update own location" on public.location_shares;
drop policy if exists "employees can stop sharing own location" on public.location_shares;

create policy "employees can read shared locations"
on public.location_shares for select to authenticated using (
  user_id = auth.uid()
  or (visibility = 'pickup' and visible_to_user_id = auth.uid())
  or (
    visibility = 'team'
    and coalesce(audience, 'all') <> 'none'
    and exists (
      select 1
      from public.profiles viewer
      where viewer.id = auth.uid()
        and viewer.employment_status = 'active'
        and (
          coalesce(audience, 'all') = 'all'
          or (audience = 'truck' and viewer.vehicle_type = 'truck')
          or (audience = 'van' and viewer.vehicle_type = 'van')
        )
    )
  )
);

create policy "employees can share own location"
on public.location_shares for insert to authenticated with check (user_id = auth.uid());

create policy "employees can update own location"
on public.location_shares for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "employees can stop sharing own location"
on public.location_shares for delete to authenticated using (user_id = auth.uid() or private.is_admin());

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'supabase_realtime'
        and pr.prrelid = 'public.location_shares'::regclass
    ) then
      alter publication supabase_realtime add table public.location_shares;
    end if;
  end if;
end;
$$;

notify pgrst, 'reload schema';
select pg_notification_queue_usage();
