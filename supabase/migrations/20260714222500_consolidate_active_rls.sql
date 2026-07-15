-- Consolidate XpressIntra RLS policies.
-- PostgreSQL combines permissive policies with OR, so legacy policies must be
-- removed before the stricter active-employee policies can be relied upon.

-- Bring older regulatory tables up to the canonical shape without deleting
-- legacy columns or rows.
create table if not exists public.regulatory_sources (
  id bigint generated always as identity primary key,
  title text not null,
  source_url text not null unique,
  audience text not null default 'all' check (audience in ('all', 'van', 'truck')),
  topic text not null default 'transport' check (topic in ('transport', 'gdpr', 'terms', 'privacy', 'technology', 'operations')),
  active boolean not null default true,
  last_checked_at timestamptz,
  last_content_hash text,
  created_at timestamptz not null default now()
);

alter table public.regulatory_sources enable row level security;

insert into public.regulatory_sources (title, source_url, audience, topic)
values ('Færdselsstyrelsen · transportregler', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil', 'all', 'transport')
on conflict (source_url) do nothing;

alter table public.regulatory_updates add column if not exists source_id bigint;
alter table public.regulatory_updates add column if not exists topic text not null default 'transport';
alter table public.regulatory_updates add column if not exists effective_date date;
alter table public.regulatory_updates add column if not exists content_hash text;

update public.regulatory_updates
set source_id = (
  select id from public.regulatory_sources
  where source_url = 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil'
)
where source_id is null;

alter table public.regulatory_updates alter column source_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.regulatory_updates'::regclass
      and contype = 'f'
      and conname = 'regulatory_updates_source_id_fkey'
  ) then
    alter table public.regulatory_updates
      add constraint regulatory_updates_source_id_fkey
      foreign key (source_id) references public.regulatory_sources(id) on delete cascade;
  end if;
end $$;

create index if not exists regulatory_updates_status_detected_idx
  on public.regulatory_updates (status, detected_at desc);
create unique index if not exists regulatory_updates_source_hash_idx
  on public.regulatory_updates (source_id, content_hash)
  where content_hash is not null;

-- Profiles and private profile data.
drop policy if exists "profiles update own safe fields" on public.profiles;
drop policy if exists "employees can update own profile" on public.profiles;
create policy "employees can update own profile"
on public.profiles for update to authenticated
using (id = auth.uid() and private.is_active_employee())
with check (id = auth.uid() and private.is_active_employee());

drop policy if exists "private details own read" on public.profile_private_details;
drop policy if exists "private details own manage" on public.profile_private_details;
drop policy if exists "private details admin manage" on public.profile_private_details;
drop policy if exists "employees can read own private profile details" on public.profile_private_details;
drop policy if exists "employees can manage own private profile details" on public.profile_private_details;
drop policy if exists "admins can manage private profile details" on public.profile_private_details;
create policy "employees can read own private profile details"
on public.profile_private_details for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can manage own private profile details"
on public.profile_private_details for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "admins can manage private profile details"
on public.profile_private_details for all to authenticated
using (private.is_admin()) with check (private.is_admin());

-- Legal, privacy and support requests.
drop policy if exists "legal own" on public.legal_acceptances;
drop policy if exists "employees can read own legal acceptances" on public.legal_acceptances;
drop policy if exists "employees can accept legal policies" on public.legal_acceptances;
create policy "employees can read own legal acceptances"
on public.legal_acceptances for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can accept legal policies"
on public.legal_acceptances for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());

