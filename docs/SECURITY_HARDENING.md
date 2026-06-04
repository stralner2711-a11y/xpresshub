# XpressIntra Security Hardening

This is the practical security baseline for running XpressIntra as an internal employee app.

## What Is Already Built In

- Supabase Row Level Security is enabled on the public app tables.
- Chat, direct messages, pickup tasks, private logbook entries, notifications and profile-private details have row-level policies.
- Uploaded media uses a private Supabase Storage bucket with a 10 MB limit and image MIME type allow-list.
- The public app config uses a publishable key only. A service role key must never be placed in `public/`, `src/`, Android assets or any browser-visible file.
- GPS sharing is voluntary and scoped by visibility mode.
- GDPR tools exist for employee information, retention periods and data requests.

## Browser And Hosting Protection

- Content Security Policy limits scripts, connections, images and frames to the expected app, map and Supabase sources.
- `X-Content-Type-Options: nosniff` reduces file type confusion attacks.
- `Referrer-Policy: no-referrer` avoids leaking internal URLs to external services.
- `X-Frame-Options: DENY` and `frame-ancestors 'none'` reduce clickjacking risk.
- Permissions Policy only allows geolocation and camera from the app itself, and disables microphone.
- The service worker bypasses Supabase, `app-config.js`, auth, REST and storage routes so live data is not accidentally cached.

## Supabase Checklist Before Real Launch

- Enable MFA on the owner/admin Supabase accounts.
- Use Supabase Auth for passwords. XpressIntra must never store employee passwords in tables, localStorage, logs, screenshots or exported files.
- Employees should create accounts only through an invitation created by creator/chef/admin.
- Keep Auth JWT expiry short enough for an employee app, especially if phones can be lost.
- Confirm the app uses only the publishable/anon key in frontend files.
- Run Supabase Security Advisor and Performance Advisor before launch.
- Review all `security definer` functions and keep their `search_path` locked.
- Keep Storage bucket `xpressintra-media` private.
- Confirm employee removal also signs the user out or revokes sessions where needed.
- Keep backups enabled and test restore once before production use.
- Keep `docs/GDPR_DOKUMENTATIONSPAKKE.md` and `docs/DRIFT_STABILITETSPLAN.md` approved before inviting more employees.
- Treat GPS/location as employee personal data and keep purpose, retention and access rules documented.

## Operational Rules

- Creator/admin accounts should be separate from normal daily driver use where possible.
- Lost phone process: deactivate user, rotate password, revoke sessions, check recent location/chat activity.
- Do not share APKs publicly. Treat the APK as internal company software.
- Have a short incident plan: who is contacted, what is disabled, what is logged, and when employees are informed.
- Review GDPR retention cleanup monthly until automatic cleanup is proven stable.
- Treat direct chats and role chats as private employee communication. Creator/admin can manage employees and settings, but should not get extra chat access unless they are a member or match the work role, for example truck driver.
- Incident handling must not expose private chat content unless leadership has a specific lawful reason and documents it.

## Password Safety Verdict

The current app is designed so employees type their password into Supabase Auth. The app sends the password to Supabase over HTTPS and stores the returned session token, not the password itself. That is the normal pattern for a mobile/web app.

This is safe enough for internal pilot use when these conditions are met:

- Supabase Auth is the only login backend.
- MFA is enabled for creator, boss/admin and GitHub/Supabase owner accounts.
- The public app config contains only the publishable/anon key.
- Lost-phone handling is agreed before inviting the whole company.
- The APK/download link is treated as internal company software.

It should not be called fully production-grade until Supabase Security Advisor has been reviewed on the live project and at least two real phones have tested login, logout, profile image upload, chat, GPS sharing and update flow.

## Remaining High-Value Improvements

- Move third-party browser libraries into the build instead of loading them from public CDNs.
- Add automated RLS tests against a real Supabase test project.
- Add audit log entries for employee creation, role changes, deleted employees, changed settings and data exports.
- Add device/session overview so creator/admin can see active sessions and revoke suspicious ones.
- Add dependency vulnerability scanning in the build flow.
