-- Paused or offboarded accounts must not retain operational access through an old session.

drop policy if exists "employees can read own workday sessions" on public.workday_sessions;
create policy "employees can read own workday sessions"
on public.workday_sessions for select to authenticated using (
  user_id = auth.uid() and private.is_active_employee()
);

drop policy if exists "pickup participants can read tasks" on public.pickup_tasks;
create policy "pickup participants can read tasks"
on public.pickup_tasks for select to authenticated using (
  private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid())
);

drop policy if exists "employees can create own pickup tasks" on public.pickup_tasks;
create policy "employees can create own pickup tasks"
on public.pickup_tasks for insert to authenticated with check (
  private.is_active_employee() and driver_id = auth.uid() and driver_id <> colleague_id
);

drop policy if exists "pickup participants can update tasks" on public.pickup_tasks;
create policy "pickup participants can update tasks"
on public.pickup_tasks for update to authenticated
using (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()))
with check (private.is_active_employee() and (driver_id = auth.uid() or colleague_id = auth.uid()));

notify pgrst, 'reload schema';
