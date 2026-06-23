# Databaseoprydning og struktur

Dato: 2026-06-23

## Kort vurdering

XpressIntra-databasen er grundlæggende sundere nu: fremmede projektobjekter er fjernet, alle app-tabeller har RLS, og direkte tabeladgang for ikke-loggede brugere er lukket. Der er stadig noget strukturarbejde, der bør gøres i kontrollerede runder, især omkring gamle repair-filer, RLS-performance og tydeligere adskillelse mellem aktiv schema-kilde og historiske nødrettelser.

## Status lige nu

- Live Supabase-projektet indeholder XpressIntra-tabeller, ikke TruckLex-tabeller.
- Alle public app-tabeller har RLS slået til.
- `anon` har ikke direkte tabeladgang.
- `authenticated` har kun almindelig Data API-adgang, som stadig styres af RLS.
- Storage-bucket `xpressintra-media` er privat og begrænset til billedfiler.
- Direkte-besked RPC er nu lukket for `anon` og kun givet til `authenticated`.

## Rettet i denne runde

- Live migration: `lock_public_rpc_execute_to_authenticated_20260623`.
- `public.start_direct_conversation(uuid)` er lukket for `public, anon`.
- `public.start_direct_conversation_v2(uuid)` er lukket for `public, anon`.
- Verificeret live: `anon` kan ikke længere execute de to RPC-funktioner, `authenticated` kan stadig.
- Lokale SQL-filer er opdateret, så samme sikkerhed gælder ved fremtidigt setup:
  - `supabase/schema.sql`
  - `supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql`
  - `supabase/REPAIR_DIRECT_MESSAGES.sql`
- Release-checket stopper nu, hvis direkte-besked RPC igen bliver åben for ikke-loggede brugere:
  - `tools/supabase-release-check.ps1`

## Tabeller der er aktive i appen

Disse tabeller bruges direkte af app-koden og skal bevares:

- `profiles`
- `profile_private_details`
- `admin_audit_log`
- `employee_invitations`
- `core_settings`
- `legal_acceptances`
- `data_subject_requests`
- `vehicles`
- `notifications`
- `notification_preferences`
- `location_shares`
- `workday_sessions`
- `pickup_tasks`
- `conversations`
- `messages`
- `media_attachments`
- `announcements`
- `announcement_reactions`
- `announcement_comments`
- `private_log_entries`
- `logbook_automation_settings`

## Tabeller der ikke bruges direkte af frontend

Disse skal ikke slettes automatisk. De har en backend-/compliance-rolle eller bruges indirekte:

- `conversation_members`: bruges af direkte besked-RPC og RLS, selvom frontend ikke kalder tabellen direkte.
- `retention_policies`: GDPR/driftspolitikker. Bør kobles mere synligt til driftpanelet.
- `regulatory_sources`: bruges af Edge Function til regelovervågning.
- `regulatory_updates`: bruges af Edge Function og senere admin-godkendelse af regelnyt.

## Anbefalet næste struktur

1. Gør `supabase/schema.sql` til den primære kilde.
2. Behold `RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql` som samlet installationsfil.
3. Flyt gamle enkeltstående repair/fix-filer til en arkivmappe, når deres indhold er bekræftet indarbejdet i schema.
4. Lav én ny mappe til aktive migrationsnoter, fx `supabase/migrations-docs`, hvis vi vil dokumentere live-migrationer uden at blande dem med filer brugeren skal køre.
5. Reducér dublerede RLS policies i en senere migration, så Supabase-advisoren får færre performance-advarsler.
6. Optimér RLS-udtryk med `(select auth.uid())` / `(select private.is_admin())`, hvor det ikke ændrer sikkerhedslogik.

## Resterende Supabase-advisor punkter

- `authenticated` kan execute `SECURITY DEFINER` direkte-besked RPC. Det er bevidst lige nu, fordi appen skal kunne starte direkte samtaler via en kontrolleret funktion. Funktionen tjekker login, modtager og medlemskab. Den bør senere gennemgås igen og eventuelt erstattes af en mere snæver backend/Edge Function, hvis vi vil fjerne advisor-advarslen helt.
- Leaked password protection skal slås til i Supabase Auth-dashboard, hvis planen tillader det.
- MFA-advarslen er en Supabase Auth-indstilling. Den påvirker især admin/owner-konti.
- RLS-performance-advarsler handler primært om at omskrive policies til `(select auth.uid())` og samle dublerede permissive policies. Det er ikke en akut sikkerhedsfejl, men bør være næste databaseoptimeringsrunde.
- Unused index-advarsler skal ikke ryddes endnu. Databasen har få rigtige brugere, så statistikgrundlaget er for tyndt.

## Må ikke gøres blindt

- Slet ikke `conversation_members`; direkte beskeder afhænger af den.
- Slet ikke `regulatory_sources` eller `regulatory_updates`, før regelovervågning bevidst fjernes.
- Slet ikke gamle repair-filer, før release-check og fuld schema indeholder samme rettelse.
- Fjern ikke indeks kun fordi Supabase kalder dem unused. Databasen har stadig få rigtige brugere, så statistikken er ikke moden nok.

## Prioriteret oprydningsplan

1. Luk sikkerheds-advarsler først.
2. Saml gamle repair-filer i arkiv, når de er dækket af schema.
3. Ryd RLS-policy navne og dubletter op.
4. Optimér RLS-performance.
5. Lav driftpanel-visning for databasestatus: tabeller, RLS, seneste migration, storage-status og advisor-advarsler.
