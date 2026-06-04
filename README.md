# XpressIntra

Intern medarbejder-webapp til XpressBudets chauffører, kurérer og disponenter.

## Se prototypen

Dobbeltklik på `Start Ren Web Preview.bat`. Den lukker gamle preview-servere og åbner XpressIntra frisk i browseren.

Dobbeltklik på `Start Computer Demo.bat`, hvis appen skal vises i en PC-model til chefer eller kontor-demo.

Demo-login er kun til lokal demo/test. Den produktionsklare app og APK starter uden demopersoner og uden udfyldt demo-login, indtil Supabase er sat op.

Demo-login:

- Mail: `demo@xpressintra.local`
- Adgangskode: `demo1234`

I demo-tilstand gemmes ændringer kun lokalt i browseren.

Appen kan bruges som en installerbar webapp fra browserens menu. Under `Mere` kan demo-data nulstilles, så prototypen er nem at afprøve igen.

GPS kræver, at browseren får tilladelse til position. Hvis GPS ikke er tilgængelig lokalt, viser prototypen tydeligt en demo-position.

## Første version indeholder

- Login-skærm med demo-adgang
- Medarbejderprofiler og oprettelse af kollegaer
- Udvidede profiler med arbejdsmail, afdeling, kørekort/beviser, sprog og nødkontakt
- Rettighedsmodel med medarbejder, disponent og chef/admin
- Chef/admin-overblik til roller, sikkerhed og medarbejderstyring
- Chef/admin kan oprette og deaktivere/fjerne medarbejdere i demoen
- Chef/admin kan styre kernefunktioner som GPS, billeder, logbog, kollegaopslag og regelgodkendelse
- Sikkerhed & jura-sektion med GDPR-hovedpunkter, GPS-regler, billedregler og slettefrister
- Personbeskyttelse med indsigt, rettelse, sletning, eksport, begrænsning og privatliv som standard
- "Mine data" med demo-overblik over egne oplysninger og interne dataanmodninger
- Notifikationsbakke til direkte beskeder, kontoropslag, regelnyt og afhentningsstatus
- Lokal demo-accept af intern sikkerheds-/privatlivsgennemgang
- Almindelige medarbejdere kan se sikkerhedsmodellen, men ikke ændre egne rettigheder
- Chef/admin og disponenter kan ikke læse lastbilchatten eller varebilchatten
- Søgning efter navn, rolle eller lastbil
- Fremhævet fælleschat for alle medarbejdere
- Separate private kanaler til varebiler og lastbiler
- Disponenter har ikke adgang til chaufførernes køretøjskanaler
- Interne driftsopslag, private beskeder og nye samtaler
- Frivillig deling af GPS-position
- Live-kort med filtre for alle, varebiler og lastbiler
- Live-kort 2.0 med hurtig deling i 15, 30 eller 60 minutter, synlig status og automatisk stop
- Live-kortet prøver automatisk en ekstra Leaflet-kilde og viser et brugbart backup-kort med markører, hvis kortbiblioteket ikke kan hentes
- Hurtig afhentningsopgave til en kollega med midlertidig GPS-deling
- Valg af varighed på midlertidig GPS-deling ved afhentning
- Afhentningsopgaver med status: startet, fundet, hentet, afleveret eller kan ikke finde
- Afhentningsopgaver 2.0 med afhentningssted, afleveringssted, reference, prioritet, tjekliste, tidslinje og historik
- Køretøjsregister med type, nummerplade, status, udstyr og chaufførtilknytning
- Rigtigt OpenStreetMap/Leaflet live-kort over de medarbejdere, der aktivt deler position
- Intern startside med opslag fra kontoret, kollegaer og regelnyt
- Social strøm med reaktioner og kommentarer
- Emojis i chatten
- Billeder i chat, opslag, profil og personlig logbog i demoen
- Download-knap på billeder, så medarbejdere kan gemme dokumentation lokalt
- Valgfri privat logbog med egne minder, kategorier, favoritter og billeder
- Automatiske logbogsforslag fra aktuel lokation, afhentningsopgaver og dagens køretøj, som medarbejderen selv godkender
- Smart logbog med én hovedkontakt, enkle til/fra-valg og private kladder for steder, pauser, afhentninger og arbejdsdag
- Forside 2.0 med dagens overblik, vigtige kontoropslag, mine opgaver, logbogskladder og hurtige handlinger
- UI-redesign 3.0 med tydelig Nu-blok, sektionerne Vigtigt lige nu, Opgaver og kladder, Fællesskab samt et samlet Kontrolcenter
- Global søgning på tværs af kollegaer, chats, opslag, information, køretøjer og privat logbog
- Demo-admin er isoleret bag eksplicit demo-mode, så produktionsversionen ikke kan give chefadgang fra brugerfladen
- Supabase-triggeren låser nu titel/rolle, rettighed, afdeling, beviser, køretøj, ansættelsesstatus og logbogsstatus for almindelige medarbejdere
- Notifikationscenter 2.0 med prioritet, daglige påmindelser, stille tid og "marker alt som læst"
- "Mød ind" på forsiden starter arbejdsdagen, aktiverer tilladte funktioner og slukker automatisk igen kl. 19.00 dansk tid
- InfoCenter 2.0 med 20-sekunders svar, favoritter, landeguider, checklister og tydelig lastbil/varebil-opdeling
- Lokal lagring og nulstilling af demo-data
- Installationsmetadata og offline-cache til webapp-brug
- Søgbart informationscenter med interne guides, hurtigkontakt, kildeangivelse og relevante dokumentlinks
- Praktiske hurtigguides til uheld, forsinkelse, CMR og miljøzoner
- Regelnyt med officielle kilder, målgruppe, effektiv dato, godkendelsesstatus og seneste kontrolstatus
- Udbygget kildenetværk med officielle sider fra Færdselsstyrelsen, Miljøzoner.dk, Vejafgifter.dk og European Labour Authority samt supplerende branchekilder fra ITD
- Disponent-overblik med driftstal, hurtige handlinger og tydelig markering af at private chaufførkanaler ikke vises
- Supabase-skemaet adskiller profiloplysninger fra rettigheder og logger ændringer i rolle/adgang
- Følsomme profildata som nødkontakt er lagt i en separat privat tabel i Supabase-skemaet
- Supabase-skemaet har et `media_attachments`-anker til senere rigtig billedlagring i privat Storage-bucket
- Supabase-reglerne låser køretøjschats til almindelige medarbejdere med korrekt køretøjstype, ikke til chef/admin
- Supabase-skemaet har `legal_acceptances` og `retention_policies` til juridisk dokumentation og slettefrister
- Supabase-skemaet har `data_subject_requests` til medarbejdernes anmodninger om egne data
- Supabase-skemaet har `vehicles`, `notifications` og `notification_preferences` til køretøjsregister, rolige medarbejdernotifikationer og individuelle valg

