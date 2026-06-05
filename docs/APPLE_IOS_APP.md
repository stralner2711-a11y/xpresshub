# XpressIntra Apple/iPhone status

Dato: 2026-06-05

## Kort konklusion

XpressIntra kan bruges på iPhone som webapp/PWA via Safari og "Føj til hjemmeskærm". Det er den praktiske løsning lige nu, fordi vi ikke har Mac og Apple Developer-flow på plads.

Native iOS/TestFlight er teknisk forberedt i projektet, men upload kræver stadig Mac, Xcode og Apple Developer-konto.

## Status i projektet

- `@capacitor/ios` er installeret.
- `ios/`-mappen findes.
- `npm run native:sync` bygger web og synkroniserer både Android og iOS.
- Xcode-projektet matcher fælles version: `1.3.25` / build `38`.
- `Build Apple iOS paa Mac.command` og `tools/build-ios-mac.sh` findes til senere Mac-flow.
- `docs/APPLE_REVIEW_INFO.md` indeholder review-noter og privacy-kladden.

## Anbefalet løsning nu

Brug iPhone som webapp:

1. Åbn app-linket i Safari.
2. Tryk på Del-knappen.
3. Vælg "Føj til hjemmeskærm".
4. Åbn IntraBudet/XpressIntra fra hjemmeskærmen.

Fordele:

- Ingen Apple Developer-konto nødvendig.
- Ingen Mac nødvendig.
- Samme webapp som pc og Android bruger.
- Opdateringer kommer via webappen.

## Native iOS senere

Hvis firmaet senere vil på TestFlight eller App Store, kræver det:

- Mac med Xcode.
- Apple Developer-konto.
- App Store Connect app.
- Offentlig privacy policy URL.
- Testbruger til Apple review.
- Korrekt App Privacy-udfyldelse.
- Test på mindst én rigtig iPhone.

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

## Vigtige beslutninger før App Store

1. Vælg endeligt appnavn: `XpressIntra` eller `IntraBudet`.
2. Brug bundle id: `dk.xpressbudet.xpressintra`.
3. Udgiv privacy policy på en offentlig URL.
4. Lav en review-testbruger.
5. Kontroller iOS app-ikon og launch screen i Xcode.
6. Kontroller at formålstekster for GPS, kamera og billeder matcher appens reelle brug.

## Vedligeholdelse

Når webappen ændres, brug:

```bash
npm run native:sync
```

På Windows kan projektet synkroniseres, men egentlig iOS-build, simulator, arkivering og upload skal ske på Mac.
