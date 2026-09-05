# Rettelser og lokal belastningstest - 2026-09-05

Status: lokal kode rettet, web-build og native assets synkroniseret.
Ingen ny APK, GitHub-release eller Vercel-udgivelse er sendt her.
Versionen er fortsat 1.3.55/build 68; releaseflowet skal versionere naeste udgivelse.

## Rettelser efter testprofiler

- Ny profil: Supabase-mapperen accepterer null privateDetails. Manglende faktisk
  medarbejderprofil eller en fejl ved private profiloplysninger skjules ikke.
- Afhentning: started_location_sharing tilfoejet til pickup_tasks. Opdatering
  kraever nu bekraeftet raekke-id, saa nul opdaterede raekker ikke vises som succes.
- Kort: taeller, kollegaliste og status opdateres uden at erstatte Leaflet-kortet.
  En kontrol hvert 30. sekund paa synligt kort fjerner delinger, som ikke laengere
  kan laeses via RLS. Realtime kan ikke alene forventes at levere en raekke,
  efter at modtagerens adgang til den er udloebet eller trukket tilbage.
- Privat chat: kollegaens navn findes via conversation_members og profiler.
  Adgangskontrollen er ikke udvidet for admin/creator.
- Profilmail har fallback til brugerens session. Vigtigt: den tidligere observation
  af et tomt emailfelt i DOM-testen var ikke sikkert bevis paa en UI-fejl.
  Browservaerktoejet redigerer emailvaerdier; screenshot viste korrekt email.
- Aktive medarbejdertal bruger active, ikke blot alt andet end offboarded.
- Aktive, godkendte profiler vises ikke som manglende invitation alene fordi
  de ikke har en invitation knyttet til sig.
- Chat indhenter manglende beskeder ved abonnement/genopkobling og hvert minut
  i en synlig app. Hver samtale er begraenset til seneste 500 raekker per kald.
- Hurtige beskedhaendelser samles til en skaermopdatering med 50 ms interval.
- Gentagne kontaktknapper, dobbelt adgangsanmodningsoverskrift og interne
  placeholdertekster fjernet. Primaere kontaktgenveje bevares.
- Toast-elementet fjernes efter timeout; tidligere timers kan ikke skjule en ny toast.

## Database

Migration 20260905122655_repair_pickup_sharing_contract.sql er anvendt paa
mtfbdoajzmlgqbeiubxe. Den tilfoejer kun bool-feltet og genindlaeser schema cache.
Samme rettelse findes i schema.sql, RUN_THIS_IN_SUPABASE.sql og
RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql. Ingen rettighedspolitikker blev lempet.

## Verificeret

- npm run qa: 65 tests og produktionsbuild bestaaet.
- npm run native:sync: web-build kopieret til android-active og ios-active.
  CocoaPods og Xcode er ikke tilgaengelige paa denne Windows-maskine;
  dette er ikke et iOS-bin build eller en installationsproeve.
- Faktisk browserlogin med ny profil uden private_details: bestaaet.
- Live-note gemt fra brugerfladen og kontrolleret i pickup_tasks.steps: bestaaet.
- Privat besked sendt fra brugerfladen; korrekt modtagernavn og tidspunkt vist.
- Syntetisk, privat testposition vist med navn. Efter udloeb forsvandt den og
  taelleren skiftede fra 1 til 0 uden filterskift eller genindlaesning.
- Profilmail verificeret visuelt i screenshot; medarbejderens rettighedsfelter disabled.

## Belastningstest

Genkoer med: node qa/client-load-regression.cjs. Indgaar ogsaa i npm run qa.
Testen bruger de faktiske handlers i app.js med isoleret netvaerk, DOM og lagring.
Den sender ingen belastning til produktionsdatabasen og bruger ingen rigtige konti.

| Scenarie | Resultat |
| --- | --- |
| 100 beskeder, hver leveret to gange samtidigt | 100 unikke, 1 planlagt render, ca. 1 ms |
| 1.000 beskeder, hver leveret to gange samtidigt | 1.000 unikke, 1 planlagt render, ca. 10 ms |
| 5.000 beskeder, hver leveret to gange samtidigt | 5.000 unikke, 1 planlagt render, ca. 129 ms |
| 1.000 markoerer, 100 opdateringsrunder og efterfoelgende udloeb | 1.000 oprettet, 99.000 genbrugsopdateringer, alle fjernet, kun 1 fitBounds; ca. 155 ms |
| 100 samtidige GPS-genindhentninger | Kun 1 databaseforespoergsel planlagt |

