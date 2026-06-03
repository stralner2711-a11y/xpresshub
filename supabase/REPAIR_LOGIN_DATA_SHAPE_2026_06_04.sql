-- XpressIntra live repair: fixes login follow-up data reads after older Supabase installs.
-- Safe to run more than once.

alter table public.pickup_tasks
  add column if not exists started_at timestamptz not null default now();

create index if not exists pickup_tasks_status_started_idx
  on public.pickup_tasks (status, started_at desc);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_attachments_announcement_fk'
      and conrelid = 'public.media_attachments'::regclass
  ) then
    alter table public.media_attachments
      add constraint media_attachments_announcement_fk
      foreign key (announcement_id) references public.announcements(id) on delete cascade;
  end if;
end $$;

notify pgrst, 'reload schema';
select pg_notification_queue_usage();
