# Update QA - 2026-09-05

## Phone

- Samsung SM-S918B connected through wireless ADB.
- Before: 1.3.56 / build 69. Installed public GitHub release 1.3.59 / build 72 using `adb install -r`; result Success.
- Package manager confirms versionName 1.3.59 and versionCode 72.
- App opened the existing signed-in profile and home screen; no app data was cleared.
- Navigated to More. Later the foreground changed to TS Studio with device authentication. No authentication bypass or changes to that other project were attempted.
- Recent captured app-process logs had no matching FATAL, Exception or Uncaught entries. This is a limited log sample, not proof of crash freedom.

## Closed environment

`qa/update-closed-environment.cjs` starts an ephemeral HTTP server on 127.0.0.1. It executes actual version-fetch functions with network access restricted to this server. No production versions, users or databases are modified.

Passed: HTTP 503, invalid JSON, older fallback versus latest version, all sources unavailable, timeout/abort, cache-busting, same-version suppression, optional update dismissal, manual recheck, forced update, rollback visibility/URL selection, foreign APK rejection, HTTPS enforcement, credential-bearing URL rejection, integer build validation.

`qa/update-click-regression.cjs` separately exercises actual update-button logic with simulated browser/native interfaces: web refresh, offline failure, Android dispatch, installer error without opening another browser, and reset of the in-progress guard. Native permission continuation is checked as a source contract, not an Android end-to-end permission test.

Full verification: `npm run qa` passed, 69 smoke tests plus production build.

## Fixes found in this round

- Reject non-HTTPS remote update links and URLs containing credentials. Same-origin HTTP remains permitted only for loopback previews.
- Reject fractional or unsafe integer build codes.
- Abort each stalled version request after 10 seconds and continue to another source.
- Updated both the shared update module and the app's fallback implementation.

These fixes are local and not included in the publicly released build 72 installed on the phone. No release was published during this test.

## Remaining verification

- ADB installation is not a test of the Android in-app downloader or settings return callback.
- Real permission allow/deny, Android package installer confirmation, Play Protect, corrupted APK and signing-key mismatch still require an isolated Android test package/device workflow.
- Rollback selection is tested; actual Android downgrade installation is not. Android can reject installation of a lower versionCode.
- Browser reload is simulated; real Safari/PWA service-worker activation and offline recovery remain device/browser tests.
- No claim that the whole update system has passed end-to-end testing.
