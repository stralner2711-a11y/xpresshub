# XpressIntra drifts- og stabilitetsplan

Dato: 2026-06-04  
Status: Arbejdsplan til stabil intern drift

## Målet

XpressIntra skal kunne bruges af medarbejdere uden at creator hele tiden skal redde småfejl manuelt. Stabil drift betyder:

- medarbejdere kan logge ind
- chat virker
- livekort virker
- profilbilleder virker
- opdateringer kan sendes ud
- Supabase kører korrekt
- der findes en plan ved fejl
- der findes en plan ved mistet telefon
- private data ikke bliver eksponeret

## Driftsniveauer

| Niveau | Betydning | Krav |
| --- | --- | --- |
| Lokal test | Kun creator tester | Webapp, QA-tests og APK-build kan køre. |
| Intern pilot | 2-5 medarbejdere | Rigtig Supabase, rigtige profiler, real-device test og backup. |
| Firma-brug | Flere medarbejdere | Stabil distribution, supportflow, GDPR-godkendelse og incident-plan. |
| Professionel drift | Appen er en del af hverdagen | Overvågning, fast releaseproces, MFA, backup-test og driftsejer. |

## Ugentlig rutine

1. Åbn appen som creator.
2. Test login.
3. Test fælleschat med en kort besked.
4. Test livekort uden at gemme unødvendig historik.
5. Tjek om der er ubehandlede dataanmodninger.
6. Tjek om gamle GPS-/opgavedata ryddes.
7. Tjek Supabase Security Advisor ved ændringer.
8. Tjek om backup er aktiv.
9. Tjek om alle bruger nyeste app-version.
10. Notér fejl i en simpel driftslog.

## Releaseproces

Før ny app-version:

1. Lav ændringen.
2. Kør QA-tests.
3. Kør web build.
4. Kør Android sync.
5. Byg APK.
6. Installer på creators egen telefon.
7. Test login, chat, livekort og kontrolpanel.
8. Udgiv release.
9. Test download/opdatering på en anden telefon.
10. Skriv kort release-note.

Ingen opdatering bør sendes til medarbejdere, hvis login, chat eller GPS er brudt.

## Minimumstest før hver release

- Login med rigtig Supabase-bruger.
- Log ud og log ind igen.
- Fælleschat.
- Direkte besked.
- Lastbilchat/varebilchat efter rolle.
- Profilbillede-upload.
- Livekort og stop deling.
- Mød ind og automatisk stop.
- Kontrolpanel kun for creator/admin.
- Medarbejder må ikke se creator-knapper.

## Supabase drift

Supabase skal behandles som appens rigtige motor.

Minimumskrav:

- RLS slået til på alle tabeller med persondata.
- Storage bucket `xpressintra-media` er privat.
- Kun public publishable/anon key i appen.
- Ingen service-role key i frontend, APK, GitHub eller public mapper.
- Backups er slået til.
- Security Advisor gennemgås før pilot og efter større SQL-ændringer.
- Første admin/creator er sat via kontrolleret SQL.
- Fratrådte medarbejdere deaktiveres hurtigt.

## Fejltyper og reaktion

| Fejl | Alvor | Handling |
| --- | --- | --- |
| Login virker ikke | Høj | Stop release, test Supabase/Auth, informér brugere hvis drift påvirkes. |
| Chat virker ikke | Høj | Tjek conversations/messages/policies og Realtime. |
| GPS gemmes ikke | Middel/høj | Tjek `location_shares`, RLS, app-version og permissions. |
| Profilbilleder virker ikke | Middel | Tjek Storage bucket, MIME/filstørrelse og signed URLs. |
| Creator-knapper synlige for medarbejder | Kritisk | Stop release og ret adgangskontrol. |
| Privat chat synlig for forkert rolle | Kritisk | Stop app-brug, undersøg RLS/policies og informer ledelse. |
| APK-opdatering virker ikke | Middel | Brug manuel download eller skift til Google Play Internal Testing. |

## Incident-plan

Ved alvorlig sikkerhedsfejl:

1. Stop ny distribution af appen.
2. Deaktiver berørte brugere hvis nødvendigt.
3. Skift adgangskoder/tokens hvis der er mistanke om læk.
4. Tjek Supabase logs og adminlog.
5. Find hvilke data der kan være berørt.
6. Informér chef/ledelse.
7. Vurder om medarbejdere eller Datatilsynet skal informeres.
8. Ret fejlen.
9. Test rettelsen på mindst to telefoner.
10. Skriv kort intern hændelsesrapport.

## Mistet telefon

1. Deaktiver medarbejderen midlertidigt i Supabase/app-admin.
2. Skift adgangskode eller nulstil login.
3. Revoke sessioner hvis muligt.
4. Stop aktive lokationsdelinger.
5. Tjek seneste login/aktivitet.
6. Opret ny adgang når medarbejderen har ny/sikker telefon.

## Fratrådt medarbejder

1. Deaktiver profil.
2. Fjern adgang til appen.
3. Stop aktive GPS-delinger.
4. Bevar kun nødvendige driftsdata efter slettepolitik.
5. Slet/anonymiser unødvendige persondata efter fast frist.
6. Bevar ikke private direkte beskeder længere end nødvendigt.

## Backup og gendannelse

Før rigtig firma-brug:

- Supabase backup skal være aktiv.
- Der skal laves én test af gendannelse i et testmiljø.
- SQL-schema skal gemmes samlet og versionsstyres.
- Releasepakker skal kunne genskabes.
- Creator skal vide hvilken fil der er den nyeste fulde SQL.

## Overvågning der bør bygges næste gang

I creator-drift bør appen vise:

- aktuel app-version
- nyeste release-version
- Supabase online/offline
- Auth online/offline
- Storage online/offline
- antal aktive brugere
- antal brugere på gammel version
- seneste loginfejl
- seneste GPS-fejl
- ubehandlede dataanmodninger
- seneste backup-status, hvis Supabase/API giver adgang

Ingen overvågning må vise privat chatindhold.

## Stabilitetsmål før bred udrulning

XpressIntra bør ikke udrulles bredt før:

- 7 dage uden kritisk loginfejl.
- 7 dage uden forkert chatadgang.
- 7 dage uden GPS-fejl der spammer brugeren.
- 3 telefoner har testet opdatering.
- 3 telefoner har testet profilbilleder.
- Supabase Security Advisor er gennemgået.
- GDPR-dokumentationen er godkendt af ledelsen.
- Der findes en navngivet driftsansvarlig.
