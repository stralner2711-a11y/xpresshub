-- Run this in Supabase SQL Editor if the database already exists.
-- Safe to run more than once.
-- It lets both pickup participants update the task, so both can add live notes.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'public.profiles mangler. Kor supabase/schema.sql forst.';
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
