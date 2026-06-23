# Android/Gradle netvaerksdiagnose

Dato: 2026-06-23

## Konklusion

APK-buildet fejler ikke paa grund af XpressIntra-koden. Web-build og QA passer.

Fejlen kommer naar Gradle skal hente Android Gradle Plugin:

`com.android.tools.build:gradle:8.7.2`

Gradle proever at hente fra:

- `https://dl.google.com/dl/android/maven2/...`
- `https://repo.maven.apache.org/maven2/...`

I Codex-terminalen bliver udgaaende HTTPS-forbindelser blokeret:

`Permission denied: getsockopt`

En direkte web-test fra samme terminal fejler med samme type fejl:

`SocketException: adgang til socket er forbudt af adgangstilladelser`

Det betyder, at problemet er netadgang i Codex/sandbox-terminalen, ikke selve appen.

## Hvad blev tjekket

- Ingen proxy er sat i `HTTP_PROXY`, `HTTPS_PROXY`, `GRADLE_USER_HOME`, `JAVA_HOME`, `ANDROID_HOME` eller `ANDROID_SDK_ROOT`.
- `dl.google.com` kan navneoploeses/pinges, men TCP/HTTPS paa port 443 fejler.
- Gradle offline-build fejler, fordi cachen ikke er komplet:
  `No cached version of com.android.tools.build:gradle:8.7.2 available for offline mode.`
- Der findes nogle lokale cache-filer for `8.7.2`, men Gradle har ikke en fuld brugbar offline metadata-cache.

## Praktisk loesning

Koer Android Studio/Gradle-download uden for Codex-sandboxen:

1. Aabn Android Studio.
2. Aabn projektets `android`-mappe.
3. Lad Gradle Sync hente faerdig.
4. Hvis Windows Firewall eller antivirus spoerger, tillad Android Studio/Java adgang til nettet.
5. Koer derefter `KLIK HER - OPDATER ALT.cmd` eller `Build Android APK.cmd` igen.

Naar Gradle har hentet pakken korrekt en gang, kan Codex normalt bygge videre lokalt.

