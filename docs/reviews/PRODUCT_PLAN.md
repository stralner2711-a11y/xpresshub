# XpressIntra produktplan

## Formål

XpressIntra er et internt medarbejdersystem til XpressBudets chauffører, kurérer og disponenter. Appen skal gøre det hurtigt at finde kollegaer, dele relevant driftsinformation, skrive sammen og finde hjælp på vejen.

## Klar i den lokale demo

- Fremhævet fælleschat for hele holdet
- Privat lastbilchat, som kun lastbilchauffører kan se
- Privat varebilchat, som kun varebilchauffører kan se
- Disponenter kan ikke læse chaufførernes køretøjskanaler
- Direkte samtaler mellem medarbejdere
- Interne driftsopslag
- Medarbejderprofiler og søgning
- Udvidede medarbejderprofiler med kontaktdata, afdeling, beviser, sprog og nødkontakt
- Chef/admin-rolle til medarbejderstyring og rettighedsændringer
- Chef/admin kan oprette, deaktivere og fjerne medarbejdere
- Chef/admin kan styre kernefunktioner uden adgang til interne køretøjschats
- Sikkerhed & jura-sektion med privatliv, GPS, billeder og slettefrister
- Personbeskyttelse med medarbejderrettigheder, dataanmodninger og frivillige privatlivsvalg
- Mine data med overblik, eksportønske og dataanmodninger
- Notifikationsbakke til beskeder, regelnyt og afhentningsstatus
- Notifikationscenter med prioritet, daglige påmindelser, stille tid og individuelle valg
- Køretøjsregister med status, udstyr og chaufførtilknytning
- Frivillig GPS-deling og rigtigt OpenStreetMap/Leaflet live-kort
- Livekort med tidsstyret deling i 15, 30 eller 60 minutter, status og automatisk udløb
- Hurtig afhentning for en kollega med midlertidig GPS-deling
- Afhentningsworkflow med startet, fundet, hentet, afleveret og kan ikke finde
- Afhentningsopgaver 2.0 med sted, aflevering, reference, prioritet, tjekliste, tidslinje og historik
- Startside med kontoropslag, kollegaopslag og regelnyt
- UI-redesign 3.0 med tydeligere forside, større trykflader, roligere kortstruktur og Kontrolcenter opdelt i daglig brug, sikkerhed og administration
- Global søgning i demoen på tværs af kollegaer, chats, opslag, køretøjer, information og privat logbog
- Strammere sikkerhedsmodel: demo-admin er isoleret, og Supabase beskytter organisatoriske profilfelter mod medarbejderændringer
- Social strøm med reaktioner og kommentarer
- Emojis og billeddeling i chatten
- Billeder på opslag og i personlig logbog med download af dokumentation
- Valgfri privat logbog med kategorier, favoritter og automatiske forslag
- Søgbart informationscenter med kildeangivelse og verificerede officielle links
- Hurtigkontakt til budkørsel, lastbilområdet og terminal
- Relevante links til CMR-loven og forretningsbetingelser
- Regelnyt med kilde, målgruppe og kontrolstatus
- Lokal lagring, nulstilling og installerbar webapp

## Prioritet 1: Gør appen fælles online

- Opret Supabase-projekt og forbind login
- Flyt profiler, chats, opslag og private logbøger til databasen
- Tilføj realtime-opdateringer til fælleschat og live-positioner
- Flyt global søgning til serverindeks, så resultater respekterer RLS og ikke kræver at alle data er hentet i klienten
- Vis opgaverelateret GPS til den valgte kollega og afslut delingen tydeligt sammen med opgaven
- Gem udløbstid, seneste opdatering og delingstype for live-positioner, så deling kan lukkes automatisk
- Tilslut Google Maps JavaScript API med virksomheds-kortnøgle, rigtige GPS-koordinater og live-markører
- Opret roller: medarbejder, disponent og administrator
- Begræns oprettelse af medarbejdere og driftsopslag til relevante roller
- Håndhæv adgang til varebil- og lastbilchat i databasen

## Disponenternes sandsynlige ønsker

Disponenter bør have et separat driftsoverblik uden adgang til chaufførernes private køretøjskanaler.

- Se hvem der er online, og hvem der frivilligt deler GPS
- Filtrér medarbejdere efter varebil, lastbil, status og geografisk område
- Se seneste frivilligt delte position uden at gemme unødvendig historik
- Opret og fastgør vigtige driftsopslag til hele holdet
- Send direkte beskeder til en chauffør om en konkret opgave
- Se biler og chaufførtilknytning
- Markér en chauffør som fri, optaget, på pause eller klar til ny opgave
- Del procedurer og dokumenter ét sted
- Modtag besked når en chauffør aktivt melder forsinkelse, skade eller behov for hjælp

