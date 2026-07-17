# XpressIntra professionel QA - v1.3.53 build 66

Dato: 15. juli 2026  
Miljø: Windows 11, Vite 7.3.6, Capacitor 7.6.8, Android SDK 35, Gradle 8.11.1, Supabase projekt `mtfbdoajzmlgqbeiubxe`

## Konklusion

XpressIntra v1.3.53 build 66 er teknisk egnet til en kontrolleret intern betatest med 1-5 kollegaer. Produktionsbuild, 51 automatiske QA-kontroller, Android-build, Android Lint, versionskæde, Supabase-endpoint, RLS-status og centrale browserflows består.

Udgaven bør endnu ikke kaldes fuldt valideret til bred drift. De vigtigste resterende beviser kræver to fysiske brugere og rigtige telefoner: live-chat, direkte beskeder, GPS-deling over tid, Android-opdatering/rollback samt iPhone Safari/PWA.

## Vigtigste rettelser

1. GPS-synkronisering stopper nu sikkert, når login-sessionen er udløbet, i stedet for at sende en fejlet forespørgsel hvert sekund.
2. Midlertidige netværksfejl på livekortet får 15 sekunders pause og én forståelig besked i stedet for gentagne popups.
3. Direkte beskeder håndterer tomme RPC-svar uden `Cannot read properties of null`.
4. Global søgning er normaliseret og sender brugeren til den præcise funktion.
5. Profilens personlige stillingsbetegnelse bevares, mens adgangsrollen fortsat styres separat.
6. Creatorens gamle fejlkonverterede titel er repareret til `Appansvarlig · Lastbilchauffør` i databasen.
7. Afhentningsflowets standardtjekliste starter korrekt som uafsluttet, og GPS følger den valgte delingsperiode.
8. Android-buildscripts læser nu den rigtige proceskode og accepterer ikke en gammel APK efter en fejlet Gradle-kørsel.
9. Android-backup og enhedsoverførsel har eksplicitte regler, der udelukker alle lokale appdata.
10. Brede kamera- og billedbibliotekstilladelser er fjernet; appen bruger systemets fil-/billedvælger.
11. Service-worker, PWA, downloadside, APK og versionsfiler er samlet på build 66.
12. Eksterne links og medie-URL'er valideres før åbning eller visning.

## Automatiske kontroller

| Kontrol | Resultat | Dokumentation |
| --- | --- | --- |
| Produktionsbuild | Bestået | Vite byggede 61 moduler uden fejl |
| QA-pakke | Bestået | 51 smoke tests + build |
| Pakkeafhængigheder | Bestået | `npm audit`: 0 kendte sårbarheder |
| Android APK | Bestået | Gradle `assembleDebug`: BUILD SUCCESSFUL |
| Android metadata | Bestået | `dk.xpressbudet.xpressintra`, v1.3.53, code 66, minSdk 23, targetSdk 35 |
| Android Lint | Bestået med noter | 0 fejl, 13 vedligeholdelsesadvarsler |
| Android/iOS assets | Bestået | `npm run native:sync` gennemført |
| iOS-klargøring | Bestået med begrænsning | Version 1.3.53/code 66 og privacy-tekster matcher; Xcode-build kræver Mac |
| Releasekandidat | Bestået | APK og alle versionsfiler matcher 1.3.53/code 66 |
| Supabase endpoint | Bestået | Auth endpoint svarede HTTP 200 |
| Tekstkvalitet | Bestået | 192 filer scannet for ødelagte danske tegn |

Endelig APK før udgivelse:

- Størrelse: 4.322.848 bytes
- SHA-256: `ECE27A0E4915320B83D1014F122B0E10964C39BFFEC5CEE6EDC514A4DC73A310`

## Supabase og adgangskontrol

Frisk live-kontrol af XpressIntra-delen gav:

- 26 XpressIntra-tabeller i `public`; alle 26 har RLS aktiveret.
- 0 tabelrettigheder til den anonyme database-rolle.
- 0 offentlige `SECURITY DEFINER`-funktioner, som `anon` kan udføre.
- 1 owner/creator efter reparation af profilens titel.
- 0 dubletter blandt aktive invitationer pr. e-mail.
- `messages`, `location_shares`, `notifications` og `announcements` findes i Realtime-publicationen.
- Storage-bucket `xpressintra-media` er privat.
- TruckLex-tabeller blev kun observeret og ikke ændret.

Adgangsmatricen er kontrolleret i SQL, RLS-definitioner og automatiske tests:

| Krav | Resultat |
| --- | --- |
| Medarbejder kan ikke ændre egen adgangsrolle eller gøre sig selv admin | Bestået |
| Medarbejder kan ikke oprette invitationer | Bestået |
| Medarbejder kan ikke åbne creator-/adminfunktioner | Bestået i frontend og database |
| Medarbejder kan ikke slette andres indhold | Bestået |
| Direkte beskeder kan kun læses af samtalens medlemmer | Bestået i RLS/RPC; fysisk tobrugertest mangler |
| GPS læses kun af aktive, godkendte medarbejdere inden for valgt målgruppe | Bestået i RLS; fysisk tobrugertest mangler |
| Admin kan administrere medarbejdere, men ikke overtage owner-niveau | Bestået |
| Owner har fuld intern administrationsadgang | Bestået |
| Invitation er bundet til UUID og e-mail, udløber og kan kun bruges én gang | Bestået |
| Standardkoden virker ikke uden en gyldig invitation | Bestået |