Informationscenteret er bygget til medarbejdernes hverdag. Det indeholder hurtig adgang til drift, terminaladresse, interne guidepladser og relevante arbejdsdokumenter. Det er ikke en kundebookingflade.

I online-versionen bør en planlagt serveropgave kontrollere de officielle kilder dagligt. Seed-data dækker nu både varebil, køre-/hviletid, arbejdstid, virksomhedskontrol, takograf, miljøzoner, vejafgift og EU-vejtransport. ITD bruges i UI som supplerende branchekilde, men er bevidst holdt adskilt fra de officielle overvågede myndighedskilder. Opdagede ændringer gemmes som kladder, så en administrator kan godkende den korte medarbejderbesked, før den vises i appen eller sendes som push-notifikation.

## Fælles medarbejderdata

Mappen `supabase` indeholder databaseskemaet til Supabase. Når et Supabase-projekt er oprettet, kan webappen forbindes til rigtige medarbejderkonti, fælles beskeder og live-positioner.

Den lokale demo er klar til afprøvning uden Supabase.

## Supabase-login

Appen har nu en Supabase-bro:

1. Opret et Supabase-projekt.
2. Kør `supabase/schema.sql` i SQL editoren.
3. Gå til `Mere` -> `Indstillinger` i appen.
4. Indsæt Supabase URL og den offentlige anon/publishable key.
5. Opret medarbejdere i Supabase Auth.

Når URL og offentlig nøgle er sat, bruger login Supabase Auth og henter profil, medarbejdere, køretøjer, notifikationer, opslag og privat logbog fra databasen. Uden Supabase-konfiguration fortsætter demo-login som før.

## Klar til drift

Go-live-pakken ligger her:

- `docs/GO_LIVE_CHECKLIST.md` - praktisk tjekliste til Supabase, mobiltest, jura og drift.
- `docs/ONLINE_KONTOR_APP.md` - enkel vejledning til at lægge appen online til chefer og kontor-PC'er.
- `supabase/first-admin.sql` - SQL-hjælp til at gøre den første Supabase Auth-bruger til chef/admin.

I appen kan chef/admin åbne `Mere` -> `Klar til drift` for at se status på de vigtigste punkter.

## Android APK

Projektet er forberedt til Android via Capacitor:

- `capacitor.config.json` indeholder app-id og Android-konfiguration.
- `Build Android APK.cmd` kan bygge en debug APK, når Node.js og Android Studio er installeret.
- `docs/ANDROID_APK.md` beskriver hele processen.

APK-build kræver Android Studio/SDK på computeren. Den færdige debug APK ligger normalt i `android/app/build/outputs/apk/debug/app-debug.apk`.

Vigtigt: service-role eller secret keys må aldrig sættes ind i webappen.

## Apple/iPhone app

Projektet er også forberedt til iOS via Capacitor:

- `ios/` indeholder Apple/Xcode-projektet.
- `npm run ios:sync` bygger webappen og synkroniserer den til iOS.
- `npm run ios:open` åbner iOS-projektet på en Mac med Xcode.
- `Build Apple iOS paa Mac.command` kan bruges på en Mac til at teste iOS-build og åbne Xcode.
- `docs/APPLE_IOS_APP.md` beskriver Apple-krav, App Store/TestFlight og resterende tjek.

iOS-build, TestFlight og App Store-upload kræver Mac med Xcode og Apple Developer-konto.
