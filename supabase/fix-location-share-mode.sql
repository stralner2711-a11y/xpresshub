-- Fix for already-created Supabase projects where the old APK sends
-- Danish share_mode values: 'manuel' and 'arbejdsdag'.

alter table public.location_shares
  drop constraint if exists location_shares_share_mode_check;

alter table public.location_shares
  add constraint location_shares_share_mode_check
  check (share_mode in ('manual', 'workday', 'manuel', 'arbejdsdag', '15 min', '30 min', '60 min', 'pickup'));
