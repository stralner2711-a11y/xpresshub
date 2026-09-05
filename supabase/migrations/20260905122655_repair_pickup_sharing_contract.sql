alter table public.pickup_tasks
  add column if not exists started_location_sharing boolean not null default false;
notify pgrst, 'reload schema';
