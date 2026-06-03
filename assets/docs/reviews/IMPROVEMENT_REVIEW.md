# XpressIntra forbedringsundersøgelse

Dato: 31. maj 2026

Denne rapport samler en grundig vurdering af XpressIntra som intern medarbejderapp for XpressBudet. Fokus er på fællesskab, drift, information, privatliv og de funktioner, der skal til, før appen kan bruges seriøst af chauffører, varebiler, lastbiler, disponenter og ledelse.

## Kort konklusion

Appen har et stærkt grundkoncept: intern startside, adskilte chats, frivillig GPS, logbog, social strøm, informationscenter og regelnyt. Det vigtigste næste skridt er at flytte appen fra lokal demo til rigtig fælles online drift med login, database, live-beskeder, live-positioner og godkendt informationsflow.

De største forbedringer er:

1. Gør kortet til en rigtig driftsvisning med live-positioner, tydelig deling og Google Maps-lignende brugeroplevelse.
2. Gør informationscenteret mere praktisk: kortere svar, bedre kategorier, officielle kilder, favoritter og "hvad betyder det for mig?".
3. Gør startsiden til appens centrum med opslag fra kontoret, kollegaopslag, regelnyt, hurtige handlinger og vigtige advarsler.
4. Byg en administrationsdel til kontor/chef uden adgang til de private lastbil- og varebilchats.
5. Lav en klar privatlivsmodel for GPS, logbog, chat, historik og sletning.

## Nuværende styrker

- Appen har allerede en intern retning og føles ikke som en kundeside.
- Fælleschat, lastbilchat og varebilchat er tænkt rigtigt: disponenter skal ikke kunne se chaufførernes private køretøjskanaler.
- Den personlige logbog er en god ide, især fordi den kan vælges til og fra.
- Midlertidig positionsdeling til "hent noget for en kollega" rammer en ægte hverdagssituation.
- Informationscenteret har officielle links og kan blive en vigtig del af appen.
- Supabase-skemaet peger i den rigtige retning med profiler, chats, opslag, GPS, logbog og regelovervågning.

## Kritiske mangler før rigtig brug

### 1. Demo-data skal erstattes af rigtig online data

I dag er prototypen stadig primært lokal. Før appen kan bruges af medarbejdere, skal følgende ligge online:

- Medarbejderlogin.
- Profiler og roller.
- Chats og beskeder.
- Opslag og kommentarer.
- Frivillige GPS-positioner.
- Logbog, kun synlig for ejeren.
- Regelnyt og godkendelsesflow.

Anbefaling: Supabase er et godt valg til første version, fordi det kan håndtere login, database, adgangsregler og realtime-opdateringer uden at bygge en stor backend fra bunden.

### 2. Chat-adgang skal håndhæves på serveren

Det er ikke nok, at brugerfladen skjuler chats. Databasen skal også nægte adgang.

Krav:

- Alle medarbejdere kan se fælleschatten.
- Varebilschauffører kan se varebilchatten.
- Lastbilchauffører kan se lastbilchatten.
- Disponenter kan kun se fælleschat og direkte samtaler, ikke de interne chaufførkanaler.
- Administrator kan administrere brugere, men bør ikke automatisk læse private eller køretøjsinterne chats.

### 3. GPS kræver tydeligt samtykke

GPS er nyttigt, men følsomt. Appen skal føles tryg.

Krav:

- GPS er altid frivillig.
- Appen viser tydeligt, når position deles.
- Chaufføren kan stoppe deling med ét tryk.
- Midlertidig deling til afhentningsopgave stopper automatisk, når opgaven afsluttes.
- Hastighed fra GPS må vises som hjælp, men ikke bruges som skjult overvågning.
- Gamle positioner skal slettes efter en aftalt periode.

## Forside: social startside

Startsiden bør være appens daglige indgang. Den skal minde om sociale medier, men med transportfirmaets behov først.

### Anbefalet indhold

- Fastgjorte opslag fra kontoret.
- Kollegaposter fra vejen.
- Regelnyt med tydelig målgruppe: alle, lastbil eller varebil.
- Hurtige handlinger: del position, hent for kollega, skriv i fælleschat, åbn kort, åbn information.
- "Hvem er online?" med frivillig positionsstatus.
- Vigtige advarsler: vejarbejde, kø, terminalinfo, forsinkelser, dokumentationskrav.
- Dagens praktiske huskeliste.

### Forbedringer

