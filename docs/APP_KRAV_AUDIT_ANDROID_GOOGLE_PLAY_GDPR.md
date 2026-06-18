# XpressIntra app-krav audit

Dato: 2026-06-04  
Omfang: Android APK, Google Play/Internal Testing, GDPR/Datatilsynet og intern firmadrift.  
Status: Praktisk kravliste. Ikke juridisk rådgivning.

## Kort konklusion

XpressIntra er på rette vej, men der er krav der skal være på plads før appen bør bruges bredt eller udgives via Google Play.

Appen klarer allerede flere tekniske krav:

- Android `targetSdkVersion` er 35.
- Android `compileSdkVersion` er 35.
- Android backup er slået fra med `android:allowBackup="false"` og `android:fullBackupContent="false"`.
- Der er ikke `ACCESS_BACKGROUND_LOCATION` i manifestet.
- Der er ikke mikrofon-adgang.
- Supabase service-role key er ikke i app-config.

De største krav/gaps er:

1. Der skal være en rigtig privacy policy/privatlivspolitik, hvis appen skal i Google Play.
2. Google Play Data Safety skal udfyldes nøjagtigt efter de data appen faktisk indsamler.
3. GPS/lokation skal dokumenteres ekstra tydeligt.
4. `REQUEST_INSTALL_PACKAGES` bør fjernes, hvis appen distribueres via Google Play.
5. Kamera/billeder skal kun kræves hvis funktionen er nødvendig, og Data Safety skal afspejle det.
6. Medarbejder-GDPR kræver ledelsesgodkendt information, slettefrister og adgangsregler.
7. Stabil drift kræver incident-plan, mistet-telefon-procedure og backup-test.

## Officielle kravkilder

- Google Play target API-level krav:  
  https://developer.android.com/google/play/requirements/target-sdk

- Google Play sensitive permissions og user data:  
  https://support.google.com/googleplay/android-developer/answer/16558241

- Google Play Data Safety:  
  https://support.google.com/googleplay/android-developer/answer/10787469

- Datatilsynet GDPR-univers for små virksomheder:  
  https://www.datatilsynet.dk/regler-og-vejledning/gdpr-univers-for-smaa-virksomheder

- Datatilsynet om databeskyttelse i ansættelsesforhold:  
  https://www.datatilsynet.dk/regler-og-vejledning/databeskyttelse-i-forbindelse-med-ansaettelsesforhold

- Datatilsynet om konsekvensanalyse/DPIA:  
  https://www.datatilsynet.dk/regler-og-vejledning/behandlingssikkerhed/konsekvensanalyse

## Android-manifest status

Nuværende vigtige permissions:

| Permission | Status | Vurdering |
| --- | --- | --- |
| `INTERNET` | Bruges | Nødvendig til Supabase, kort, web og app-data. |
| `REQUEST_INSTALL_PACKAGES` | Bruges | Risiko ved Google Play. Bør fjernes ved Play-distribution. |
| `ACCESS_COARSE_LOCATION` | Bruges | Relevant til GPS/livekort, men kræver tydelig forklaring. |
| `ACCESS_FINE_LOCATION` | Bruges | Relevant til præcis GPS, men er følsom data. |
| `CAMERA` | Bruges | Relevant hvis appen kan tage/uploade billeder. Skal forklares. |
| `READ_MEDIA_IMAGES` | Bruges | Relevant til billedvalg på nyere Android. Skal forklares. |
| `ACCESS_BACKGROUND_LOCATION` | Ikke brugt | Godt. Appen bør ikke bruge baggrundslokation før der er meget stærk grund. |
| `POST_NOTIFICATIONS` | Bruges til frivillige systembeskeder | Android spørger ved første start efter installation på Android 13+. Brugeren kan slå beskeder fra i appens indstillinger. |
| `RECORD_AUDIO` | Ikke brugt | Godt. Appen bør ikke bruge mikrofon. |

## Google Play-vurdering

### 1. Target SDK

