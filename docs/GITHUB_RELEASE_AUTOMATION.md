# Automatisk GitHub release

Filen `Udgiv APK til GitHub.cmd` kan bygge APK og oprette GitHub Release automatisk.

Den kræver GitHub CLI:

1. Installer Git for Windows: https://git-scm.com/download/win
2. Installer GitHub CLI: https://cli.github.com/
3. Luk PowerShell/GitHub Desktop helt.
4. Åbn PowerShell igen.
5. Kør `gh auth login`.
6. Vælg GitHub.com, HTTPS og browser-login.
7. Dobbeltklik `Udgiv APK til GitHub.cmd`.

Scriptet læser version fra `public/version.json`.

For version `1.2.1` opretter den:

- tag: `v1.2.1`
- release title: `XpressIntra 1.2.1`
- asset: `xpressintra.apk`

Appens update-link forventer altid, at APK-filen hedder præcis `xpressintra.apk`.
