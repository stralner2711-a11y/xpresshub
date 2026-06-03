# Google Play intern test

Denne guide er til XpressIntra, når appen skal deles med medarbejdere via et lukket Google Play-link.

## 1. Byg Play Store-filen

Kør:

```text
Build Android Release AAB.cmd
```

Første gang bliver du bedt om en adgangskode til appens release-nøgle.

Vigtigt:

- Gem adgangskoden sikkert.
- Gem filen `android/app/release/xpressintra-release.jks` sikkert.
- Uden samme nøgle kan du ikke udgive opdateringer til samme app senere.

Når builden er færdig, skal denne fil uploades til Google Play Console:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## 2. Opret app i Google Play Console

1. Gå til `https://play.google.com/console`.
2. Opret en ny app.
3. Brug navnet `XpressIntra`.
4. Vælg app og intern distribution/test.
5. Udfyld de påkrævede app-oplysninger.

Appikon til Play Console ligger her:

```text
assets/xpressintra-play-icon-512.png
```

## 3. Opret intern test

1. Gå til `Test and release`.
2. Vælg `Testing`.
3. Vælg `Internal testing`.
4. Opret en ny release.
5. Upload `app-release.aab`.
6. Tilføj medarbejdernes Gmail-adresser som testere.
7. Kopier testlinket og send det til medarbejderne.

## 4. Fremtidige opdateringer

Ved hver ny version:

1. Ret appen.
2. Kør `Build Android Release AAB.cmd`.
3. Upload den nye `app-release.aab` i samme interne testspor.

Hvis Google Play afviser filen fordi versionsnummeret allerede findes, skal `versionCode` hæves i:

```text
android/app/build.gradle
```

Eksempel:

```gradle
versionCode 2
versionName "1.1"
```
