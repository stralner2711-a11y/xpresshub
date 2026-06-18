# XpressIntra Google Play Data Safety kladde

Dato: 2026-06-04  
Formål: Kladde til Google Play Console. Skal gennemgås igen lige før indsendelse.

## Vigtigt

Google Play kræver, at Data Safety svarer til appens faktiske behandling af data. Den skal matche privatlivspolitikken og den rigtige Supabase-opsætning.

Officiel Google-vejledning:

- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/16558241

## Privacy policy URL

Foreløbig lokal fil:

- `docs/privacy.html`

Når appen skal i Google Play, skal denne ligge på en offentlig HTTPS-adresse, fx GitHub Pages eller Vercel.

## Data der sandsynligvis skal deklareres

| Datatype | Indsamles | Deles med tredjepart | Formål | Kommentar |
| --- | --- | --- | --- | --- |
| Navn | Ja | Nej, normalt ikke | Konto, profil, intern drift | Ligger i Supabase. |
| Email | Ja | Nej, normalt ikke | Login og kontakt | Supabase Auth/profil. |
| Telefonnummer | Ja, hvis udfyldt | Nej, normalt ikke | Kontakt mellem medarbejdere | Profilfelt. |
| Bruger-ID | Ja | Nej, normalt ikke | Login og adgangsstyring | Supabase Auth ID. |
| Beskeder | Ja | Nej, normalt ikke | Intern chat | Fælles, rollechat og direkte beskeder. |
| Billeder | Ja, hvis brugeren uploader | Nej, normalt ikke | Profil, chat, opgaver | Privat Storage. |
| Lokation | Ja, når brugeren deler | Nej, normalt ikke | Frivillig koordinering/livekort | Skal deklareres tydeligt. |
| Appaktivitet | Ja, delvist | Nej, normalt ikke | Mød ind, logbog, opgaver, adminlog | Internt driftsformål. |
| Enheds-/diagnostikdata | Kun hvis vi bygger fejllog | Nej, normalt ikke | Stabil drift | Må ikke deklareres før det faktisk indsamles. |

## Data der ikke bør deklareres som indsamlet, medmindre vi bygger det

- Mikrofon/lyd.
- Kontakter fra telefonbogen.
- Kalender.
- SMS.
- Sundhedsdata.
- Finansielle data.
- Reklame-ID.

## Sikkerhedspraksis

Foreløbig forventet svar:

- Data sendes via HTTPS.
- Appen bruger Supabase Auth til login.
- Appen gemmer ikke adgangskoder.
- Row Level Security skal være aktiv i Supabase.
- Storage bucket skal være privat.
- Medarbejdere kan anmode om indsigt/sletning via app eller ledelse.

## Lokation

Lokation skal beskrives sådan:

- Bruges til frivillig live-deling med kollegaer.
- Brugeren kan starte og stoppe deling.
- Deling er synlig i appen.
- Deling kan begrænses efter målgruppe.
- Appen bruger ikke baggrundslokation i nuværende manifest.
- Historik/slettefrist skal godkendes af ledelsen.

## Billeder

Billeder skal beskrives sådan:

- Brugeren kan selv uploade profilbillede, chatbillede eller opgavebillede.
- Billeder bruges internt.
- Billeder lagres i privat Supabase Storage.
- Billeder skal kunne slettes efter interne regler/slettefrist.

## Google Play app access

Hvis appen sendes til review, skal Google kunne logge ind eller få testadgang.

Krav før Play submission:

- Opret en testbruger i Supabase.
- Sørg for at testbrugeren ikke kan se rigtige private medarbejderdata.
- Skriv instruktioner til Google Play reviewer.
- Test at privacy policy URL virker uden login.

## REQUEST_INSTALL_PACKAGES

Nuværende APK-build bruger `REQUEST_INSTALL_PACKAGES` til intern sideload/opdatering.

Ved Google Play-distribution bør appen ikke selv installere APK-opdateringer. Google Play forventer normalt at opdateringer sker via Play.

Anbefaling:

- Intern APK-test: kan midlertidigt beholdes.
- Google Play Internal Testing: lav Play-build uden `REQUEST_INSTALL_PACKAGES`.

## Før Data Safety udfyldes endeligt

- [ ] Privacy policy ligger på HTTPS.
- [ ] Ledelsen har godkendt GDPR-pakken.
- [ ] Supabase live-tabeller og RLS er testet.
- [ ] GPS-historik/fart er besluttet.
- [ ] Billedopbevaring og slettefrist er besluttet.
- [ ] Appen er testet med rigtig bruger på mindst tre telefoner.
- [ ] Play-version uden egen APK-install permission er besluttet eller bygget.
