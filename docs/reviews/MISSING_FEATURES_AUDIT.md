# XpressIntra mangelliste og anbefalinger

Dato: 31. maj 2026

Denne gennemgang samler det, der stadig mangler eller bør bygges, før XpressIntra kan bruges som et seriøst internt medarbejdersystem. Listen er delt op efter hvad der er nødvendigt før pilotdrift, hvad der bør komme kort efter, og hvad der kan vente.

## Kort konklusion

Demoen har de rigtige hovedideer: social startside, intern chat, adskilte køretøjskanaler, frivillig GPS, live-kort, profiler, logbog, billeder, information og chef/admin. Det største hul er ikke flere knapper. Det største hul er rigtig online drift, databeskyttelse, notifikationer, serverstyret adgang og en mere driftssikker hverdag for kontor, disponenter og chauffører.

## Kritisk før rigtig intern pilot

### 1. Rigtigt login og fælles data

Demoen gemmer stadig lokalt i browseren. Det er fint til prototype, men ikke til medarbejdere.

Mangler:

- Supabase Auth eller tilsvarende medarbejderlogin.
- Rigtige brugerprofiler i databasen.
- Realtime chat, opslag og GPS.
- Serverstyrede roller og adgang.
- Mulighed for at lukke en bruger med det samme ved fratrædelse.

Hvorfor det er vigtigt:

Hvis data kun ligger lokalt, kan medarbejderne ikke se det samme, og sikkerhedsreglerne er kun demo-regler.

### 2. Servertest af adgangsregler

Appen har en god adgangsmodel, men den skal testes på databasen.

Mangler:

- RLS-test for medarbejder, varebil, lastbil, disponent og chef/admin.
- Test der beviser, at chef/admin ikke kan læse lastbilchat eller varebilchat.
- Test der beviser, at private logbogsnoter kun kan læses af ejeren.
- Test der beviser, at billeder kun kan læses af dem, der har adgang til konteksten.

### 3. Rigtig billedlagring

Billeder ligger i demoen som browserdata. Det er ikke nok til online drift.

Mangler:

- Privat Storage-bucket.
- Maks filstørrelse og filtypekontrol på serveren.
- Thumbnail-visning, så appen ikke bliver tung.
- Slettefrister for billeder.
- Regler for billeder med kunder, dokumenter, nummerplader og uvedkommende personer.

### 4. Push-notifikationer

En intern medarbejderapp bliver svag, hvis vigtige beskeder kun ses, når man åbner appen.

Mangler:

- Push for direkte beskeder.
- Push for vigtige kontoropslag.
- Push for godkendt regelnyt.
- Rolige standarder, så fælleschat ikke larmer hele dagen.
- Stilleperiode.
- Den lokale demo har nu prioritet, daglige påmindelser, stille tid og "marker alt som læst"; næste trin er rigtig browser-push.

### 5. Driftssikre afhentningsopgaver

Afhentning for kollega er en stærk funktion, men bør være mere opgaveorienteret.

Status efter første demo-pakke:

- Demoen har nu statustrin: startet, fundet, hentet, afleveret og kan ikke finde.
- Statusændringer gemmes lokalt og skaber interne notifikationer.
- Afhentningsopgaver 2.0 har nu sted, aflevering, reference, prioritet, tjekliste, tidslinje og lokal historik.
- Opgaven kan stadig udbygges med rigtig serverhistorik og bedre billedflow.

Mangler før online drift:

- Rigtig serverhistorik for opgaven og delt status mellem de to medarbejdere.
- Billede af varen eller stedet med serverlagring.
- Automatisk besked til kollegaen.
- Del kun position med den valgte kollega.
- Historik uden detaljeret GPS-spor.

## Bør bygges som næste lag

### 6. "Mine data"

Personbeskyttelsen er tænkt ind, men brugeren mangler et praktisk sted.

Status efter første demo-pakke:

- Demoen har nu en "Mine data"-side med profil, GPS, logbog, billeder og dataanmodninger.
- Medarbejderen kan sende demoanmodning om indsigt, rettelse, sletning, eksport, begrænsning eller indsigelse.
- Logbogen har nu automatiske private forslag fra lokation, afhentning og køretøj samt egne automatikvalg.
- Smart logbog laver nu private kladder for steder, pauser, afhentninger og arbejdsdag med én hovedkontakt og enkle underkontakter.

Mangler før online drift:

- Oversigt over egne profiloplysninger.
- Liste over aktiv GPS-deling.
- Download/eksport af egne data.
- Anmodning om indsigt, rettelse, sletning, eksport eller begrænsning.
- Status på dataanmodninger.
- Serverstyret synkronisering af logbogsautomatik pr. bruger.
- Online job eller klientlogik der kan opdage pauser og steder uden at gemme unødvendig GPS-historik.
- RLS- og integrationstest der beviser, at chef/admin ikke kan læse private logbogsnoter eller automatikmetadata.

### 7. Bedre informationscenter

Informationscenteret har gode links, men bør blive mere praktisk for en chauffør på farten.

Status efter InfoCenter 2.0:

- Informationscenteret har nu 20-sekunders svar, favoritter, landeguider, checklister og tydelig lastbil/varebil-målgruppe.

Mangler:

