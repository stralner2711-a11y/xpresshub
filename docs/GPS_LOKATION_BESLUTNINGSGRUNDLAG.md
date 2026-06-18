# GPS og lokation i XpressIntra

Dato: 2026-06-04  
Status: Beslutningsgrundlag til chef/ledelse. Ikke juridisk rådgivning.

## Kort konklusion

GPS/lokation kan godt bruges i XpressIntra, men formålet skal stå helt klart: GPS i XpressIntra er til hjælp mellem medarbejdere, ikke til kontrol. XpressBudets flådesystem er det separate system til køretøj/drift. Fordi medarbejder-lokation kan misforstås som kontrol, skal XpressIntra være ekstra tydelig om formål, frivillighed og stop-mulighed.

Den sikreste model for XpressIntra lige nu er:

- Kun frivillig live-deling til kollega-hjælp.
- Ingen skjult GPS.
- Ingen baggrundslokation.
- Ingen generel GPS-historik.
- Ingen fart delt med chef/kollegaer som standard.
- Tydelig tekst i appen om hvem der kan se positionen.
- Kort slettefrist.
- Chef/admin må ikke bruge XpressIntra GPS til almindelig medarbejderkontrol. Hvis virksomheden har drifts-/flådebehov, hører det til flådesystemet og egne regler.

## Hvad siger kilderne

Datatilsynet har i vejledningen om databeskyttelse i ansættelsesforhold fokus på, at arbejdsgiveren skal have et behandlingsgrundlag, og at kontrolforanstaltninger kræver retningslinjer, gennemsigtighed og information til medarbejderne.

Datatilsynets SIF-afgørelse er særligt relevant. Her fik virksomheden alvorlig kritik, fordi informationen til medarbejderne om blandt andet GPS-overvågning ikke var tilstrækkelig. Datatilsynet lagde vægt på oplysningspligt, gennemsigtighed, formål, rettigheder og information om brugen af GPS som kontrolforanstaltning.

Datatilsynets vejledning om konsekvensanalyse/DPIA siger også, at behandling kan kræve konsekvensanalyse, hvis den sandsynligvis indebærer høj risiko for fysiske personers rettigheder og frihedsrettigheder. Behandling af geografisk position/bevægelser i en medarbejdersammenhæng bør derfor vurderes ekstra grundigt.

Derudover nævner arbejdsmarkedskilder, at GPS i firmabiler ofte anses som en kontrolforanstaltning, der kræver forudgående information/varsling efter relevante aftaler, hvis virksomheden er omfattet.

## Hvad betyder det for XpressIntra

### Model A: Frivillig live-deling til kollega-hjælp

Dette er den mest forsvarlige model lige nu.

Brug:

- chauffør starter selv deling
- deling vises tydeligt
- deling stopper automatisk
- kollegaer kan se position, når der er en praktisk opgave
- ingen historik bruges til kontrol

Vurdering: God model til intern pilot.

### Model B: GPS ved "mød ind"

Dette er mere følsomt.

Hvis GPS starter automatisk ved mød ind, skal medarbejderen meget tydeligt vide:

- at GPS starter
- hvem der kan se det
- hvor længe det varer
- hvordan det stoppes
- om position gemmes
- hvad data bruges til

Vurdering: Kan bruges, men bør begrænses og godkendes af ledelsen.

### Model C: GPS-historik

Dette er klart mere risikabelt.

Hvis historik gemmes, kan det hurtigt ligne overvågning/kontrol. Det kræver:

- stærkt sagligt formål
- kort slettefrist
- klar medarbejderinformation
- adgangsbegrænsning
- mulig DPIA/konsekvensanalyse
- klar beslutning om at det ikke bruges skjult

Vurdering: Bør ikke aktiveres nu.

### Model D: Fart fra GPS

Fart er ekstra følsomt, fordi det kan bruges til adfærdskontrol.

Anbefaling:

- Fart kan vises lokalt for chaufføren selv.
- Fart bør ikke deles med chef/kollegaer som standard.
- Fart bør ikke gemmes som historik nu.

Vurdering: Parkér fart-deling og fart-historik til senere.

## Anbefalet beslutning for XpressIntra nu

Ledelsen bør godkende følgende:

1. XpressIntra bruger kun GPS til frivillig live-deling, kollega-hjælp og konkrete opgaver mellem medarbejdere.
2. GPS må ikke bruges som skjult overvågning.
3. GPS-historik gemmes ikke som almindelig historik.
4. Seneste live-position må kun gemmes kortvarigt for at vise livekortet.
5. Hurtig deling/opgaveposition slettes efter kort tid.
6. Fart deles ikke med chef/kollegaer som standard.
7. Fart gemmes ikke som historik.
8. Medarbejderen skal kunne se og stoppe deling.
9. Chef/admin må ikke bruge XpressIntra GPS til generel kontrol. Flåde-/køretøjskontrol hører til det separate flådesystem.
10. Hvis GPS senere skal bruges til kontrol, skal der laves ny information, beslutning og mulig DPIA.

## Foreslåede slettefrister

| Data | Frist | Begrundelse |
| --- | ---: | --- |
| Live-position | Maks. 24 timer | Kun nødvendig til livekort og aktuel koordinering. |
| Hurtig deling ved opgave | 24-72 timer | Kun nødvendig mens opgaven er aktiv/kort efter. |
| GPS-historik | Ikke aktiv nu | Kræver særskilt beslutning. |
| Fart | Ikke gemt nu | Kan blive adfærdskontrol. |

## Tekst til appen

Kort tekst der bør vises ved lokationsdeling:

> Din position deles kun, når du selv starter deling eller når en godkendt arbejdsfunktion gør det tydeligt for dig. Formålet er hjælp mellem kollegaer, ikke kontrol. Du kan stoppe deling igen. XpressIntra må ikke bruges som skjult overvågning. Fart og historik deles ikke som standard.

Tekst ved mød ind, hvis GPS kan starte der:

> Når du møder ind, kan appen starte de funktioner du har valgt i dine indstillinger. Hvis GPS-deling er slået til, kan kollegaer se din live-position efter de synlighedsvalg du har valgt. Du kan ændre dette i indstillinger.

## Ting der skal undgås nu

- Automatisk skjult GPS.
- Baggrundslokation.
- Permanent GPS-historik.
- Fartlog som chef kan læse.
- Brug af GPS til disciplinær kontrol uden skriftlig beslutning og information.
- Uklar tekst som "vi bruger måske GPS" uden at forklare formål og adgang.

## Kilder

- Datatilsynet: Databeskyttelse i forbindelse med ansættelsesforhold  
  https://www.datatilsynet.dk/regler-og-vejledning/databeskyttelse-i-forbindelse-med-ansaettelsesforhold

- Datatilsynet: Tilsyn med SIF Gruppen A/S  
  https://www.datatilsynet.dk/afgoerelser/afgoerelser/2020/aug/tilsyn-med-sif-gruppen-as

- Datatilsynet: Vejledning om konsekvensanalyse  
  https://www.datatilsynet.dk/Media/2/6/Konsekvensanalyse.pdf

- DA/FH: Aftale om kontrolforanstaltninger  
  https://www.da.dk/globalassets/overenskomst-og-arbejdsret/aftale-om-kontrolforanstaltninger.pdf