- Gør kontoropslag visuelt tydeligere end almindelige kollegaopslag.
- Giv opslag typer: drift, socialt, regel, dokument, advarsel, spørgsmål.
- Tilføj reaktioner som "set", "tak", "jeg kan hjælpe".
- Tilføj mulighed for at fastgøre opslag i toppen i en periode.
- Tilføj søgning i gamle opslag.

## Kort og live-positioner

Brugerens kritik er rigtig: kortet skal føles som et rigtigt kort, ikke en tegnet illustration. Den nuværende Leaflet/OpenStreetMap-retning er god til prototype, men hvis målet er "mere Google Maps", skal der tages en beslutning.

### Mulighed A: Google Maps

Fordele:

- Mest genkendelig oplevelse for medarbejderne.
- Gode kortdata, zoom, vejnavne og satellitvisning.
- Kan udbygges med ruter, trafik og places-funktioner senere.

Ulemper:

- Kræver Google Cloud-projekt, API-nøgle og betalingsopsætning.
- Maps JavaScript API er pay-as-you-go.
- Nøgler og kvoter skal sikres, så der ikke opstår uventede omkostninger.

Anbefaling: Brug Google Maps, hvis firmaet vil have den mest kendte kortfølelse. Sæt budgetgrænser, domænebegrænsning på API-nøglen og overvågning fra starten.

### Mulighed B: Leaflet + OpenStreetMap

Fordele:

- Billigere og enklere til intern visning.
- Ingen tung Google-afhængighed.
- Fungerer fint til markører, live-positioner og simple ruter.

Ulemper:

- Føles ikke helt som Google Maps.
- Trafik, rutevejledning og adresseopslag kræver ekstra tjenester.

Anbefaling: Brug Leaflet til MVP, men design brugerfladen Google Maps-lignende. Skift til Google Maps senere, hvis behovet er trafik/rute/adressefunktioner.

### Funktioner kortet bør have

- Live-markører for medarbejdere, der aktivt deler position.
- Filtre: alle, lastbil, varebil, online, deler position, fri/optaget.
- Tydelig status på hver chauffør: kører, pause, klar, optaget, problem.
- "Del kun med denne kollega" ved afhentningsopgaver.
- Sidste opdateringstidspunkt på hver position.
- Automatisk stop af deling efter valgt tid: 15, 30, 60 eller 120 minutter.
- Knap til "åbn i Google Maps" for navigation.
- Hastighed fra GPS vist til chaufføren selv, men kun delt bredere hvis der er en klar driftsbeslutning.

## Informationscenter

Informationscenteret skal ikke bare være en linkliste. Det skal hjælpe en træt chauffør hurtigt.

### Bedre brugerflade

- Start med spørgsmål: "Hvad har du brug for?"
- Brug store kort: Uheld, forsinkelse, CMR, køre/hviletid, vejafgift, miljøzoner, varebil, lastbil.
- Giv hver artikel en kort version først: "Det vigtigste på 20 sekunder".
- Vis "Gælder for" på alle emner: alle, varebil, lastbil, internationalt, Danmark.
- Vis "Sidst tjekket" og "Kilde".
- Gør officielle links åbne i ny fane.
- Tilføj favoritter til de mest brugte sider.
- Tilføj "ring til drift" og "send besked til drift" direkte fra relevante guides.

### Indhold der bør skrives internt

- Ved uheld: hvad gør jeg først?
- Ved skade på gods.
- Ved forsinkelse.
- Ved manglende dokumenter.
- Ved afvist levering.
- CMR-billeder: hvornår og hvordan.
- Lastsikring: hurtig tjekliste.
- Terminalprocedure.
- Kontaktliste.
- Landeguider for de mest brugte ruter.
- Varebilguide for national og international kørsel.
- Lastbilguide for køre- og hviletid, vejafgift og miljøzoner.

### Regelnyt

Regelnyt bør være en særskilt funktion med godkendelse.

Flow:

1. Systemet tjekker officielle kilder dagligt.
2. Hvis en kilde ændrer sig, opretter systemet en kladde.
3. Administrator eller ansvarlig disponent læser ændringen.
4. Appen omskriver ikke automatisk regler som sandhed, men viser en kort intern forklaring med link til officiel kilde.
5. Medarbejderne får kun relevante beskeder.

Eksempel: Færdselsstyrelsen skriver, at internationale varebiler over 2,5 ton fra 1. juli 2026 skal have takograf og følge køre-/hviletidsregler i relevante tilfælde. Appen bør vise dette til varebiler, men med tydeligt link til kilden og intern forklaring.

## Chat og fællesskab

### Nuværende kanaler

- Fælleschat for alle.
- Lastbilchat for lastbilchauffører.
- Varebilchat for varebilschauffører.
- Direkte samtaler.

