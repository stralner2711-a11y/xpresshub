# XpressIntra go-live tjekliste

Denne liste er til overgangen fra lokal test til rigtig intern brug.

## 1. Supabase

- Opret eller brug det rigtige Supabase-projekt.
- Kør den aktuelle fulde SQL-pakke fra projektet.
- Kontroller at `profiles`, `messages`, `conversations`, `location_shares`, `pickup_tasks`, `legal_acceptances`, `retention_policies` og `data_subject_requests` findes.
- Kontroller at Storage bucket `xpressintra-media` er privat.
- Kontroller at Realtime er aktiv for de tabeller, schemaet tilføjer til publication.
- Brug kun den offentlige anon/publishable key i webappen.
- Brug aldrig service-role eller secret key i browseren, GitHub, APK eller public-mapper.

## 2. Første chef/admin

- Opret første bruger i Supabase Auth.
- Ret email i `supabase/first-admin.sql`.
- Kør `supabase/first-admin.sql` i SQL editoren.
- Log ind i appen med den bruger.
- Kontroller at Chef/admin eller Creator vises korrekt under Kontrol.
- Kontroller at almindelige medarbejdere ikke kan se creator-funktioner.

## 3. App-konfiguration

- Kontroller at `public/app-config.js` peger på det rigtige Supabase-projekt.
- Kontroller at filen kun indeholder offentlig publishable/anon key.
- Log ud og log ind med en rigtig bruger.
- Test at produktionsappen ikke viser demopersoner.

## 4. Mobiltest

Test med mindst tre telefoner:

- login
- logout
- mød ind
- automatisk stop kl. 19.00 dansk tid
- GPS-tilladelse
- livekort
- fælleschat
- lastbilchat og varebilchat
- direkte beskeder
- billeder i chat
- profilbillede-upload
- opslag, kommentarer og likes
- afhentning for kollega
- personlig logbog og til/fra-valg
- app-opdatering fra gammel version til ny version

## 5. Jura og GDPR

Beslut før rigtig brug:

- hvem er dataansvarlig
- hvem er intern GDPR-kontakt
- Supabase/databehandleraftale
- formål med GPS
- om GPS kun er live eller må gemmes som historik
- om fart må gemmes eller kun vises lokalt
- slettefrister for chat, billeder, GPS, audit-log og dataanmodninger
- interne regler for billeder
- hvem må være chef/admin/creator
- hvordan fratrådte medarbejdere deaktiveres
- hvordan mistet telefon håndteres
- hvem svarer på GDPR-anmodninger

Før bred udrulning skal ledelsen godkende:

- `docs/GDPR_DOKUMENTATIONSPAKKE.md`
- `docs/DRIFT_STABILITETSPLAN.md`
- `docs/SECURITY_HARDENING.md`
- `docs/APP_KRAV_AUDIT_ANDROID_GOOGLE_PLAY_GDPR.md`
- `docs/privacy.html`
- `docs/brugsvilkaar.html`
- `docs/JURA_OPDATERINGSPLAN.md`
- `docs/KRAVSTATUS_PROFESSIONEL_APP.md`

## 6. Stabil drift

- Kør alle QA-tests.
- Kør web build.
- Kør Android sync.
- Byg APK.
- Installer APK på creators egen telefon.
- Test login, chat, livekort, profilbillede og kontrolpanel.
- Test på mindst én ekstra telefon.
- Lav kort release-note.
- Gem seneste APK og version.
- Undgå at sende opdatering ud, hvis login, chat eller GPS er brudt.

## 7. Produktion

- Host webappen på HTTPS.
- Test service worker/cache efter ny version.
- Lav en kort medarbejdervejledning med skærmbilleder.
- Aftal hvem der godkender regelnyt.
- Aftal hvem der godkender nye app-versioner.
- Brug helst Google Play Internal Testing eller anden styret distribution, når flere medarbejdere skal have appen.
- Hvis appen skal i Google Play, lav privacy policy URL og udfyld Data Safety.
- Hvis appen skal i Google Play, fjern eller lav særskilt version uden egen APK-install permission.
- Brug `docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md` som kladde til Play Console.

## 8. Klar til intern pilot når

- Supabase live-projekt er testet.
- Første creator/admin virker.
- Tre telefoner har testet login og opdatering.
- Medarbejder kan ikke se creator-knapper.
- Chatadgang er testet for lastbil, varebil og fælles.
- GPS kan startes, stoppes og begrænses.
- Profilbillede-upload virker.
- GDPR-dokumentation er godkendt af ledelsen.
- Der findes en navngivet driftsansvarlig.
