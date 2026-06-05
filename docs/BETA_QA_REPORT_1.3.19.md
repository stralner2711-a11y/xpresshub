# XpressIntra beta QA-rapport v1.3.19

Dato: 2026-06-05

## Formål

Denne runde stabiliserer XpressIntra til lukket test med 1-5 kollegaer. Fokus er sikkerhed, adgang, invitationer, chat, livekort, opdatering og PWA/APK-grundlag.

## Rettet

- Version løftet til `1.3.19` / build `32`.
- Android, web og iPhone/PWA-assets er synkroniseret til samme version.
- Service worker cache er bumpet til `xpressintra-v80-beta-stabilisering`.
- Service worker bruger `index.html` og `xpressbudet-logo-transparent.png`.
- Gamle cache-fejl `indep.html` og `ppressbudet-logo-transparent.png` er ikke længere i build-output.
- Supabase CDN indlæses kun én gang i `index.html`.
- Invitationsflowet er bevaret som standardkode-flow, men signup bindes nu til det personlige invitations-id.
- Supabase SQL markerer invitationer med `expires_at`, `accepted_at` og `used_by`.
- Supabase SQL kræver pending invitation, ikke-udløbet invitation og matchende invitation-id.
- Live Supabase er migreret med de samme invitations- og pickup-kolonner.
- Dublet-invitationer er ryddet ved at beholde nyeste pending invitation pr. mail.
- Manglende foreign-key indeks er tilføjet for invitationer og announcement-media.
- Downloadside peger direkte på nyeste Android APK for `v1.3.19`.
- QA-testene er opdateret, så invitation, RLS, service worker og version ikke kan glide tilbage.

## Testet

- Produktionsbuild med Vite.
- Fuldt QA-run: 38 smoke tests plus build.
- Supabase release-check mod lokal SQL/config.
- Supabase projektstatus via Supabase-værktøj.
- RLS aktiveret på centrale public-tabeller.
- Android assets sync.
- iPhone/PWA assets sync.
- Service worker scan af web, Android og iPhone/PWA output.

## Består

- Login-konfiguration peger på korrekt Supabase-projekt.
- Ingen service-role eller hemmelige Supabase-nøgler i app-config eller appkode.
- Almindelig oprettelse med standardkode vises kun via invitationslink.
- Medarbejder kan ikke se admin/creator-funktioner i frontend-tests.
- Private/direct chat går gennem conversation-members/RLS-model.
- Livekort bruger `location_shares` med RLS, udløb og målgruppevalg.
- Update-systemet matcher `1.3.19` / build `32`.
- Rollback peger på `1.3.18`.

## Kendte begrænsninger

- Supabase Security Advisor melder stadig:
  - Leaked password protection er ikke slået til.
  - Flere MFA-metoder anbefales.
- Supabase Performance Advisor melder stadig RLS-performanceoptimeringer og nogle ubrugte indeks. Det er ikke en beta-blocker for 1-5 kollegaer, men bør ryddes før bred drift.
- Android APK kunne ikke bygges i Codex-sessionen, fordi Gradle skulle downloades og netadgang er blokeret her. App-build og Android-sync er grønt.
- iOS native build er ikke testet på Windows. iPhone/PWA-assets er synkroniseret.
- Rigtig flerbruger-test med 2-3 telefoner mangler stadig.

## Klarhedsvurdering

Appen er klar til lukket teknisk beta med 1-5 kollegaer, hvis:

- APK bygges via den normale opdateringsfil eller Android Studio på maskinen med netadgang.
- Første test holdes lille: creator + 1 lastbilchauffør + 1 varebilchauffør.
- Chat, direkte besked, invitation, livekort og opdateringsboks prøves på rigtige telefoner.

Ikke klar endnu til bred udrulning til hele firmaet, før MFA/password-advarsler i Supabase er afklaret og flerbruger-testen er gennemført.
