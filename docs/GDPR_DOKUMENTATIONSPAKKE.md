# XpressIntra GDPR-dokumentationspakke

Dato: 2026-06-04  
Status: Arbejdsdokument til intern godkendelse  
Vigtigt: Dette er ikke juridisk rådgivning. Det er et praktisk grundlag, som ledelsen kan bruge sammen med virksomhedens egen rådgiver/revisor/jurist.

## Formål

XpressIntra er et internt medarbejdersystem til XpressBudet A/S. Appen skal hjælpe medarbejdere med intern kommunikation, fælles beskeder, frivillig lokationsdeling, opgaver mellem kollegaer, personlig logbog, profiloplysninger, dokumenter/billeder og hurtig adgang til information. GPS i XpressIntra er til hjælp mellem medarbejdere, ikke til kontrol. XpressBudets flådesystem er det separate system til køretøj/drift.

Appen må ikke bruges som skjult overvågning. Lokationsdeling og logbog skal være tydelige, forståelige og nemme at slå til/fra.

## Kilder og myndighedsvejledning

- Datatilsynet: GDPR-univers for små virksomheder  
  https://www.datatilsynet.dk/regler-og-vejledning/gdpr-univers-for-smaa-virksomheder
- Datatilsynet: Databeskyttelse i forbindelse med ansættelsesforhold  
  https://www.datatilsynet.dk/regler-og-vejledning/databeskyttelse-i-forbindelse-med-ansaettelsesforhold
- Datatilsynet: Konsekvensanalyse / DPIA  
  https://www.datatilsynet.dk/regler-og-vejledning/behandlingssikkerhed/konsekvensanalyse

## Roller

| Rolle | Ansvar |
| --- | --- |
| Dataansvarlig | XpressBudet A/S, når appen bruges til medarbejdere. |
| Intern ansvarlig | Udpeges af ledelsen. Typisk chef/ejer eller driftsansvarlig. |
| Creator/appansvarlig | Teknisk og praktisk appansvar. Må ikke automatisk få adgang til private chats. |
| Chef/admin | Kan administrere medarbejdere og kernefunktioner. Må ikke læse private chats uden sagligt medlemskab/adgang. |
| Medarbejder | Bruger appen, styrer frivillige funktioner og kan anmode om indsigt/sletning. |
| Databehandlere | Supabase, hosting, GitHub/release-distribution og eventuelle andre leverandører. |

## Dataområder og formål

| Dataområde | Eksempler | Formål | Foreløbigt grundlag som ledelsen skal godkende |
| --- | --- | --- | --- |
| Profil | Navn, email, telefon, rolle, afdeling, køretøjstype | Login, kontakt og intern drift | Nødvendig intern drift/ansættelsesforhold |
| Chat | Fælleschat, rollechat, direkte beskeder, billeder | Kommunikation og samarbejde | Nødvendig intern drift/legitim interesse |
| Lokation | Live-position, delingsstatus, evt. fart hvis valgt | Frivillig koordinering og hjælp mellem kollegaer, ikke ledelseskontrol | Legitim drift, med tydelig information og begrænsning |
| Logbog | Private noter, automatiske kladder, steder og oplevelser | Personlig arbejdslog og hukommelse | Frivillig funktion, styret af medarbejderen |
| Billeder | Profilbillede, chatbilleder, opgavebilleder | Identifikation, dokumentation og samarbejde | Afhænger af brug og formål |
| Opgaver | Hent-for-kollega, live-noter, status | Koordinering af arbejdsopgaver | Nødvendig intern drift |
| Adminlog | Invitationer, rolleændringer, deaktivering | Sikkerhed og ansvarlighed | Legitim sikkerhed/drift |
| Dataanmodninger | Indsigt, rettelse, sletning | GDPR-rettigheder | Retlig forpligtelse |

## Medarbejderinformation, kort version

Denne tekst kan bruges som udgangspunkt i appen og i en intern medarbejderbesked:

> XpressIntra er XpressBudets interne medarbejder-app. Appen bruges til fælles beskeder, chat, opgaver, frivillig lokationsdeling, profiloplysninger og personlig logbog. GPS i XpressIntra er til hjælp mellem kollegaer, ikke kontrol. Lokationsdeling er som udgangspunkt frivillig og synlig i appen, og du kan se når du deler. Din private logbog er din egen. Chef/admin kan administrere medarbejdere og drift, men skal ikke have fri adgang til private chats. Du kan kontakte ledelsen/appansvarlig, hvis du ønsker indsigt i dine data, rettelse eller sletning.

## Lokationsdeling og GPS

Lokationsdata er personoplysninger, når de kan kobles til en medarbejder. Derfor skal XpressIntra bruge følgende principper:

- GPS må ikke være skjult.
- Medarbejderen skal tydeligt kunne se, når position deles.
- Deling skal være nem at starte og stoppe.
- Deling bør som standard være tidsbegrænset.
- Historik bør ikke gemmes længere end nødvendigt.
- Fart bør kun deles/gemmes hvis der er en klar intern beslutning og saglig grund.
- Lokation må ikke bruges til generel disciplinær overvågning uden særskilt vurdering og information.

