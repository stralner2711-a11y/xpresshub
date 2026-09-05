# XpressIntra 1.3.56 / build 69

Klargjort 2026-09-05. Ikke offentliggjort paa GitHub eller Vercel i denne runde.

## Rettelser

- Alle rettelser beskrevet i QA_FIXES_AND_LOAD_2026-09-05.md er med.
- Supplerende beskedindhentning straks og efter 2, 10 og 30 sekunder ved
  etableret abonnement, online, fokus og tilbagevenden til synlig app.
- Timere erstattes ved gentagen aktivering og ryddes ved logout. Gamle
  sessioners timere maa ikke hente data for en efterfoelgende bruger.
- Ny regressionstest reproducerer et gemt, men ikke live-leveret foerste
  event og kontrollerer, at efterfoelgende indhentning finder beskeden.
- Android MainActivity anvender systembar/display-cutout insets, saa appens
  menu ikke ligger under telefonens systemnavigation.
  Reference: https://developer.android.com/develop/ui/views/layout/edge-to-edge
- Faelles version, Android/iOS-buildnumre, serviceworker-cache, downloadlinks
  og version.json-kopier er opdateret. Tidligere rollback-version er 1.3.55.

## Bestaaet

- npm run qa: 66 tests og produktionsbuild.
- npm run native:sync: Android og iOS web-assets.
- npm run ios:check: versions-/projekt-/tilladelseskontrol.
- Gradle assembleDebug med Java 21: BUILD SUCCESSFUL, ogsaa efter insets-rettelsen.
- APK-signatur matcher forventet SHA-256:
  08aacb4b73316ff2d94e8f9907be6131cd67d276af00eaf5c7b3ca68dffa1043.
- tools/github-release-check.ps1 -LocalOnly: APK og version.json matcher build 69.
- Samsung SM-S918B: adb install -r fra build 68 til 69 lykkedes uden sletning
  af appdata. Package Manager bekraeftede 1.3.56/build 69.
- Appen aabnede forsiden med bevaret Tommy-login. Kortet kunne aabnes via
  forsidegenvejen. Ingen Uncaught/TypeError/FATAL i den afgraensede app-logproeve.
- Github CLI-login og korrekt remote verificeret. Seneste offentliggjorte
  release er stadig 1.3.55; repoet er ikke kopieret/pushet her.

## Telefonfund og forbehold

Den foerste telefonproeve viste overlap mellem bundmenu og Android-navigation.
Tryk i nederste del virkede ikke, mens oevers­te del og forsidegenvejen virkede.
Insets-rettelsen blev bygget og installeret med succes bagefter. Telefonen
blev derefter laast, saa den sidste visuelle/menu-gentest af rettelsen mangler.
Brugeren er bedt om at laase op; laaseskaermen er ikke omgaaet.

Efter brugerens oplaasning blev gentesten gennemfoert: Live-kort, Arbejde,
Beskeder, Mere og Forside kunne alle aabnes med tryk midt paa bundmenuens
knapper. UI-trae bekraeftede korrekt side efter hvert tryk. Screenshot
qa/android-build69-verified.png viser menuen fri af Android-navigationen.
Ingen Uncaught, TypeError, FATAL eller Error: i den kontrollerede proeves
seneste 150 app-loglinjer. Det er en afgraenset navigationskontrol, ikke
en gentest af alle funktioner. Telefonen blev efterladt paa forsiden med
bevaret login; GPS-deling og arbejdsdag blev ikke aktiveret.

Foerste Realtime-event har tidligere udeblevet i en realtest. Den nye recovery
er en afboedning, ikke et bevis paa at Supabases opstartsproblem er fjernet.
Gentesten af timere er lokal med falsk netvaerk; tidligere live-maalinger
findes i QA_REALISTIC_NETWORK_2026-09-05.md og maa ikke kaldes nye maalinger.

Fysisk iPhone/Safari, notifikationer i baggrunden, GPS under koersel samt
download/install fra den kommende offentlige release er endnu ikke testet.
Ingen nye brugere eller SQL-aendringer i denne sidste klargoeringsrunde.

## Artefakt

release-klargjort/xpressintra.apk er den nybyggede lokale kontrol-APK.
Den er ikke en allerede offentliggjort release. Offentlig version.json skal
foerst distribueres sammen med en tilgaengelig APK paa det nye release-link.
