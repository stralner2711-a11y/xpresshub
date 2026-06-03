# Byg XpressIntra som Android APK

Denne guide pakker webappen som en almindelig Android-app med Capacitor.

## Krav på computeren

Installer først:

- Node.js LTS fra `https://nodejs.org/`
- Android Studio fra `https://developer.android.com/studio`
- Android SDK via Android Studio

Når Android Studio spørger, så installer:

- Android SDK Platform
- Android SDK Build-Tools
- Android Emulator er valgfrit

## Første gang

Åbn en terminal i projektmappen og kør:

```powershell
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Android Studio åbner derefter Android-projektet.

## Hvis `Build Android APK.cmd` siger at Android SDK mangler

Det betyder typisk, at Android Studio er installeret, men første opsætning ikke er færdig.

Gør sådan:

1. Åbn Android Studio.
2. Vælg `More Actions`.
3. Vælg `SDK Manager`.
4. Gå til fanen `SDK Platforms` og installer en Android platform, fx den nyeste stabile.
5. Gå til fanen `SDK Tools`.
6. Installer:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools
7. Tryk `Apply`.
8. Accepter licenser.
9. Luk Android Studio.
10. Kør `Build Android APK.cmd` igen.

## Tilladelser

Når Android-projektet er oprettet, kontroller at `android/app/src/main/AndroidManifest.xml` har disse tilladelser:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

GPS virker kun, hvis brugeren giver tilladelse på telefonen.

## Byg APK

## For rigtigt login i APK

Hvis appen skal kunne logge medarbejdere ind med det samme, skal Supabase saettes op foer APK'en bygges.

1. Opret Supabase-projekt.
2. Koer `supabase/schema.sql` i Supabase SQL Editor.
3. Opret medarbejderne i Supabase Auth.
4. Aabn `public/app-config.js`.
5. Indsaet Supabase `Project URL` og den offentlige `anon/publishable key`.
6. Byg APK'en igen med `Build Android APK.cmd`.

Brug aldrig `service_role` eller hemmelige noegler i appen. Kun den offentlige anon/publishable key maa ligge i APK'en.

Hvis APK'en allerede er installeret uden Supabase, kan du trykke `Opsaet Supabase` paa login-skaermen og indsaette URL/noegle manuelt paa telefonen.

Når `android`-mappen findes, kan APK bygges med:

```powershell
npm run android:apk
```

APK-filen ligger typisk her:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Hvis build fejler, laver projektet en fil der hedder:

```text
android-build-log.txt
```

Åbn den og kig på de sidste linjer. Det er den konkrete fejl, vi skal rette.

Den kan installeres på Android ved at sende filen til telefonen og tillade installation fra ukendte kilder.

## Hvis fejlen er `Permission denied: getsockopt`

Hvis loggen viser noget i stil med:

```text
Downloading https://services.gradle.org/distributions/gradle-8.11.1-all.zip
java.net.SocketException: Permission denied: getsockopt
```

sa betyder det normalt, at Android/Gradle ikke ma hente den fil, den skal bruge for at bygge appen. Det er ikke selve XpressIntra-appen der er i stykker.

Gor sadan:

1. Aabn Android Studio.
2. Vaelg `Open` og aabn denne mappe:

```text
C:\Users\Tommy\Documents\lastbils chauffør app\android
```

3. Lad Android Studio synkronisere Gradle faerdig. Det kan tage lidt tid forste gang.
4. Hvis Windows Firewall, antivirus, VPN eller firma-netvaerk spoerger, saa tillad Java/Android Studio adgang til nettet.
5. Naar Android Studio ikke laengere arbejder, luk det og koer `Build Android APK.cmd` igen.

Hvis det stadig fejler, saa send filen `android-build-log.txt`. De sidste 20 linjer er normalt nok.

## Til rigtig udgivelse

Debug APK er god til intern test. Til rigtig udgivelse skal der bygges en signeret release:

- Android Studio -> Build
- Generate Signed Bundle / APK
- APK eller Android App Bundle
- Opret keystore og gem den sikkert

Google Play kræver normalt `.aab`, mens direkte intern installation kan bruge `.apk`.