Det er den rigtige opdeling.

### Forbedringer

- Læst-status for vigtige beskeder.
- Mulighed for at markere besked som "vigtig".
- Billeder i chat til dokumentation, men med klare regler.
- Talebeskeder kan overvejes, men bør ikke være første prioritet.
- Søgning i chats.
- Stille perioder eller notifikationskontrol.
- "Svar senere" eller "gem besked".
- Automatisk opdeling af driftsbeskeder og smalltalk, så vigtig information ikke drukner.

### Kontor og disponenter

Disponenter skal ikke kunne læse private køretøjskanaler, men de har stadig brug for værktøjer.

Disponentoverblik bør indeholde:

- Hvem er online.
- Hvem deler frivilligt position.
- Hvem er fri, optaget, på pause eller har brug for hjælp.
- Direkte besked til chauffør.
- Opret driftsopslag.
- Fastgør vigtige opslag.
- Se afhentningsopgaver, når de involverer en kollega eller driften.
- Se kontaktoplysninger og køretøjstilknytning.

Chef/admin bør kunne:

- Oprette og deaktivere medarbejdere.
- Ændre roller og køretøjstype.
- Vedligeholde guides og dokumenter.
- Godkende regelnyt.
- Se audit-log for administrative ændringer.
- Sætte regler for GPS-opbevaring.
- Se samlet brug, men ikke private logbøger.

## Afhentning for kollega

Denne funktion bør være ekstremt hurtig.

Forslag til flow:

1. Tryk "Hent for kollega".
2. Vælg kollega.
3. Vælg delingstid: 15, 30, 60 eller indtil færdig.
4. Skriv valgfri note.
5. Start opgave og midlertidig positionsdeling.
6. Kollegaen får besked og kan se position.
7. Når opgaven markeres færdig, stopper delingen automatisk.

Forbedringer:

- Hurtigknap fra profilkort.
- Hurtigknap fra chat.
- Historik: "sidste 5 afhentninger".
- Mulighed for at dele et billede af varen.
- Mulighed for at markere "kan ikke finde den", "hentet", "afleveret".

## Personlig logbog

Logbogen er en stærk medarbejderfunktion, fordi den gør appen mere menneskelig.

Forbedringer:

- Vælg privat som standard.
- Mulighed for at dele enkelte logbogsindlæg til startsiden.
- Automatisk forslag: sted, dato, rute, billede.
- "Mine steder" med kort over byer og lande.
- Månedsoversigt: hvor har jeg været?
- Eksport af egne data.
- Sletning af egne logbogsdata.

Vigtigt: Logbogen må ikke blive en kontrolfunktion. Den skal være chaufførens egen.

## Notifikationer

Notifikationer skal være rolige og relevante.

Anbefalet standard:

- Vigtige kontoropslag: til.
- Direkte beskeder: til.
- Fælleschat: kun mentions eller vigtige beskeder.
- Lastbil/varebilchat: til, men med stilleperiode.
- Regelnyt: til ved vigtige godkendte ændringer.
- Kollegaposter: fra som standard eller samlet i daglig oversigt.

## Privatliv, GDPR og tillid

Dette er en af de vigtigste dele, hvis appen skal bruges i et rigtigt firma.

Beslutninger der skal træffes:

- Hvor længe gemmes GPS-positioner?
- Hvem må se live-position?
- Må kontoret se historiske positioner, eller kun live?
- Må hastighed gemmes, eller kun vises midlertidigt?
- Hvem kan eksportere data?
- Hvad sker der, når en medarbejder stopper?
- Hvordan informeres medarbejderne om databrug?

Anbefaling:

- Gem kun seneste live-position til normal deling.
- Gem afhentningsopgavehistorik uden detaljeret sporlog, medmindre der er et klart formål.
- Gem hastighed så lidt som muligt.
- Gør al deling synlig for medarbejderen.
- Lav en kort privatlivsside i appen på almindeligt dansk.

## Teknisk forbedringsplan

### Prioritet 1: Online MVP

- Supabase Auth til medarbejderlogin.
- Profiler i database.
- Realtime chat.
- Realtime opslag.
- Realtime GPS-positioner.
- RLS-regler testet for lastbil/varebil/disponent.
- Admin kan oprette brugere.
- Appen deployes på et fast internt domæne.

### Prioritet 2: Kort og GPS

- Vælg kortmotor: Google Maps eller Leaflet.
- Implementer live-markører.
- Implementer midlertidig deling.
- Implementer "del kun med kollega".
- Tilføj positionsudløb.
- Tilføj tydelig stop-knap.

