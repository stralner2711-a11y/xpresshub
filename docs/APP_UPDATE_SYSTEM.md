# XpressIntra opdateringssystem

XpressIntra bruger Supabase til appens daglige data og GitHub kun til app-distribution.

GitHub skal hoste:

- `version.json`
- APK-filer via GitHub Releases
- changelog
- downloadside
- rollback til seneste stabile APK

Supabase skal fortsat bruges til login, profiler, chat, livekort, opslag, logbog og øvrige interne data.

## Officielt repository

Opdateringssystemet peger på dette repository:

- `https://github.com/stralner2711-a11y/xpresshub`
- `https://stralner2711-a11y.github.io/xpresshub/download.html`

Filer der indeholder repo-links:

- `public/version.json`
- `public/download.html`
- `public/app-config.example.js`
- `public/app-config.js`

## version.json

Appen forventer disse felter:

- `activeVersion`
- `activeVersionCode`
- `stableVersion`
- `stableVersionCode`
- `apkDownloadUrl`
- `releasePageUrl`
- `changelog`
- `forceUpdate`
- `rollbackReason`
- `defectiveVersions`

Hvis `forceUpdate` er `true`, skal brugeren opdatere før videre brug.

## Creator workflow

1. Ret appen i Codex.
2. Test appen.
3. Byg ny APK.
4. Opret GitHub Release.
5. Upload APK.
6. Opdater `version.json`.
7. Sæt `forceUpdate` til `true` eller `false`.
8. Brugerne får besked ved næste opstart.

## Rollback

Hvis en version fejler:

1. Åbn `version.json` på GitHub.
2. Sæt `activeVersion` og `activeVersionCode` tilbage til seneste stabile version.
3. Udfyld `rollbackReason`.
4. Tilføj den defekte version i `defectiveVersions`.
5. Sæt `forceUpdate: true`, hvis brugerne skal tvinges tilbage på stabil version.