Krav: Nye apps og opdateringer skal målrette Android 15/API 35 eller højere.  
Status: OK. Projektet bruger target SDK 35.

### 2. Privacy policy

Krav: Appen behandler persondata og følsomme data som lokation, billeder, chat og profiloplysninger. Derfor skal der være en privacy policy, hvis appen distribueres via Google Play.

Status: Delvist klar. `docs/GDPR_DOKUMENTATIONSPAKKE.md` er et godt grundlag, men der bør laves en kort offentlig/medarbejdervenlig privacy policy-side, for eksempel:

- `docs/privacy.html`
- `docs/privacy.md`
- eller en webside på GitHub Pages/Vercel.

### 3. Data Safety

Google Play Data Safety skal svare til appens faktiske adfærd. For XpressIntra skal man forvente at skulle oplyse:

| Datatype | Skal sandsynligvis deklareres | Hvorfor |
| --- | --- | --- |
| Navn | Ja | Profiler/medarbejdere. |
| Email | Ja | Login og profil. |
| Telefonnummer | Ja, hvis brugt | Profil/kontakt. |
| Lokation | Ja | Livekort/GPS. |
| Billeder | Ja | Profilbilleder/chat/opgaver. |
| Beskeder | Ja | Chat og direkte beskeder. |
| Bruger-ID | Ja | Supabase Auth/profiler. |
| Appaktivitet | Muligvis | Mød ind, logbog, opgaver og adminlog. |
| Enheds-/diagnostikdata | Kun hvis vi logger det | Skal kun deklareres hvis vi faktisk indsamler det. |

Vigtigt: Data Safety må ikke pyntes. Den skal matche appen, privacy policy og Supabase-data.

### 4. Lokation

Google Play behandler lokation som personlige/følsomme data. Appen bør fortsat:

- kun bruge lokation når brugeren aktivt starter deling
- undgå baggrundslokation
- vise tydelig status når GPS deles
- gøre stop-knappen let at finde
- have tidsbegrænset deling
- forklare hvem der kan se positionen
- undgå at gemme GPS-historik uden beslutning og formål

Status: God retning. Appen bruger ikke baggrundslokation, hvilket er positivt.

### 5. Selv-opdatering/APK-installation

`REQUEST_INSTALL_PACKAGES` bruges til APK-opdateringer uden om Play.

Vurdering:

- OK til intern sideload-test, hvis medarbejderne ved hvad de installerer.
- Ikke ideelt til Google Play.
- Ved Google Play bør opdatering ske via Play Store/Internal Testing, ikke via egen APK-installer.

Anbefaling:

- Behold APK-flow til lukket intern test nu.
- Lav en Play-version uden `REQUEST_INSTALL_PACKAGES`, når Google Play Internal Testing tages i brug.

### 6. Kamera og billeder

Kamera og billeder er følsomme tilladelser. Appen bør kun bede om adgang når brugeren aktivt uploader/tager billede.

Krav i praksis:

- Forklar hvorfor billedadgang bruges.
- Begræns filtyper og størrelse.
- Upload til privat storage.
- Undgå offentlige billedlinks.
- Gør sletning mulig efter interne regler.

Status: God retning, men skal felt-testes mere.

## GDPR/medarbejderkrav

Fordi appen bruges i et ansættelsesforhold, er kravene strengere end en almindelig hobby-app. Medarbejderen skal kunne forstå:

- hvilke data appen behandler
- hvorfor data behandles
- hvem der kan se data
- hvor længe data gemmes
- hvilke funktioner der er frivillige
- hvordan GPS virker
- hvordan logbog virker
- hvordan man får indsigt/rettelse/sletning
- hvem man kontakter ved spørgsmål

Krav før bred brug:

- Ledelsen skal godkende `docs/GDPR_DOKUMENTATIONSPAKKE.md`.
- Der bør laves en kort DPIA/konsekvensanalyse for GPS.
- Slettefrister skal besluttes.
- Databehandleraftaler/vilkår skal kontrolleres.
- Mistet-telefon-procedure skal være kendt.
- Fratrådt-medarbejder-procedure skal være kendt.