drop policy if exists "dsr own read" on public.data_subject_requests;
drop policy if exists "dsr own insert" on public.data_subject_requests;
drop policy if exists "dsr admin" on public.data_subject_requests;
drop policy if exists "employees can read own data requests" on public.data_subject_requests;
drop policy if exists "employees can create own data requests" on public.data_subject_requests;
drop policy if exists "admins can handle data requests" on public.data_subject_requests;
create policy "employees can read own data requests"
on public.data_subject_requests for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "employees can create own data requests"
on public.data_subject_requests for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "admins can handle data requests"
on public.data_subject_requests for update to authenticated
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "support own read" on public.support_requests;
drop policy if exists "support own insert" on public.support_requests;
drop policy if exists "support admin update" on public.support_requests;
drop policy if exists "support admin delete" on public.support_requests;
create policy "support own read"
on public.support_requests for select to authenticated using (
  (user_id = auth.uid() and private.is_active_employee()) or private.is_admin()
);
create policy "support own insert"
on public.support_requests for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "support admin update"
on public.support_requests for update to authenticated
using (private.is_admin()) with check (private.is_admin());
create policy "support admin delete"
on public.support_requests for delete to authenticated using (private.is_admin());

-- Notifications and device/privacy preferences.
drop policy if exists "notifications own" on public.notifications;
drop policy if exists "employees can read own notifications" on public.notifications;
drop policy if exists "employees can update own notifications" on public.notifications;
drop policy if exists "system roles can create notifications" on public.notifications;
create policy "employees can read own notifications"
on public.notifications for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own notifications"
on public.notifications for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "system roles can create notifications"
on public.notifications for insert to authenticated with check (
  private.is_active_employee()
  and (user_id = auth.uid() or private.is_dispatcher_or_admin())
);

drop policy if exists "notification prefs own" on public.notification_preferences;
drop policy if exists "employees can read own notification preferences" on public.notification_preferences;
drop policy if exists "employees can manage own notification preferences" on public.notification_preferences;
create policy "employees can read own notification preferences"
on public.notification_preferences for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can manage own notification preferences"
on public.notification_preferences for all to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

-- Workday and pickup tasks.
drop policy if exists "workday own select" on public.workday_sessions;
drop policy if exists "workday own insert" on public.workday_sessions;
drop policy if exists "workday own update" on public.workday_sessions;
drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
drop policy if exists "employees can start own workday sessions" on public.workday_sessions;
drop policy if exists "employees can end own workday sessions" on public.workday_sessions;
create policy "employees can read own workday sessions"
on public.workday_sessions for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can start own workday sessions"
on public.workday_sessions for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can end own workday sessions"
on public.workday_sessions for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());

drop policy if exists "pickup create own" on public.pickup_tasks;
drop policy if exists "pickup participants read" on public.pickup_tasks;
drop policy if exists "pickup participants update" on public.pickup_tasks;
drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;
create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated using (
  private.is_active_employee()
  and (driver_id = auth.uid() or colleague_id = auth.uid())
);
create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated with check (
  private.is_active_employee()
  and driver_id = auth.uid()
  and driver_id <> colleague_id
);
create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()))
with check (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()));

-- Announcements, comments and reactions must follow announcement visibility.
drop policy if exists "announcement comments read active" on public.announcement_comments;
drop policy if exists "employees can read announcement comments" on public.announcement_comments;
create policy "employees can read announcement comments"
on public.announcement_comments for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);

drop policy if exists "announcement reactions read active" on public.announcement_reactions;
drop policy if exists "employees can read announcement reactions" on public.announcement_reactions;
create policy "employees can read announcement reactions"
on public.announcement_reactions for select to authenticated using (
  private.is_active_employee()
  and exists (select 1 from public.announcements where id = announcement_id)
);

-- Media metadata and private Storage objects.
drop policy if exists "media read active scoped" on public.media_attachments;
drop policy if exists "media insert own" on public.media_attachments;
drop policy if exists "media delete own" on public.media_attachments;
drop policy if exists "employees can read visible media" on public.media_attachments;
drop policy if exists "employees can add own media" on public.media_attachments;
drop policy if exists "employees can delete own media" on public.media_attachments;
create policy "employees can read visible media"
on public.media_attachments for select to authenticated using (
  private.is_active_employee()
  and (
    owner_id = auth.uid()
    or visibility = 'profile'
    or (
      message_id is not null
      and exists (
        select 1 from public.messages
        where messages.id = media_attachments.message_id
          and private.can_read_conversation(messages.conversation_id)
      )
    )
    or (
      announcement_id is not null
      and exists (
        select 1 from public.announcements
        where announcements.id = media_attachments.announcement_id
      )
    )
  )
);
create policy "employees can add own media"
on public.media_attachments for insert to authenticated
with check (owner_id = auth.uid() and private.is_active_employee());
create policy "employees can delete own media"
on public.media_attachments for delete to authenticated
using (owner_id = auth.uid() and private.is_active_employee());