Tre offentlige `SECURITY DEFINER`-funktioner findes. To af dem er de bevidste, autentificerede RPC'er til at starte en direkte samtale. De kontrollerer den aktuelle bruger og målbrugeren i funktionen, og `anon` har ikke execute-adgang. Supabase Advisor markerer dem fortsat som manuel gennemgang, fordi de er privilegerede RPC'er.

Supabase Security Advisor har fortsat disse platform-/konfigurationsnoter:

- Leaked-password protection er ikke aktiv og kræver Supabase Pro.
- Flere MFA-metoder anbefales; den tilgængelige MFA er slået til, men fuld håndhævelse afhænger af plan og valgt loginflow.
- De to direkte-chat-RPC'er skal blive i den faste sikkerhedsreview-rutine.

Performance Advisor viser 46 RLS-initplan-noter, 11 overlappende permissive policies og 14 aktuelt ubrugte XpressIntra-indekser. Det er optimeringsarbejde, ikke bevis på ulovlig adgang, og bør ændres i en separat migration med belastningstest.

## Brugerflade og flows

Appen blev gennemgået i den indbyggede browser på desktop og mobilbredde 390 px. Mobilvisningen havde samme `scrollWidth` og `innerWidth`, altså ingen vandret overflow.

Kontrollerede flows:

- Login, afventende godkendelse og adgangsafvisning.
- Forside, arbejde/mød ind, logbog og afhentning for kollega.
- Livekort, delingsperiode, målgruppe og GPS-fejltilstande.
- Fælleschat, køretøjskanaler og direkte samtaler.
- Opslag, notifikationer og creatorens rediger/slet-handlinger.
- Profil, medarbejderliste, invitationer og rollebaseret navigation.
- Global søgning og præcise genveje.
- Creatorens drifts- og sikkerhedspanel.

Layoutet er responsivt og uden kendte scroll-låse i de gennemgåede fixtures. Knapper og primære handlinger har mobilvenlige mål, og creatorværktøjer er skjult for medarbejdere. En rigtig telefon med Android WebView kan stadig opføre sig anderledes end browser-fixtures og indgår derfor i den resterende fysiske test.

## Filer ændret i denne runde

Kerne:

- `src/app.js`
- `src/modules/chat.js`
- `src/styles.css`
- `package.json`
- `package-lock.json`

Database og sikkerhed:

- `supabase/migrations/20260715194500_owner_invitation_and_content_hardening.sql`
- `supabase/migrations/20260715210315_repair_legacy_profile_text.sql`
- `supabase/schema.sql`
- `supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql`

Android, PWA og release:

- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/res/xml/backup_rules.xml`
- `android/app/src/main/res/xml/data_extraction_rules.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`
- `Build Android APK.ps1`
- `Build Android Release AAB.ps1`
- `public/service-worker.js`
- `service-worker.js`
- `public/version.json`
- `docs/version.json`
- `version.json`
- `public/download.html`
- `tools/bump-version.cjs`

QA:

- 16 eksisterende QA-filer blev udvidet.
- `qa/android-build-script-smoke-test.cjs` blev tilføjet.
- `qa/content-url-safety-smoke-test.cjs` blev tilføjet.
- `qa/browser-preview.html` blev opdateret til de seneste flows.

## 10 vigtigste resterende forbedringer

1. Gennemfør en dokumenteret tobrugertest af fælleschat og direkte beskeder på to rigtige konti.
2. Gennemfør en 30-60 minutters tobrugertest af GPS, baggrund, skærmlås, forældede positioner og stop af deling.
3. Test installation, tvungen opdatering og rollback på mindst to fysiske Android-enheder.
4. Test Safari/PWA, hjemskærmsinstallation, login, chat og kort på en fysisk iPhone.
5. Byg og signer den native iOS-app på Mac, hvis App Store-sporet genoptages.
6. Aktivér leaked-password protection, når Supabase-planen understøtter det.
7. Beslut om owner/creator skal kræve MFA/AAL2 til særligt følsomme handlinger.
8. Optimer RLS-initplaner og saml overlappende policies i en særskilt, benchmark-testet migration.
9. Etablér serverstyrede pushnotifikationer, hvis beskeder skal komme sikkert frem, når webappen er helt lukket.
10. Gennemfør og dokumentér backup/restore-, rollback-, databrud- og registreret-anmodningsøvelser før bred drift.

## Frigivelsesvurdering

**Anbefaling: GODKENDT til lukket intern beta med 1-5 kollegaer.**

Udgivelsen må sendes, når den automatiske publicering har verificeret GitHub Release, downloadside, Vercel-version og APK-hash. Den næste milepæl er ikke flere funktioner, men fysisk accepttest og driftsøvelse med de personer, der faktisk skal bruge appen.