## Sikkerheds- og driftskrav

Minimum før professionel intern drift:

- MFA/to-faktor på Supabase, GitHub og creator/admin-konti.
- Supabase Security Advisor gennemgået.
- Supabase backup aktiv.
- Gendannelse testet mindst én gang.
- RLS testet på live database.
- Storage bucket privat.
- Ingen service-role key i frontend.
- Ingen private chats i fejl- eller driftslog.
- Medarbejder kan ikke se creator-knapper.
- Chef/admin kan ikke læse private chats uden saglig rolle/adgang.

## Gap-liste

| Prioritet | Gap | Handling |
| --- | --- | --- |
| Høj | Privacy policy mangler som selvstændig side | Lav `docs/privacy.html` eller tilsvarende og link den i app/store. |
| Høj | Google Play Data Safety er ikke udfyldt | Udfyld når Play Console bruges. Skal matche appen. |
| Høj | GPS kræver DPIA/ledelsesbeslutning | Brug `docs/GDPR_DOKUMENTATIONSPAKKE.md` som grundlag. |
| Høj | `REQUEST_INSTALL_PACKAGES` er Play-risiko | Fjern i Play-version eller brug Play Internal Testing. |
| Høj | Live RLS-test mod Supabase skal gennemføres | Test med rigtige brugere/roller. |
| Middel | Profilbillede og chatbilleder skal stresstestes | Test store filer, forkerte filtyper og langsom forbindelse. |
| Middel | Driftsovervågning mangler konkrete live-tal | Udbyg creator drift med Supabase/Auth/Storage-status. |
| Middel | Medarbejdervejledning mangler | Lav kort guide med screenshots. |
| Lav | Push-notifikationer ikke bygget | Vent, til appen er stabil. Tilføj først når tilladelse og privacy er klar. |

## Beslutning: APK internt eller Google Play

### Hvis appen kun deles internt som APK

Kravene er stadig GDPR og sikkerhed, men Google Play Data Safety gælder ikke direkte. Risikoen er mere support og mere usikker installation for medarbejderne.

### Hvis appen skal i Google Play Internal Testing

Kravene bliver skarpere:

- privacy policy URL
- Data Safety
- app access/instructions til Google review
- korrekt permission-declaration
- ingen misvisende beskrivelse
- opdateringer via Play
- sandsynlig fjernelse af egen APK-install permission

## Anbefalet rækkefølge

1. Lav privacy policy-side.
2. Beslut om appen fortsætter som APK-test eller flyttes til Google Play Internal Testing.
3. Hvis Google Play: lav Play-version uden `REQUEST_INSTALL_PACKAGES`.
4. Udfyld Data Safety baseret på denne audit.
5. Lav DPIA-light for GPS.
6. Få chef/ledelse til at godkende GDPR-pakken.
7. Kør tre-telefoners pilot.
8. Kør Supabase live RLS-test.
9. Test profilbilleder og chatbilleder hårdt.
10. Udgiv først bredt når driftplanen er fulgt i mindst 7 dage uden kritiske fejl.

## Status efter opdatering 2026-06-04

- Privacy policy-arbejdsfil er oprettet: `docs/privacy.html`.
- Google Play Data Safety-kladden er oprettet: `docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md`.
- Samlet kravstatus er oprettet: `docs/KRAVSTATUS_PROFESSIONEL_APP.md`.
- Krav der stadig kræver ledelsesbeslutning/live-test er ikke markeret som færdige.

## Samlet vurdering

XpressIntra kan godt blive en professionel intern app, men den skal behandles som medarbejdersoftware med persondata. Det betyder, at privacy policy, Data Safety, GPS-beslutninger, slettefrister, Supabase-sikkerhed og stabil releaseproces er lige så vigtige som design og funktioner.
