# Realistisk netvaerkstest - 2026-09-05

## Vurdering

De afgraensede realtests viser hurtige svartider og korrekt adgangskontrol i
de testede forloeb. Der er stadig et aabent stabilitetsfund: den foerste
private besked kom ikke som Realtime-event inden for 30 sekunder efter
SUBSCRIBED, selv om den var gemt og laesbar. Den efterfoelgende flerklienttest
bestod. Dette er ikke en fejlfri releasegodkendelse eller en kapacitetsgaranti.

## Miljoe og sikkerhedsafgraensning

- Rigtig Supabase: mtfbdoajzmlgqbeiubxe, ingen andre projekter aendret.
- Intet separat XpressIntra-stagingprojekt blev fundet.
- Tre nye, midlertidige Auth-konti, almindelig public signup og passwordlogin.
- Testemails under example.com blev bekraeftet administrativt; maillevering
  og klik i bekraeftelsesmail er derfor ikke testet.
- Kun testadministratoren blev klargjort direkte i DB. Denne administrator
  godkendte efterfoelgende de to testmedarbejdere via den almindelige API/RLS.
- Private testsamtaler, syntetisk GPS kun til testmodtager, et minimalt PNG.
- Ingen opslag eller beskeder i kollegaernes faelleskanaler.
- 10 samtidige rigtige WebSocket-forbindelser: otte med testmodtagerens
  session og to med uvedkommende testadmins session. Tre identiteter i alt,
  ikke 10 eller 100 forskellige samtidige brugere.
- 50 private chatlaesninger, hoejst fem samtidige; 30 beskeder med mindst
  500 ms pause mellem hver. Ingen stresstest mod kapacitetsgraensen.

## Funktionelle API-forloeb

57 bestaaet, 1 fejlet. Raadata: qa/realistic-functional-results-2026-09-05.json.

Bestaaet: passwordlogin, afventende profil uden chatadgang, admin-godkendelse,
beskyttelse mod selvpromovering, kanaladgang, privat samtale og samtidige
startforsog, beskedens tekst/afsender/tid, afvisning af fremmede og falsk
afsender, arbejdsdag, privat logbog, afhentning/live-noter, GPS-privatliv og
udloeb, billed-upload/download/RLS, egne notifikationer, privatlivsvalg og
oejeblikkelig afskaering af chatadgang ved administrativ pause.

Fejl: foerste Realtime-levering udeblev. Testen blev ikke aendret til at
ignorere denne fejl. Databasen indeholder messages i supabase_realtime og
read-policyen bruger private.can_access_conversation. Den efterfoelgende
test viser, at live-levering og privatliv kan fungere, men beviser ikke
at problemet ved foerste abonnement er loest.

Realtime-logs viste blandt andet nedlukning ved ingen aktive abonnementer
og efterfoelgende initialisering. Opstarts-/abonnementsrace er derfor en
hypotese, ikke en dokumenteret rodaarsag. Ingen RLS-regler blev lempet.

## Maalinger med rigtige forbindelser

Raadata: qa/realistic-network-results-2026-09-05.json. Alle 14 kontroller bestod.

| Maaling | Antal | Median | 95-percentil | Maksimum |
| --- | --- | --- | --- | --- |
| Login | 3 | 162 ms | 468 ms | 468 ms |
| Laes private beskeder | 50 | 59 ms | 247 ms | 282 ms |
| Gem besked | 30 | 57 ms | 78 ms | 84 ms |
| Fra sendestart til Realtime-modtagelse | 240 | 313 ms | 560 ms | 572 ms |

Hver af de otte deltagerforbindelser modtog praecis 30 unikke beskeder.
Begge uvedkommende adminforbindelser modtog nul, og adminens REST-laesning
returnerede heller ikke private beskeder.

En modtagerforbindelse blev afbrudt, mens tre beskeder blev gemt. Den modtog
ingen events under afbrydelsen. Efter genopkobling fandt en latest-500-forespoergsel
alle tre paa 107 ms. Det verificerer serverens indhentningsvej, ikke at
en fysisk telefon automatisk viste dem eller at Realtime gensender historik.

## Begraensninger og naeste tekniske kontrol

- Der blev ikke koert 100 samtidige Auth-identiteter eller telefoner mod serveren.
- Browserlayout, telefon-FPS, langsom mobilradio, baggrundsnotifikationer,
  batteri og installation blev ikke maalet i denne netvaerksrunde.
- Den tidligere lokale 100-bruger-simulering supplerer, men erstatter ikke,
  disse netvaerksmaalinger.
- Foerste Realtime-event skal reproduceres og testes sammen med appens
  indhentning ved opstart/genopkobling. Den eksisterende minuttimer kan
  afboede et tabt event, men er ikke dokumentation for oejeblikkelig levering.
- Kapacitetstest med 100 unikke brugere kraever et isoleret stagingmiljoe
  med tilsvarende databaseplan og maaling af fejlrate, CPU og forbindelser.

## Oprydning og filer

Alle testforbindelser blev lukket og Auth-sessioner logget ud. PNG-testfilen
blev slettet gennem Storage API; bagefter var der nul Storage-filer i
testmapperne. Den private testsamtale, test-auditdata og de tre Auth-brugere
blev slettet med identitetskontrol. Kontrolquery viste nul testbrugere,
profiler, beskeder og sessions. De oprindelige tre profiler har uforandret
rolle/status-fordeling. Supabases systemlogs er ikke slettet.

Nye filer: tools/realistic-network-audit.cjs, de to resultatfiler og denne rapport.
tools/live-fixture-audit.cjs har faaet valgfri rapportsti, saa tidligere
testresultater ikke bliver overskrevet. Scripts kraever eksplicitte testfixtures
via miljoevariabel; passwords/tokens er ikke gemt i kildekode eller rapporter.
De live scripts fjerner ikke Auth-konti selv; kontrolleret DB-oprydning er
obligatorisk efter koersel. De indgaar ikke i automatisk QA.

Ingen produktionskode, schema, native assets eller release blev aendret her.
