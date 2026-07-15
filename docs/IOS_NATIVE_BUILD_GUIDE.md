# Rigtig iPhone-app til XpressIntra

Målet er en rigtig iPhone-app, som medarbejdere kan installere via TestFlight eller senere App Store/Apple Business Manager.

Vigtigt: Apple tillader ikke en almindelig APK-lignende fil til iPhone. En rigtig iPhone-app skal signeres og udgives via Apples system. Derfor kræver sidste trin en Mac med Xcode og en Apple Developer-konto.

## Status lige nu

- XpressIntra har allerede et iPhone/iOS-projekt i `ios/App/App.xcworkspace`.
- App-id er `dk.xpressbudet.xpressintra`.
- Versionen matcher Android/web: `1.3.52` / build `65`.
- GPS, kamera og billeder har Apple-tilladelsestekster.
- Webapp, Supabase, chat, livekort og login er samme kodebase som Android.

## Den rigtige vej til iPhone

1. Lav iOS-pakken fra Windows-projektet.
2. Åbn pakken på en Mac.
3. Byg appen i Xcode.
4. Upload til TestFlight.
5. Inviter iPhone-brugere via email eller offentlig TestFlight-link.

## Hvad medarbejderen gør

Når appen ligger i TestFlight:

1. Medarbejderen installerer Apples `TestFlight` app fra App Store.
2. Medarbejderen åbner invitationen fra XpressBudet.
3. Medarbejderen trykker `Installer`.
4. XpressIntra ligger derefter som en rigtig app på iPhone.

## Det vi stadig mangler for rigtig iPhone-installation

- Apple Developer-konto.
- Adgang til en Mac med Xcode.
- En TestFlight-build uploadet til App Store Connect.
- Privacy policy URL.
- Testbruger til Apple review.
- App Privacy udfyldt.

## Hvad Windows-pc'en kan gøre

Windows kan gøre projektet klar og pakke filerne, men Windows kan ikke signere eller uploade iPhone-appen. Det er en Apple-begrænsning, ikke en fejl i XpressIntra.

## Anbefalet næste skridt

Få adgang til en Mac i kort tid. Det behøver ikke være din egen permanent. Når Mac'en er klar, kan vi bruge projektets iOS-mappe til at lave første TestFlight-version.