## Chefens sandsynlige ønsker

- Administrér medarbejdere, roller og køretøjstyper
- Ændre rettigheder uden at medarbejdere kan ophøje sig selv
- Se audit-log for rolle- og adgangsændringer
- Slå kernefunktioner til/fra: GPS, billeder, logbog, kollegaopslag og regelgodkendelse
- Se en enkel oversigt over drift uden at overvåge private chats
- Udgiv vigtige virksomhedsopslag
- Vedligehold kontaktliste, guides og dokumentbibliotek
- Styr hvor længe GPS-positioner gemmes
- Se audit-log for administrative ændringer
- Se brugsmønstre på et samlet niveau uden at læse private logbøger

## Prioritet 2: Skriv interne guides

- InfoCenter 2.0 med 20-sekunders svar, favoritter, landeguider, checklister og tydelig målgruppevisning
- Guide ved uheld, skade og forsinkelse
- Leveringsprocedure og CMR-tjekliste
- Guide til billeder og dokumentation
- Kontaktliste til drift, terminal og relevante nødkontakter
- Landeguider til de mest brugte europæiske ruter
- Køre- og hviletidsoversigt kvalitetssikret af virksomheden

## Automatisk regelovervågning

- Kontrollér udvalgte officielle kilder dagligt fra en serveropgave
- Gem kildeadresse, målgruppe, kontroltidspunkt og et fingeraftryk af indholdet
- Opret en kladde når en kilde ændrer sig
- Lad en administrator godkende den korte danske forklaring før publicering
- Vis kun relevante beskeder til varebil, lastbil eller hele holdet
- Send push-notifikation ved vigtige godkendte ændringer, ikke ved enhver teknisk ændring på en hjemmeside
- Gem historik, så medarbejderne kan se kilde og dato

Første overvågede kilder bør være Færdselsstyrelsen, Vejafgifter.dk, Miljøzoner.dk og relevante EU-sider. Systemet skal linke til den officielle kilde og må ikke stå alene som juridisk rådgivning.

## Prioritet 3: Styrk fællesskabet

- Forside 2.0 med dagens overblik, vigtige kontoropslag, mine opgaver, logbogskladder og hurtige handlinger
- Viderefør UI-redesign 3.0 i alle nye funktioner: én tydelig primær handling pr. skærm, større tekst på mobil og faste sektioner for drift, opgaver og fællesskab.
- "Mød ind" skal starte arbejdsdagen med de tilladelser medarbejderen og virksomheden har slået til, og al deling skal slukke automatisk kl. 19.00 dansk tid.
- Fastgjorte opslag fra disponenter
- Reaktioner på opslag og beskeder
- Push-notifikationer med rolige standardindstillinger. Den lokale demo har nu prioritet, stille tid og daglige påmindelser; online-versionen skal kobles til browser-push og serverjob.
- Valgfri deling af billeder fra vejen
- Personlige logbogsminder, som kan forblive private eller deles aktivt
- Automatiske logbogskladder fra GPS, afhentningsopgaver, køretøj og milepæle, hvor chaufføren altid vælger hvad der gemmes

## Personlig logbogsautomatik

- Automatikken må kun oprette private forslag eller private indlæg for den enkelte medarbejder.
- Chef/admin og disponenter må ikke få læseadgang til private logbogsnoter.
- Første online-version bør gemme kategori, kilde, favoritmarkering og metadata om forslagstype.
- GPS-baserede minder skal være frivillige, tydelige og kunne slås fra direkte i logbogen.
- Betjeningen skal være enkel: én hovedkontakt til Smart logbog og få underkontakter for steder, pauser, afhentninger og arbejdsdag.
- Første version gemmer automatisk opdagede ting som private kladder, ikke som færdige indlæg uden chaufførens valg.

## Prioritet 4: Drift og administration

- Administrationsside til brugere, roller og opslag
- Status på biler og tilknyttede chauffører
- Dokumentbibliotek med interne PDF-filer
- Privat Storage-bucket til billeder fra chat, opslag, profil og logbog
- Audit-log for følsomme ændringer
- Automatisk sletning af gamle GPS-positioner efter en aftalt periode
- Juridisk acceptlog og vedligeholdte slettefrister i databasen

## Privatliv

- GPS-deling skal altid være frivillig og tydeligt synlig.
- Private logbogsnoter skal kun kunne læses af ejeren.
- Fælleschat og driftsopslag skal kun være tilgængelige efter medarbejderlogin.
- GPS-positioner bør kun gemmes så længe, der er et konkret driftsbehov.
