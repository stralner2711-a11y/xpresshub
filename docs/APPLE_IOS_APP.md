# XpressIntra Apple/iPhone status

Dato: 2026-06-05

## Kort konklusion

XpressIntra kan bruges p? iPhone som webapp/PWA via Safari og "F?j til hjemmesk?rm". Det er den praktiske l?sning lige nu, fordi vi ikke har Mac og Apple Developer-flow p? plads.

Native iOS/TestFlight er teknisk forberedt i projektet, men upload kr?ver stadig Mac, Xcode og Apple Developer-konto.

## Status i projektet

- `@capacitor/ios` er installeret.
- `ios/`-mappen findes.
- `npm run native:sync` bygger web og synkroniserer b?de Android og iOS.
- Xcode-projektet matcher f?lles version: `1.3.28` / build `41`.
- `Build Apple iOS paa Mac.command` og `tools/build-ios-mac.sh` findes til senere Mac-flow.
- `docs/APPLE_REVIEW_INFO.md` indeholder review-noter og privacy-kladden.

## Anbefalet l?sning nu

Brug iPhone som webapp:

1. ?bn app-linket i Safari.
2. Tryk p? Del-knappen.
3. V?lg "F?j til hjemmesk?rm".
4. ?bn IntraBudet/XpressIntra fra hjemmesk?rmen.

Fordele:

- Ingen Apple Developer-konto n?dvendig.
- Ingen Mac n?dvendig.
- Samme webapp som pc og Android bruger.
- Opdateringer kommer via webappen.

## Native iOS senere

Hvis firmaet senere vil p? TestFlight eller App Store, kr?ver det:

- Mac med Xcode.
- Apple Developer-konto.
- App Store Connect app.
- Offentlig privacy policy URL.
- Testbruger til Apple review.
- Korrekt App Privacy-udfyldelse.
- Test p? mindst ?n rigtig iPhone.

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

## Vigtige beslutninger f?r App Store

1. V?lg endeligt appnavn: `XpressIntra` eller `IntraBudet`.
2. Brug bundle id: `dk.xpressbudet.xpressintra`.
3. Udgiv privacy policy p? en offentlig URL.
4. Lav en review-testbruger.
5. Kontroller iOS app-ikon og launch screen i Xcode.
6. Kontroller at form?lstekster for GPS, kamera og billeder matcher appens reelle brug.

## Vedligeholdelse

N?r webappen ?ndres, brug:

```bash
npm run native:sync
```

P? Windows kan projektet synkroniseres, men egentlig iOS-build, simulator, arkivering og upload skal ske p? Mac.
