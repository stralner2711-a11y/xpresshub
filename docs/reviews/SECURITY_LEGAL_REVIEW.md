# XpressIntra sikkerhed og jura

Dato: 31. maj 2026

Dette dokument er en praktisk første vurdering af sikkerhed, GDPR og intern jura for XpressIntra. Det er ikke juridisk rådgivning, men en arbejdsplan for hvad XpressBudet bør beslutte, dokumentere og bygge ind før appen bruges rigtigt af medarbejdere.

## Hvorfor det er vigtigt

Appen behandler flere typer personoplysninger:

- Navn, telefon, arbejdsmail, rolle og køretøjstilknytning.
- GPS-position og mulig hastighed fra GPS.
- Chatbeskeder.
- Billeder i chat, opslag, profil og logbog.
- Private logbogsnoter.
- Admin- og audit-log over ændringer.

Det betyder, at appen skal bygges med tydelige formål, adgangsgrænser, slettefrister, medarbejderinformation og teknisk sikkerhed.

## Juridiske hovedprincipper

### 1. Medarbejderne skal informeres klart

Før appen tages i brug, bør alle medarbejdere have en kort privatlivsmeddelelse på almindeligt dansk. Den skal forklare:

- Hvilke oplysninger appen behandler.
- Hvorfor oplysningerne behandles.
- Hvem der kan se hvad.
- Hvornår GPS bruges.
- Om data kan bruges som kontrolforanstaltning.
- Hvor længe data gemmes.
- Hvordan medarbejderen kan få indsigt eller få rettet oplysninger.

Datatilsynet fremhæver, at medarbejdere skal informeres klart og utvetydigt, hvis oplysninger bruges til kontrol.

### 2. GPS skal være frivillig og tydelig

GPS er en følsom funktion i praksis, fordi den kan vise medarbejderens færden.

Anbefaling:

- GPS-deling er frivillig som standard.
- Appen viser tydeligt når GPS deles.
- Chaufføren kan stoppe deling med ét tryk.
- Afhentningsdeling udløber automatisk.
- Chefen kan ikke bruge appen som skjult overvågning.
- Historisk GPS bør kun gemmes kortvarigt og kun hvis der er et konkret driftsformål.

### 3. Chefen skal kunne administrere uden at læse alt

Chef/admin bør kunne:

- Oprette medarbejdere.
- Deaktivere/fjerne medarbejdere.
- Ændre roller og køretøjstype.
- Styre kernefunktioner.
- Godkende regelnyt.
- Se audit-log for administrative ændringer.

Chef/admin bør ikke kunne:

- Læse lastbilchatten.
- Læse varebilchatten.
- Læse private logbøger.
- Se skjult GPS.
- Bruge data til andre formål end dem medarbejderne er informeret om.

### 4. Billeder skal behandles som persondata

Billeder kan indeholde personer, nummerplader, gods, kunder, adresser eller dokumenter. Derfor bør appen have klare billedregler.

Anbefaling:

- Billeder må kun deles internt.
- Billeder med kunder eller uvedkommende personer bør undgås eller sløres.
- Dokumentationsbilleder bør knyttes til opgaveformål og slettes efter frist.
- Profilbilleder bør være frivillige.
- Billeder i personlig logbog skal være private som standard.

### 5. Dataminimering

Appen bør kun gemme det, der er nødvendigt.

Anbefaling:

- Gem seneste live-position, ikke fuld sporlog, i første version.
- Gem ikke hastighed længere end nødvendigt.
- Gem chat og opslag internt, men med slettepolitik.
- Gem private logbogsdata kun for ejeren.
- Gem audit-log for adminhandlinger, men ikke private samtaler.

### 6. Personbeskyttelse og medarbejderrettigheder

Appen bør bygges efter databeskyttelse gennem design og standardindstillinger. Det betyder, at privatliv ikke kun er en tekst i appen, men en standard i funktionerne.

Anbefaling:

