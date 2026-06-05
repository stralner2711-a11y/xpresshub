# XpressIntra beta QA-rapport v1.3.19

Dato: 2026-06-05

## Formaal

Denne runde er en stabiliserings- og sikkerhedsrunde til lukket test med 1-5 kollegaer. Fokus er Supabase/RLS, invitationer, demo/adskillelse, chat, livekort, update-flow og PWA/APK-grundlag.

## Rettet i denne runde

- Live Supabase er strammet, saa admin/dispatcher ikke laengere faar generel laeseadgang til samtaler.
- Direkte beskeder er nu beskyttet af samtalemedlemskab: kun deltagere kan laese direkte samtaler.
- Truck- og varebilchat styres af brugerens arbejdsfunktion/koeretoejstype, ikke af at brugeren er admin.
- Mediefiler/billeder i chat foelger nu samtalens adgang i stedet for bred admin/dispatcher-adgang.
- Gamle brede Storage policies for mediefiler er fjernet fra live Supabase.
- `media_attachments.visibility` er tilfoejet live, saa live database og fuld SQL-pakke matcher.
- Fuld SQL-pakke og repair SQL er opdateret, saa samme rettelser bevares ved fremtidige koersler.
- QA-testen er udvidet, saa gamle brede media policies og inaktiv chat-adgang ikke sniger sig tilbage.

## Supabase/RLS bekraeftelse

Bekraeftet i live Supabase:

- Alle public-tabeller har RLS slaaet til.
- `employee` kan ikke aendre egen rolle eller goere sig selv admin, fordi profil-triggeren bevarer beskyttede felter ved egen opdatering.
- `employee` kan ikke oprette invitationer; `employee_invitations` er admin/owner-styret.
- `employee` kan ikke se admin-audit eller invitationer.
- `employee` kan ikke slette andres centrale data via RLS; chatbeskeder har ingen almindelig update/delete policy.
- Private beskeder kan kun laeses via samtalemedlemskab.
- GPS-data deles kun efter brugerens valgte synlighed, maalgruppe og aktiv deling.
- Admin/owner kan administrere relevante driftsting, men private direkte samtaler er ikke aabne for admin alene.
- Systemet er stadig en single-company beta. Hvis appen senere skal bruges af flere firmaer, skal der tilfoejes `company_id` paa alle relevante tabeller.

## Invitation

Bekraeftet:

- Standardkode-flowet er bevaret.
- Oprettelse kraever gyldigt `invitation_id`.
- Invitationen er bundet til email.
- Invitationen skal vaere `pending`.
- Invitationen skal vaere ikke-udloebet via `expires_at`.
- Brugt invitation markeres med `accepted_at`, `used_by` og status `accepted`.
- Der er unik regel mod flere aktive pending invitationer til samme mail.
- Standardkoden alene giver ikke adgang uden et gyldigt invitationslink.

## Production vs demo/localStorage

Bekraeftet i kode og QA:

- Demo-mode er eksplicit opt-in.
- Production starter uden demopersoner, demobeskeder og demobiler.
- Production har bundlet Supabase public config og bruger ikke demo-login.
- Passwords gemmes ikke i localStorage/sessionStorage.
- Lokal lagring bruges stadig til UI/session/fallback-visning, men kritiske adgangsregler ligger i Supabase/RLS.

Vurdering:

- God nok til lukket beta.
- Naeste forbedring er at goere fejl ved manglende Supabase-tabeller endnu mere tydelige pr. funktion, saa appen ikke kan virke 'halv-online'.

## CDN/lokal pakning

Status:

- Supabase CDN indlaeses kun en gang.
- Leaflet hentes stadig eksternt fra CDN i `index.html` og dynamisk i appen.
- `leaflet` og `@supabase/supabase-js` er ikke installeret lokalt i `node_modules` lige nu.

Anbefaling:

- Foer bred drift boer Leaflet og Supabase pakkes lokalt i Vite-buildet. Det vil give bedre drift ved daarlig forbindelse og faerre eksterne afhaengigheder.

## Testet

- Live Supabase RLS- og policy-gennemgang.
- Live Supabase invitationsstruktur og dubletkontrol.
- Live Supabase chat/media privacy hardening.
- Supabase Security Advisor.
- Supabase Performance Advisor.
- Lokal production build.
- Fuld QA: 38 smoke tests plus build.
- Service worker scan: ingen `indep.html` eller `ppressbudet`.
- Dobbelt Supabase-import er ikke fundet.
- Demo/production-adskillelse via automatiske tests.

## Bestaar

- Build bestaar.
- 38 automatiske QA-tests bestaar.
- RLS er aktiveret paa alle public-tabeller.
- Invitationer er bundet til link/id/email og kan udloebe.
- Private chatbeskeder er strammet.
- Chat-media er strammet.
- GPS-tabellen findes, har RLS og maalgruppefelter.
- Update/service worker er fortsat ren for de gamle fejl.

## Fejler / kendte begraensninger

- Fysisk realtest med 2 rigtige brugere er ikke koert i denne session.
- Chat live-test med 2 telefoner mangler stadig.
- Livekort realtest med 2 telefoner mangler stadig.
- Supabase Security Advisor anbefaler stadig leaked-password protection.
- Supabase Security Advisor anbefaler flere MFA-metoder.
- Supabase Performance Advisor melder RLS-performanceoptimeringer og ubrugte indeks. Det er ikke beta-blocker for 1-5 kollegaer, men boer ryddes inden bred drift.
- Leaflet/Supabase er ikke pakket lokalt endnu.

## Klarhedsvurdering

Appen er klar til lukket beta med 1-5 kollegaer, hvis testen holdes kontrolleret:

1. Creator.
2. En lastbilchauffoer.
3. En varebilchauffoer.
4. Eventuelt en admin/chef-testprofil.

Foer bredere udrulning skal der gennemfoeres fysisk 2-bruger test af chat, direkte beskeder, billeder og livekort, og Supabase Auth-advarslerne boer afklares.
