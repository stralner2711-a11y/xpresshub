# Testprofiler og brugerrejser - 5. september 2026

## Konklusion

Ikke klar til frigivelse endnu. Rigtige testkonti og brugerfladetesten fandt fejl,
som den eksisterende smoke-testpakke ikke opdager. Der er ikke rettet appkode,
lavet migrationer eller udsendt en opdatering i denne testrunde.

## Testmiljo og omfang

- Supabase: kun projektet `mtfbdoajzmlgqbeiubxe`.
- Lokal aktiv app: rodens `app.js`, Vite paa 127.0.0.1:5173, version 1.3.55/build 68.
- Fem nye Auth-konti blev oprettet gennem den offentlige signup-API med reserverede example.com-adresser.
- Tre konti blev brugt til medarbejder-, varebil- og administratortest. To yderligere konti testede gyldig og udloebet invitation.
- De tre login-testkontis mailstatus blev bekraeftet direkte i DB. Kun testadministratoren fik sin initiale rolle via SQL.
- Testadministratoren godkendte derefter medarbejderne via deres rigtige API-sessioner.
- Den inviterede testbruger blev godkendt fra appens UI. Den anden invitations-testbruger blev afvist fra UI. DB viste henholdsvis active og offboarded.
- Ingen kollegakonti blev aendret. Ingen beskeder blev sendt til eksisterende kollegaer eller faelleskanaler.
- Tommy forblev logget ind paa produktionsfanen; testlogin brugte separat localhost-origin.
- Mobilvisning blev afproevet i 390 x 844 browser-viewport. Det er ikke en fysisk telefon- eller Safari-test.

## Resultater

### API og database

Seneste koersel: **58 kontroller bestod**.
Invitationskoersel: **10 kontroller bestod**.
Eksisterende `npm run qa`: **63 smoke-tests og produktionsbuild bestod** efter testen.

Kontrollerne omfattede:

- Login med personlig kode og afvisning af ikke-bekraeftet mail.
- Nye konti er paused; klientmetadata med owner/active gav ikke privilegier.
- Pending bruger kan ikke laese chats, aktivere sig selv eller starte samtale.
- Administrator kan godkende; medarbejder kan ikke aendre egen adgangsrolle.
- Beskyttede profilfelter bevares af triggeren, selv om UPDATE kan svare uden fejl.
- Medarbejder kan ikke aendre anden profil, oprette invitation eller laese admin-audit/creator-telemetri.
- Lastbil- og varebilkanaler foelger arbejdsfunktion.
- Direkte RPC, fire samtidige startkald, korrekt medlemskab og isolering fra uvedkommende administrator.
- Beskedtekst med ae/oe/aa, faktiske danske tegn og emoji bevares sammen med afsender-id og tidspunkt.
- Andres beskeder kan ikke overskrives/slettes, afsender kan ikke forfalskes, anonym indsættelse afvises.
- Privat logbog og arbejdsdag isoleres til ejeren.
- Afhentning kan oprettes, modpart kan opdatere note, uvedkommende admin kan ikke laese; udskiftning af anden deltager blev afvist.
- GPS til bestemt testmodtager, skjult for uvedkommende, skjult efter udloeb/for gammel position, samt sletning ved stop.
- Privat PNG-upload, metadata, modtager-download, afvisning af uvedkommende, anden ejers mappe og ikke-billedfil.
- Egne notifikationer, laest-status, privatlivsvalg og afvisning af spoofet notifikation til anden bruger.
- Eksisterende medarbejdertoken mister chatadgang efter administrativ pause.
- Gyldig invitation blev consumed med accepted_at/used_by og korrekt profil; stadig godkendelseskrav.
- Udloebet invitation tildelte ikke inviterede rettigheder og blev ikke consumed.
- Administrator kunne ikke invitere en owner.

Realtime-forbehold: Foerste koersel modtog ingen besked-event inden for 10 sekunder,
trods SUBSCRIBED og en gemt/laesbar besked. Gentest leverede praecis en event.
Det er ikke dokumentation for fejlfri cold-start/genforbindelse. Publication indeholder
messages og publicerer INSERT. Den foerste observation skal bevares som stabilitetsfund.

Foerste test af selvpromovering forventede en API-fejl og meldte derfor falsk negativ.
Kontrol af den gemte rolle og trigger viste korrekt beskyttelse. Testen blev rettet
til at kontrollere den faktiske rolle, ikke kun HTTP-fejlen.

### Faktisk brugerflade

- Medarbejderlogin, forside, Arbejde, Beskeder, Live-kort, Mere, profil, Information og adminadgang er gennemgaaet med testkonti.
- UI-send af privat besked med danske tegn/emoji er verificeret i public.messages.
- UI-profilgemning med `QA Chauffør ÆØÅ` er verificeret i public.profiles; email og employee-rolle blev bevaret.
- UI-Moed ind gemte ends_at = 19:00 Europe/Copenhagen, gps=false og ingen location_shares-raekke. Slut dag blev efterfoelgende udfoert.
- Medarbejdermenu viste ikke administration/creator; rettighedsfelter var disabled.
- Adminmenu havde administration, men ikke creatorens Appens drift.
- Soegning paa CMR gav to resultater, og Ryd virkede i den lokale kode.
- Testmarkoer kom frem ved databaseopdatering uden reload, men statistikken blev ikke opdateret foer filterskift.

## Fejl til rettelsesrunden

