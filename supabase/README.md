# Supabase setup

XpressIntra runs locally in demo mode today. To enable shared employee data:

1. Create a Supabase project.
2. Run `schema.sql` in the Supabase SQL editor.
3. Add the Supabase project URL and public anon/publishable key under `Mere` -> `Indstillinger` in the webapp.
4. Create employees in Supabase Auth. The `on_auth_user_created` trigger creates the matching profile row.

The webapp now uses Supabase Auth when configuration is present, and keeps local demo mode when it is not. Login, profiles, employees, vehicles, notifications, announcements, private logbook entries, core settings and logbook automation settings are wired for the first online bootstrap.

Never put `service_role` or secret keys in the browser. The app only accepts the public key, and RLS remains the real access control.

The schema keeps private logbook entries private with Row Level Security. Location sharing is opt-in: a row only exists while the employee actively shares their position.

Because Supabase changed Data API defaults in 2026, `schema.sql` explicitly grants authenticated users Data API access after RLS is enabled. Without those grants, rows can be correctly protected by RLS but still unreachable from the browser client.

`regulatory_sources` stores the official pages monitored by a scheduled backend task. When content changes, the backend should create a draft in `regulatory_updates`. Only approved updates are readable by employees. Draft review and approval must be implemented as an administrator-only backend action before production use.

## Rule monitoring

The Edge Function in `functions/check-regulatory-sources` checks the seeded official sources and creates a draft when normalized page content changes.

1. Deploy the function to Supabase.
2. Set a long random `CRON_SECRET` for the function.
3. Invoke the function once per day from Supabase Cron or another trusted scheduler with `Authorization: Bearer <CRON_SECRET>`.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
5. Add an administrator review screen before enabling push notifications.

The monitor deliberately does not publish legal summaries automatically. A website can change for many reasons, so detected changes must be reviewed before employees are notified.