drop policy if exists "xpressintra media read own or admin" on storage.objects;
drop policy if exists "xpressintra media delete own or admin" on storage.objects;
drop policy if exists "xpressintra media update own" on storage.objects;
drop policy if exists "xpressintra media upload own" on storage.objects;
drop policy if exists "employees can upload own media objects" on storage.objects;
drop policy if exists "employees can read own media objects" on storage.objects;
drop policy if exists "employees can read shared media objects" on storage.objects;
drop policy if exists "employees can delete own media objects" on storage.objects;
create policy "employees can upload own media objects"
on storage.objects for insert to authenticated with check (
  bucket_id = 'xpressintra-media'
  and split_part(name, '/', 1) = auth.uid()::text
  and private.is_active_employee()
);
create policy "employees can read own media objects"
on storage.objects for select to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
  and private.is_active_employee()
);
create policy "employees can read shared media objects"
on storage.objects for select to authenticated using (
  bucket_id = 'xpressintra-media'
  and private.is_active_employee()
  and exists (
    select 1 from public.media_attachments
    where media_attachments.bucket = storage.objects.bucket_id
      and media_attachments.storage_path = storage.objects.name
  )
);
create policy "employees can delete own media objects"
on storage.objects for delete to authenticated using (
  bucket_id = 'xpressintra-media'
  and owner = auth.uid()
  and private.is_active_employee()
);

-- Private logbook data.
drop policy if exists "private log own" on public.private_log_entries;
drop policy if exists "employees can read own private log" on public.private_log_entries;
drop policy if exists "employees can add to own private log" on public.private_log_entries;
drop policy if exists "employees can update own private log" on public.private_log_entries;
drop policy if exists "employees can delete from own private log" on public.private_log_entries;
create policy "employees can read own private log"
on public.private_log_entries for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can add to own private log"
on public.private_log_entries for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own private log"
on public.private_log_entries for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can delete from own private log"
on public.private_log_entries for delete to authenticated
using (user_id = auth.uid() and private.is_active_employee());

drop policy if exists "logbook settings own" on public.logbook_automation_settings;
drop policy if exists "employees can read own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can create own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can update own logbook automation settings" on public.logbook_automation_settings;
drop policy if exists "employees can delete own logbook automation settings" on public.logbook_automation_settings;
create policy "employees can read own logbook automation settings"
on public.logbook_automation_settings for select to authenticated
using (user_id = auth.uid() and private.is_active_employee());
create policy "employees can create own logbook automation settings"
on public.logbook_automation_settings for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can update own logbook automation settings"
on public.logbook_automation_settings for update to authenticated
using (user_id = auth.uid() and private.is_active_employee())
with check (user_id = auth.uid() and private.is_active_employee());
create policy "employees can delete own logbook automation settings"
on public.logbook_automation_settings for delete to authenticated
using (user_id = auth.uid() and private.is_active_employee());

-- Regulatory information remains readable only to active employees.
drop policy if exists "regulatory approved read" on public.regulatory_updates;
drop policy if exists "employees can read approved regulatory updates" on public.regulatory_updates;
drop policy if exists "employees can read monitored sources" on public.regulatory_sources;
create policy "employees can read monitored sources"
on public.regulatory_sources for select to authenticated
using (private.is_active_employee() and active = true);
create policy "employees can read approved regulatory updates"
on public.regulatory_updates for select to authenticated
using (private.is_active_employee() and status = 'approved');

notify pgrst, 'reload schema';