| Prioritet | Fund | Evidens og anbefaling |
| --- | --- | --- |
| P1 | Ny profil kan ikke indlaese appen | UI viste `Cannot read properties of null (reading 'emergency_contact')`. `src/modules/supabase-client.js:34` derefererer privateDetails uden null-kontrol. `handle_new_user` opretter kun private_details ved gyldig invitation. Rodens fallback er null-sikker, men modulet bruges foerst. Ret mapperen og test manglende ekstra profilraekke. |
| P1 | Afhentningens live-noter fejler i UI | `Could not find the 'started_location_sharing' column of 'pickup_tasks' in the schema cache`. Appens payload ved `app.js:3074` inkluderer feltet, men den faktiske tabel mangler det. Sammenhold den fulde payload med live-skema og synkroniser samlet SQL ved rettelse. |
| P2 | Kortets taeller og liste bliver foraeldede | En ny testmarkoer var synlig, men UI sagde 0 personer/ingen deler. Filterskift gav korrekt 1 person med navn. Gennemgaa `handleSupabaseLocation` og opdater stats/liste uden scroll-reset eller re-zoom. |
| P2 | Direkte samtale mangler modtagerens navn | Liste og samtaleheader viste `Direkte samtale`/DS i stedet for testkollegaens navn. Brug conversation_members og profiler, uden at svække adgangskontrollen. |
| P2 | Arbejdsmail vises tom i profilen | Testkontoens email fandtes i Auth og profiles, men Arbejdsmail-feltet var tomt. Gemning slettede ikke mailen i DB. Ret visningsbindingen. |
| P2 | Adminens aktive-tal medregner afventende profiler | Adminvinduet viste 8 aktive profiler/medarbejdere, selv om tre af de otte var paused. Brug reelt employment_status i tal og tekster. |
| P2 | Realtime cold-start kan miste foerste synlige opdatering | Foerste API-koersel missede event; gentest bestod. Test subscribe/initial-fetch-race, reconnect og sikker indhentning af manglende beskeder. |
| P2 | Onboarding viser forkert behov for invitation | Aktive testkonti og eksisterende owner vises som Mangler invitation. Onboarding skal skelne godkendt direkte oprettelse fra ubrugt invitation. |
| P3 | Gentagelser og tekniske tekster | Kontaktgenveje gentages, Adgangsanmodninger-heading vises dobbelt, UI indeholder placeholderen Tilfoej intern tjekliste og teksten Store knapper, faa valg. Ryd op uden at flytte velkendte primaere funktioner. |
| P3 | Toasttekst haenger ved | Den gamle afhentningsfejl blev ved med at staa i DOM paa andre sider; efter logout var tidligere handlingstekst stadig i DOM. Undersoeg synlighed, timeout og oprydning ved navigation/login-skift. |

For at fortsaette efter loginfejlen blev der kun tilfoejet en tom private_details-raekke
til testmedarbejderen og testadministratoren. Dette var en **testfixture**, ikke et
login-fix. Begge raekker blev slettet sammen med kontiene.

## Ikke verificeret

- Levering/modtagelse af bekraeftelsesmail i en rigtig indbakke; signup-APIens succes er ikke bevis for levering.
- Alle former for invitation replay, samtidige invitation-redemptions og redirect-links paa fysisk enhed.
- Android-installation, systemnotifikationer i baggrunden, iPhone/Safari/PWA og fysisk GPS i bevaegelse.
- En komplet penetrationstest eller juridisk GDPR-godkendelse.
- Alle filformater, store billeder, kamera/HEIC-konvertering og dokument-downloads.
- Vellykket udsendelse/opdateringsinstallation eller rollback paa telefon.
- Oprettelse/redigering/sletning af faelles kontoropslag blev ikke udfoert i production for ikke at genere kollegaer.

## Oprydning - verificeret

Alle fem testkonti er slettet fra auth.users og public.profiles.
Testfiler blev slettet gennem Storage API inden kontiene blev fjernet.
Kontrolquery viste **0** testkonti, profiler, invitationer, chats, beskeder, GPS,
afhentninger, arbejdsdage, private profiler, mediemetadata, Storage-filer,
notifikationer, testrelaterede admin-audit-raekker og Auth-sessioner.

De oprindelige tre profiler bestaar med samme rolle/status-fordeling:
en aktiv owner, en aktiv employee og en paused employee.
Supabases egne sikkerheds-/infrastrukturlogs kan stadig indeholde spor af testrequests;
disse systemlogs blev ikke manipuleret eller lovet slettet.

Testbrowseren blev logget ud, mobilviewport nulstillet og lokal Vite-server stoppet.
Produktionsfanens login er bevaret. Ingen release eller APK blev bygget/udsendt her;
web-produktionsbuild indgik kun som QA-kontrol.

## Filer fra denne runde

- `tools/live-fixture-audit.cjs`: selvstaendig API-test med eksisterende, eksplicitte testfixtures. Fjerner egne Storage-filer; Auth/DB-oprydning kraever efterfoelgende kontrolleret cleanup. Maa ikke bruges paa rigtige brugere.
- `tools/live-invitation-audit.cjs`: selvstaendig invitationstest og manifest til cleanup.
- `qa/live-fixture-results-2026-09-05.json`: 58 seneste kontroller, uden passwords/tokens.
- `qa/live-invitation-results-2026-09-05.json`: 10 invitationskontroller og de nu slettede test-id'er.
- Denne rapport. De tidligere fund staar fortsat i `QA_BROAD_2026-09-05.md`.

Testscripts er med vilje ikke med i automatisk npm-run-qa: de opretter rigtige
testdata og skal koeres kontrolleret med dokumenteret oprydning.
