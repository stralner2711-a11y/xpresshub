alter table public.announcements
  add column if not exists updated_at timestamptz;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('bug', 'idea', 'design', 'content')),
  area text not null,
  message text not null check (length(message) between 1 and 4000),
  app_version text,
  route text,
  status text not null default 'open' check (status in ('open', 'in_review', 'completed', 'rejected')),
  handled_by uuid references public.profiles(id) on delete set null,
  handled_note text,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists support_requests_created_at_idx
  on public.support_requests (created_at desc);
create index if not exists support_requests_status_idx
  on public.support_requests (status, created_at desc);

alter table public.support_requests enable row level security;

grant select, insert, update, delete on public.support_requests to authenticated;

drop policy if exists "support own read" on public.support_requests;
drop policy if exists "support own insert" on public.support_requests;
drop policy if exists "support admin update" on public.support_requests;
drop policy if exists "support admin delete" on public.support_requests;

create policy "support own read"
on public.support_requests for select to authenticated
using (user_id = auth.uid() or private.is_admin());

create policy "support own insert"
on public.support_requests for insert to authenticated
with check (user_id = auth.uid() and private.is_active_employee());

create policy "support admin update"
on public.support_requests for update to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "support admin delete"
on public.support_requests for delete to authenticated
using (private.is_admin());

notify pgrst, 'reload schema';
