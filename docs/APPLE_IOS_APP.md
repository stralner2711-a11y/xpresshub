# XpressIntra Apple/iPhone status

Dato: 2026-06-05

## Kort konklusion

XpressIntra kan bruges p iPhone som webapp/PWA via Safari og "Fj til hjemmeskrm". Det er den praktiske lsning lige nu, fordi vi ikke har Mac og Apple Developer-flow p plads.

Native iOS/TestFlight er teknisk forberedt i projektet, men upload krver stadig Mac, Xcode og Apple Developer-konto.

## Status i projektet

- `@capacitor/ios` er installeret.
- `ios/`-mappen findes.
- `npm run native:sync` bygger web og synkroniserer bde Android og iOS.
- Xcode-projektet matcher flles version: `1.3.28` / build `41`.
- `Build Apple iOS paa Mac.command` og `tools/build-ios-mac.sh` findes til senere Mac-flow.
- `docs/APPLE_REVIEW_INFO.md` indeholder review-noter og privacy-kladden.

## Anbefalet lsning nu

Brug iPhone som webapp:

1. bn app-linket i Safari.
2. Tryk p Del-knappen.
3. Vlg "Fj til hjemmeskrm".
4. bn IntraBudet/XpressIntra fra hjemmeskrmen.

Fordele:

- Ingen Apple Developer-konto ndvendig.
- Ingen Mac ndvendig.
- Samme webapp som pc og Android bruger.
- Opdateringer kommer via webappen.

## Native iOS senere

Hvis firmaet senere vil p TestFlight eller App Store, krver det:

- Mac med Xcode.
- Apple Developer-konto.
- App Store Connect app.
- Offentlig privacy policy URL.
- Testbruger til Apple review.
- Korrekt App Privacy-udfyldelse.
- Test p mindst n rigtig iPhone.

## App Privacy kladde

Forvent at deklarere disse datatyper, hvis funktionerne er aktive:

| Datatype | Forventet svar | Hvorfor |
| --- | --- | --- |
| Contact Info | Ja | Navn, email og eventuelt telefon i medarbejderprofiler/login. |
| Location | Ja | Frivillig GPS/livekort og afhentningsopgaver. |
| User Content | Ja | Chat, opslag, billeder, logbog og opgaver. |
| Identifiers | Ja | Supabase Auth-bruger og interne profil-id'er. |
| Usage Data | Muligvis | Arbejdsdag, opgaver, notifikationer og logbog, hvis det gemmes centralt. |
| Diagnostics | Kun hvis aktivt indsamlet | Deklareres kun hvis der senere bruges egentlig crash- eller diagnostiksporing. |

## Vigtige beslutninger fr App Store

1. Vlg endeligt appnavn: `XpressIntra` eller `IntraBudet`.
2. Brug bundle id: `dk.xpressbudet.xpressintra`.
3. Udgiv privacy policy p en offentlig URL.
4. Lav en review-testbruger.
5. Kontroller iOS app-ikon og launch screen i Xcode.
6. Kontroller at formlstekster for GPS, kamera og billeder matcher appens reelle brug.

## Vedligeholdelse

Nr webappen ndres, brug:

```bash
npm run native:sync
```

P Windows kan projektet synkroniseres, men egentlig iOS-build, simulator, arkivering og upload skal ske p Mac.