Foer rettelsen udloeste 5.000 beskeder 5.000 renderkald. Nu samles burstet.
Tiderne er lokale logiktider med mock-rendering, ikke DOM-tegnetid, telefon-FPS,
netvaerkslatens eller en garanti for 5.000 samtidige brugere.
Den eksisterende simulerede arbejdsdag bestod ogsaa med 25 brugere,
501 realtime-beskeder, 400 offlinehandlinger og 25 GPS-raekker.

## Udvidet simulering med 100 brugere

Koert fire gange efter brugerens oenske. Alle fire bestod: 3399, 3379,
3617 og 4081 ms (hele den lokale test, ikke svartid per bruger).

- 100 profiler: 48 lastbil, 40 varebil og 12 kontor; kanaladgang kontrolleret.
- 2.000 forskellige beskeder plus en besked leveret 32 gange samtidigt:
  praecis 2.001 gemte beskeder, ingen dubletter og korrekt navn for alle 100 afsendere.
- 1.600 offlinehandlinger fordelt paa 100 isolerede koeer, med gentagne tryk,
  afbrudt behandling, genstart og netvaerksfejl. Alle kunne markeres synkroniseret
  i modellen; dette er ikke 1.600 faktiske serverleverancer.
- 100 GPS-raekker: 93 synlige kollegaer efter at egen skjulte position,
  tre foraeldede og tre udloebne positioner var filtreret fra. Egen aktive
  position kom kun med en gang.
- Opdateringsversion og afvisning af uvedkommende APK-host bestod.
- Standardtesten med 25 brugere bestod stadig (545 ms).

Genkoer i PowerShell:

```powershell
$env:QA_SIM_USERS = '100'
node qa/simulated-workday-smoke-test.cjs
Remove-Item Env:QA_SIM_USERS
```

Ingen nye konti eller testdata blev oprettet i Supabase. Dette er en lokal
klientlogiktest med 100 profiler og separate offlinekoeer, ikke 100 samtidige
telefoner, logins eller Realtime-forbindelser. Den dokumenterer korrekthed
ved denne datamaengde, men ikke serverkapacitet, RLS under samtidighed,
telefonernes hukommelsesforbrug eller browserens tegnehastighed.
Testtiden vokser mere end antallet af brugere i denne maaling; store arkiver
og gentagne opslag skal fortsat profileres foer kapacitet loves.

Aendret testfil: qa/simulated-workday-smoke-test.cjs. Ingen produktionskode
eller native assets er aendret i denne ekstra test.

## Oprydning

De to midlertidige konti er logget ud/slettet igen. Kontrol viste nul testkonti,
profiler, sessions, beskeder, GPS-raekker og afhentninger. Ingen testfiler var
uploadet. De oprindelige tre profiler har uforandret rolle/status-fordeling.
Produktionsfanens bruger blev ikke logget ud.

## Resterende begraensninger

- Fysisk Android-installation/opdatering, iPhone/Safari, baggrundsnotifikationer
  og GPS i bevaegelse er ikke verificeret i denne runde.
- Maillevering i en virkelig indbakke er ikke verificeret.
- En rigtig serverbelastningstest kraever separat stagingprojekt, maengder,
  budget og maaling af fejlprocent, svartider og Realtime-forbindelser.
- Store chatarkiver har endnu ikke fuld paginering/virtualisering. Recovery
  indhenter hoejst seneste 500 beskeder per samtale og er ikke komplet historiksync.

## Aendrede kildefiler

- app.js
- src/modules/supabase-client.js
- supabase/schema.sql
- supabase/RUN_THIS_IN_SUPABASE.sql
- supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql
- supabase/migrations/20260905122655_repair_pickup_sharing_contract.sql
- qa/supabase-client-smoke-test.cjs
- qa/testprofile-fixes-regression.cjs
- qa/client-load-regression.cjs
- Denne rapport

Genereret output: web-build, Androids public assets og iOS public assets.
