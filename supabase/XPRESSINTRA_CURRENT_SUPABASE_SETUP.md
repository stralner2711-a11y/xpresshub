# XpressIntra aktuel Supabase setup

Senest opdateret: 2026-06-03

Denne note beskriver den Supabase-opsætning, der nu er kørt direkte på projektet:

```text
mtfbdoajzmlgqbeiubxe
```

## Status

- `public.profiles` er oprettet.
- 24 centrale public-tabeller er oprettet.
- RLS er slået til på alle centrale tabeller.
- Standardkanaler er oprettet:
  - Fælleschat
  - Lastbilchat
  - Varebilchat
- Storage bucket `xpressintra-media` er oprettet som privat bucket.
- Din bruger `stralner2711@gmail.com` er oprettet i `profiles`.
- Din bruger er sat til `access_role = owner`.
- Realtime er aktiveret for beskeder, opslag, notifikationer, positionsdeling og afhentningsopgaver.

## Tabeller

Den aktuelle opsætning indeholder blandt andet:

- `profiles`
- `profile_private_details`
- `admin_audit_log`
- `employee_invitations`
- `core_settings`
- `legal_acceptances`
- `retention_policies`
- `data_subject_requests`
- `vehicles`
- `notifications`
- `notification_preferences`
- `location_shares`
- `workday_sessions`
- `pickup_tasks`
- `conversations`
- `conversation_members`
- `messages`
- `media_attachments`
- `announcements`
- `announcement_reactions`
- `announcement_comments`
- `private_log_entries`
- `logbook_automation_settings`
- `regulatory_updates`

## Vigtig drift

Mobilapp og PC-app skal begge pege på samme Supabase-projekt via:

```text
public/app-config.js
```

GitHub og Vercel leverer kun appen. Supabase er det fælles system for login, beskeder, opslag, dokumenter, profiler og roller.

## Sikkerhed der stadig skal slås til manuelt

I Supabase Dashboard bør dette slås til:

- Auth leaked password protection
- MFA for owner/admin-konti
- Kortere JWT/session-levetid efter behov
- Backup/restore-test før rigtig drift

Supabase advisors viser stadig advarsler om security-definer helper-funktioner, fordi de bruges i RLS-regler. De er nødvendige for adgangsstyringen lige nu og bør først flyttes til et privat schema i en kontrolleret migration.