### Prioritet 3: Information og regelnyt

- Skriv interne guides.
- Tilføj redigeringsside for admin.
- Tilføj kildeovervågning.
- Tilføj godkendelse af regelændringer.
- Tilføj målgruppestyring.

### Prioritet 4: App-følelse

- Push-notifikationer.
- Bedre offline-visning.
- Installerbar PWA med ikon og splash.
- Billedupload til opslag/logbog.
- Søgning på tværs af information, opslag og medarbejdere.

## Foreslået backlog

| Prioritet | Forslag | Effekt | Sværhed |
|---|---|---:|---:|
| 1 | Rigtigt login og online database | Meget høj | Mellem |
| 1 | Realtime fælleschat, varebilchat og lastbilchat | Meget høj | Mellem |
| 1 | Serverstyret adgang til chats | Meget høj | Mellem |
| 1 | Live GPS med frivillig deling | Meget høj | Mellem |
| 1 | Kort med rigtige markører | Høj | Mellem |
| 1 | Midlertidig deling til afhentningsopgaver | Høj | Mellem |
| 2 | Adminside til brugere og roller | Høj | Mellem |
| 2 | Fastgjorte kontoropslag | Høj | Lav |
| 2 | Bedre informationscenter med korte guides | Høj | Lav |
| 2 | Regelnyt med godkendelse | Høj | Mellem |
| 2 | Push-notifikationer | Høj | Mellem |
| 3 | Logbogskort over egne steder | Mellem | Mellem |
| 3 | Billeddeling i opslag og logbog | Mellem | Mellem |
| 3 | Søgning i chat og opslag | Mellem | Mellem |
| 3 | Landeguider for Europa | Mellem | Lav |
| 4 | Ruteintegration og trafikdata | Mellem | Høj |
| 4 | Køretøjsstatus og flådeoversigt | Høj | Høj |
| 4 | Dokumentupload og intern filstyring | Mellem | Mellem |

## MVP-krav før intern test

Appen er klar til intern test, når dette virker:

- Medarbejder kan logge ind.
- Profil viser korrekt rolle og køretøjstype.
- Fælleschat virker live.
- Lastbilchat er usynlig for varebil og disponent.
- Varebilchat er usynlig for lastbil og disponent.
- Direkte beskeder virker.
- Kontoret kan oprette opslag.
- Chauffør kan oprette kollegaopslag.
- Chauffør kan slå GPS-deling til og fra.
- Kort viser kun dem, der aktivt deler.
- Afhentningsdeling stopper automatisk.
- Logbog er privat og valgfri.
- Informationscenter har officielle links.
- Regelnyt er markeret med kilde og dato.

## Kilder og områder der bør overvåges

- [Færdselsstyrelsen: varebiler og køre-/hviletidskontrol](https://www.fstyr.dk/nyheder/2026/mar/varebiler-bliver-en-del-af-koere-og-hviletidskontrollen)
- [Færdselsstyrelsen: køre- og hviletid](https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/vejledning-om-reglerne)
- [Færdselsstyrelsen: takograf](https://www.fstyr.dk/erhverv/gods-bus-og-varebil/takograf)
- [Vejafgifter.dk](https://www.vejafgifter.dk/)
- [Miljøzoner.dk: regler for lastbiler og busser](https://miljoezoner.dk/regler-og-koretojer/regler-for-lastbiler-busser/)
- [European Labour Authority: light commercial vehicles](https://www.ela.europa.eu/en/light-commercial-vehicles)
- [Google Maps Platform: Maps JavaScript API billing](https://developers.google.com/maps/documentation/javascript/usage-and-billing)
- [MDN: Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [XpressBudet: vejtransport](https://www.xpressbudet.dk/vejtransport/)

## Vigtigste produktbeslutninger

Der er tre beslutninger, som bør tages tidligt:

1. Skal kortet være Google Maps fra starten, eller er Leaflet/OpenStreetMap nok til MVP?
2. Skal kontoret kunne se historiske positioner, eller kun aktiv live-deling?
3. Hvem må godkende regelnyt og officielle informationsopslag?

Min anbefaling:

- Brug Leaflet/OpenStreetMap til første online MVP, hvis budget og hastighed er vigtigst.
- Brug Google Maps, hvis brugeroplevelsen og genkendeligheden vejer tungest.
- Gem mindst mulig GPS-historik.
- Lad kontoret styre opslag og information, men hold chaufførernes interne lastbil-/varebilchats lukkede.
- Gør startsiden til den daglige hovedside og informationscenteret til den praktiske værktøjskasse.