- Medarbejderen skal kunne se en oversigt over egne oplysninger.
- Medarbejderen skal kunne bede om indsigt, rettelse, sletning, eksport, begrænsning eller indsigelse.
- Frivillige funktioner som profilbillede, personlig logbog og GPS-deling skal kunne slås fra.
- Nødkontakt og private profiloplysninger skal ligge adskilt fra almindelige profiler.
- Appen må ikke bruge GPS, hastighed, chat eller billeder til nye formål uden ny information til medarbejderne.
- Adminhandlinger skal logges, men private chats og logbøger må ikke kopieres ind i audit-loggen.
- Ved fratrædelse skal kontoen deaktiveres hurtigt, og data skal slettes eller arkiveres efter den aftalte politik.

I online-versionen bør der være en funktion til "Mine data", hvor medarbejderen kan se hvad der er gemt og sende en anmodning til virksomheden.

## Foreslåede slettefrister

| Datatype | Forslag |
|---|---:|
| Live GPS-position | Seneste position, overskrives løbende |
| Midlertidig afhentningsdeling | Slettes/afsluttes ved udløb eller færdigmelding |
| GPS-hastighed | Vis kun live, gem ikke historisk i MVP |
| Chatbeskeder | 12-24 måneder, besluttes internt |
| Driftsopslag | 12 måneder eller arkiveres manuelt |
| Regelnyt | Gem historik så længe kilden er relevant |
| Billeder til dokumentation | 3-12 måneder afhængigt af formål |
| Profilbilleder | Slettes ved fratrædelse eller efter anmodning |
| Privat logbog | Slettes kun af medarbejderen eller ved kontoafvikling efter aftale |
| Audit-log | 24 måneder |

## Tekniske sikkerhedskrav

- Rigtigt login med Supabase Auth eller tilsvarende.
- Row Level Security på alle tabeller.
- Privat Storage-bucket til billeder.
- Ingen `service_role` key i frontend.
- Rolleændringer skal logges.
- Chef/admin må ikke få adgang til køretøjschats via rolle eller køretøjstype.
- Følsomme oplysninger som nødkontakt skal ligge separat fra almindelige profiler.
- Brugere skal kunne deaktiveres hurtigt ved fratrædelse.
- Offline-cache må ikke gemme følsomme data ukontrolleret.
- Der bør være backup- og gendannelsesplan.

## Beslutninger før rigtig drift

1. Hvem er dataansvarlig internt
2. Hvem må være chef/admin
3. Skal GPS kun være live, eller må der gemmes historik
4. Hvor længe skal chat gemmes
5. Hvilke billeder må deles
6. Hvem godkender regelnyt
7. Hvordan håndteres fratrådte medarbejdere
8. Skal appen bruges til kontrol, eller kun drift og fællesskab
9. Hvem svarer på medarbejdernes spørgsmål om data
10. Skal der laves databehandleraftale med leverandører som Supabase.

## Kilder

- [Datatilsynet: Databeskyttelse i forbindelse med ansættelsesforhold](https://www.datatilsynet.dk/regler-og-vejledning/databeskyttelse-i-forbindelse-med-ansaettelsesforhold)
- [Datatilsynet: Kontrol af medarbejdere](https://www.datatilsynet.dk/Media/638348919997326341/Kontrol%20af%20medarbejdere.pdf)
- [Datatilsynet: Trin 1 - skab overblik](https://admin.datatilsynet.dk/regler-og-vejledning/gdpr-univers-for-smaa-virksomheder/trin-1-skab-overblik)
- [Datatilsynet: Databeskyttelse gennem design og standardindstillinger](https://www.datatilsynet.dk/regler-og-vejledning/behandlingssikkerhed/databeskyttelse-gennem-design-og-standardindstillinger)
- [Datatilsynet: De registreredes rettigheder](https://www.datatilsynet.dk/regler-og-vejledning/de-registreredes-rettigheder-)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
