# XpressIntra Apple/iPhone status

Dato: 2026-07-05

## Kort konklusion

XpressIntra er teknisk forberedt som rigtig iPhone/iOS-app via Capacitor. Den rigtige iPhone-vej er TestFlight først og eventuelt App Store/Apple Business Manager senere.

Selve signering, test på rigtig iPhone og upload kræver stadig Mac med Xcode og en Apple Developer-konto. Det er Apples krav for rigtige iPhone-apps.

## Status i projektet

- `@capacitor/ios` er installeret.
- `ios/`-mappen findes og har Xcode workspace.
- Bundle id er `dk.xpressbudet.xpressintra`.
- iOS-projektet matcher fælles version: `1.3.49` / build `62`.
- Apple-tilladelsestekster for GPS, kamera og billeder er sat på dansk.
- `npm run native:sync` bygger web og synkroniserer både Android og iOS-assets.
- `Build Apple iOS paa Mac.command` og `tools/build-ios-mac.sh` findes til Mac-flow.
- `docs/APPLE_REVIEW_INFO.md` indeholder kladde til App Store/TestFlight review.

## Rigtig iPhone-app

Hvis firmaet vil bruge TestFlight eller App Store, kræver det:

- Mac med Xcode.
- Apple Developer-konto.
- App Store Connect app.
- Offentlig privacy policy URL.
- Testbruger til Apple review.
- Korrekt App Privacy-udfyldelse.
- Test på mindst én rigtig iPhone.

Når appen ligger i TestFlight, installerer medarbejderen den som en rigtig iPhone-app via Apples TestFlight-app.

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
2. Behold bundle id: `dk.xpressbudet.xpressintra`.
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