- Korte "20 sekunder"-svar øverst på hver guide.
- Favoritter.
- Senest brugte guides.
- Landeguider for typiske ruter.
- Interne procedurer skrevet af XpressBudet: uheld, skade, forsinkelse, afvist levering, manglende dokumenter.
- "Ring til drift" og "skriv til drift" direkte fra relevante guides.

### 8. Regelovervågning som rigtig systemfunktion

Planen er god, men ikke implementeret som serverflow.

Mangler:

- Serverjob der henter officielle kilder.
- Fingeraftryk/checksum pr. kilde.
- Kladder ved ændringer.
- Admin-godkendelse før publicering.
- Målgruppe: alle, varebil, lastbil, internationalt.
- Historik over hvad der blev ændret og hvornår.

### 9. Køretøjer som egne enheder

Profiler har bil/enhed som tekst, men et transportfirma får brug for rigtige køretøjsdata.

Status efter første demo-pakke:

- Demoen har nu et køretøjsregister med enhed, type, nummerplade, status, udstyr og chaufførtilknytning.

Mangler før online drift:

- Køretøjsregister.
- Nummerplade, type, vægtklasse, lift, trailer/trækker, varebil/lastbil.
- Fast eller midlertidig chaufførtilknytning.
- Status: ledig, på tur, service, skade, ude af drift.
- Dokumenter: forsikring, syn, tilladelser og udstyr.

### 10. Søgning på tværs

Der er søgning i medarbejdere og information, men ikke samlet.

Mangler:

- Søg i opslag.
- Søg i egne chats.
- Søg i information/guides.
- Søg i dokumenter.
- Filtrering efter målgruppe og dato.

## UX og layout der bør forbedres

### 11. Mere tydelig startside-prioritet

Startsiden er god, men kontoropslag, regelnyt og kollegaopslag bør adskilles mere visuelt.

Status efter Forside 2.0 og UI-redesign 3.0:

- Forsiden har nu dagens overblik, vigtige kontoropslag, mine opgaver, logbogskladder og tydeligere hurtige handlinger.
- Forsiden har nu "Mød ind", som starter arbejdsdagen, aktiverer tilladte funktioner og slukker automatisk kl. 19.00 dansk tid.
- Forsiden har nu en tydelig Nu-blok, større trykflader og faste sektioner for Vigtigt lige nu, Opgaver og kladder samt Fællesskab.
- Mere-siden er løftet til Kontrolcenter med daglig brug, sikkerhed/privatliv og administration.

Forslag:

- Gør Regelnyt endnu tydeligere som egen godkendt boks.
- "Set af mig"-markering på vigtige opslag.
- Dagens huskeliste.

### 12. Bedre chatoplevelse

Mangler:

- Læst/ulæst-status.
- Mentions.
- Vigtige beskeder.
- Svar på besked.
- Søg i chat.
- Vedhæft dokument eller billede med tydelig regeltekst.

### 13. Bedre kortoplevelse

Kortet er på rette vej med Leaflet/OpenStreetMap, men mangler driftsfølelse.

Mangler:

- Sidst opdateret pr. markør.
- Fri/optaget/pause/problemer på markørerne.
- Filter for online, deler GPS, varebil, lastbil, status.
- Trafik/rutevejledning, hvis Google Maps vælges senere.
- Tydelig besked hvis kortbiblioteket ikke kan hentes.

## Sikkerhed og drift

### 14. Backup, overvågning og logning

Mangler:

- Backup-plan.
- Gendannelsesplan.
- Fejllogning.
- Admin-audit for følsomme ændringer.
- Overblik over mislykkede loginforsøg.
- Rate limiting på login og chat.

### 15. Juridiske beslutninger før brug

Mangler beslutning:

- Hvem er dataansvarlig
- Hvem må være admin
- Hvor længe gemmes chat
- Hvor længe gemmes billeder
- Skal GPS kun være live
- Må hastighed nogensinde gemmes
- Hvordan håndteres fratrådte medarbejdere
- Hvem svarer på medarbejdernes dataanmodninger

## Anbefalet rækkefølge

1. Gør appen online med Supabase Auth, database og realtime.
2. Test RLS og adgang grundigt.
3. Byg rigtig billedlagring og privat Storage.
4. Kobl notifikationscenteret på rigtig browser-push og serverstyrede stilleperioder.
5. Kobl afhentningsopgaver 2.0 på online status, billeder og historik.
6. Byg "Mine data" og dataanmodninger.
7. Byg køretøjsregister.
8. Gør informationscenteret til korte guides med favoritter.
9. Byg regelovervågning med admin-godkendelse.
10. Polér startsiden og chatten til daglig brug.

## Hvad jeg ville bygge først

Hvis målet er en brugbar intern test hurtigst muligt, ville jeg starte med:

1. Online login og database.
2. Realtime fælleschat plus lastbil/varebilchat.
3. RLS-test af chatadgang.
4. Rigtig live GPS med tidsbegrænset deling. Den lokale demo har nu 15/30/60 minutters deling, status og automatisk stop; næste trin er serverstyret realtime.
5. Push-notifikationer for direkte beskeder og vigtige opslag.

Det vil give den første version en rigtig kerne: medarbejderne kan logge ind, skrive sammen, se vigtige opslag og dele position frivilligt.