Se også `docs/GPS_LOKATION_BESLUTNINGSGRUNDLAG.md` for den anbefalede model: frivillig live-deling, ingen skjult GPS, ingen baggrundslokation, ingen generel GPS-historik og ingen fartdeling som standard.

## Privat logbog

Den personlige logbog bør behandles som privat medarbejderdata:

- Chef/admin skal ikke have almindelig adgang til medarbejderens private logbog.
- Automatiske kladder skal kunne slås til/fra.
- Medarbejderen skal kunne slette egne logbogsnoter.
- Logbogsdata bør ikke bruges til kontrol.

## Chat og beskeder

XpressIntra bør skelne tydeligt mellem fælleschat, lastbilchat, varebilchat, direkte beskeder og driftsopslag fra kontoret.

Chef/admin må gerne styre medarbejdere og system, men må ikke få automatisk adgang til interne medarbejderchats. En chef kan kun se en rollechat, hvis personen også reelt har den arbejdsrolle, for eksempel lastbilchauffør.

## Slettefrister

Foreløbige anbefalinger, som ledelsen skal godkende:

| Data | Foreslået frist | Kommentar |
| --- | ---: | --- |
| Live GPS | 1 døgn eller kortere | Kun seneste aktive position bør være nødvendig i normal drift. |
| Hurtig deling/opgaveposition | 24-72 timer | Skal kunne ryddes efter opgaven. |
| Chat | 180 dage | Kan justeres efter behov, men bør ikke gemmes uendeligt uden grund. |
| Direkte beskeder | 180 dage | Samme princip som chat, men med ekstra privathed. |
| Billeder i chat/opgaver | 90-180 dage | Afhænger af om billedet er dokumentation. |
| Profil | Ansættelsesperiode + nødvendig afvikling | Slet/anonymiser ved fratrædelse efter fast proces. |
| Adminlog | 12-24 måneder | Sikkerhed og ansvarlighed. |
| Dataanmodninger | 12 måneder efter afslutning | Dokumentation for håndtering. |
| Privat logbog | Styres af medarbejderen | Bør kunne slettes af medarbejderen. |

## DPIA / konsekvensanalyse

Fordi appen kan behandle lokationsdata om medarbejdere, bør ledelsen lave en kort konsekvensanalyse før bred udrulning.

Minimumsspørgsmål:

1. Hvilke data behandles
2. Hvorfor er behandlingen nødvendig
3. Hvem kan se data
4. Hvor længe gemmes data
5. Kan formålet nås med mindre data
6. Kan medarbejderen slå funktionen fra
7. Hvad er risikoen ved misbrug, mistet telefon eller forkert adgang
8. Hvilke tekniske og organisatoriske sikkerhedsforanstaltninger findes
9. Hvordan informeres medarbejderne
10. Hvem godkender ændringer

## Dataanmodninger

Medarbejdere skal kunne bede om indsigt, rettelse, sletning, begrænsning, eksport og indsigelse mod frivillige funktioner.

Praktisk proces:

1. Medarbejderen opretter anmodning i appen eller kontakter ledelsen.
2. Creator/chef markerer den som modtaget.
3. Ledelsen vurderer hvilken data der er omfattet.
4. Svar gives inden for den lovpligtige frist.
5. Afslutning registreres i adminlog/dataanmodninger.

## Databehandleraftaler

Før fuld drift skal ledelsen sikre aftaler/vilkår for Supabase, hosting, GitHub/release-distribution, Google Play hvis appen flyttes dertil, og eventuelle billed-/kort-/analyseleverandører.

Service-role keys, database passwords og andre hemmelige nøgler må aldrig ligge i appen, GitHub, APK-filer eller offentlige mapper.

## Minimum før medarbejdere inviteres

- [ ] Ledelsen har godkendt formål og adgangsregler.
- [ ] Første creator/admin er sat korrekt op.
- [ ] Supabase RLS og Storage er testet.
- [ ] Medarbejderinformation er skrevet og godkendt.
- [ ] Slettefrister er besluttet.
- [ ] Mistet-telefon-procedure er klar.
- [ ] Fratrædelsesprocedure er klar.
- [ ] MFA/to-faktor er slået til for creator/admin/Supabase/GitHub.
- [ ] Pilot er testet på mindst tre telefoner.
- [ ] Chef ved præcist hvilke chats chef/admin ikke kan se.

## Beslutninger der mangler

1. Må GPS kun være live, eller må historik gemmes
2. Må fart gemmes eller kun vises lokalt for chaufføren
3. Hvor længe skal chats gemmes
4. Hvem må oprette og slette medarbejdere
5. Hvem må godkende nye app-opdateringer
6. Hvad sker der ved misbrug af chat eller billeder
7. Skal appen bruges til drift alene, eller også kontrol
8. Hvem svarer på GDPR-anmodninger
9. Hvem kontakter medarbejdere ved sikkerhedsbrud
10. Hvornår er pilotperioden slut
