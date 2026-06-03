$ErrorActionPreference = "Stop"

$project = $PSScriptRoot.TrimEnd("\")
$versionFile = Join-Path $project "public\version.json"
$repo = "stralner2711-a11y/xpresshub"
$releaseAssetName = "xpressintra.apk"
$releaseDir = Join-Path $project "release-klargjort"

if (!(Test-Path -LiteralPath $versionFile)) {
  Write-Host "FEJL: version.json blev ikke fundet:"
  Write-Host $versionFile
  exit 1
}

$version = Get-Content -LiteralPath $versionFile -Raw | ConvertFrom-Json
$tag = "v$($version.activeVersion)"
$title = "XpressIntra $($version.activeVersion)"
$apkSource = Join-Path $project "android\app\build\outputs\apk\debug\app-debug.apk"
$apkReady = Join-Path $releaseDir $releaseAssetName

Write-Host "XpressIntra GitHub release"
Write-Host "Repo:    $repo"
Write-Host "Version: $($version.activeVersion)"
Write-Host "Build:   $($version.activeVersionCode)"
Write-Host "Tag:     $tag"
Write-Host ""

$ghCommand = Get-Command gh -ErrorAction SilentlyContinue
$ghPath = if ($ghCommand) { $ghCommand.Source } else { "C:\Program Files\GitHub CLI\gh.exe" }
if (!(Test-Path -LiteralPath $ghPath)) {
  Write-Host "FEJL: GitHub CLI er ikke installeret."
  Write-Host ""
  Write-Host "Installer GitHub CLI herfra:"
  Write-Host "https://cli.github.com/"
  Write-Host ""
  Write-Host "Efter installation:"
  Write-Host "1. Åbn PowerShell"
  Write-Host "2. Kør: gh auth login"
  Write-Host "3. Vælg GitHub.com, HTTPS og browser-login"
  Write-Host "4. Kør denne fil igen"
  exit 1
}

$gitCommand = Get-Command git -ErrorAction SilentlyContinue
if (!$gitCommand) {
  Write-Host "FEJL: Git for Windows er ikke installeret eller findes ikke i PATH."
  Write-Host ""
  Write-Host "Installer Git for Windows herfra:"
  Write-Host "https://git-scm.com/download/win"
  Write-Host ""
  Write-Host "Under installation kan du bare vælge standardindstillinger."
  Write-Host "Luk derefter PowerShell/GitHub Desktop helt op igen, og kør:"
  Write-Host "gh auth login"
  Write-Host ""
  Write-Host "Når login virker, kan du køre denne fil igen."
  exit 1
}

Write-Host "Tjekker GitHub login..."
& $ghPath auth status 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Du er ikke logget ind i GitHub CLI endnu."
  Write-Host "Kør: gh auth login"
  exit 1
}

Write-Host ""
Write-Host "Bygger APK først..."
$env:XPRESSINTRA_AUTO = "1"
& (Join-Path $project "Build Android APK.cmd")
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "APK-build fejlede. Ret build-fejlen før release."
  exit $LASTEXITCODE
}

if (!(Test-Path -LiteralPath $apkSource)) {
  Write-Host "FEJL: APK blev ikke fundet efter build:"
  Write-Host $apkSource
  exit 1
}

if (!(Test-Path -LiteralPath $releaseDir)) {
  New-Item -ItemType Directory -Path $releaseDir | Out-Null
}

Copy-Item -LiteralPath $apkSource -Destination $apkReady -Force
Write-Host ""
Write-Host "APK klar:"
Write-Host $apkReady

$notes = @"
Automatisk XpressIntra release $($version.activeVersion)

Ændringer:
$($version.changelog | ForEach-Object { "- $_" } | Out-String)

Downloadlink:
$($version.apkDownloadUrl)
"@

Write-Host ""
Write-Host "Opretter/opfører GitHub Release..."
$oldErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& $ghPath release view $tag --repo $repo *> $null
$releaseViewExitCode = $LASTEXITCODE
$ErrorActionPreference = $oldErrorActionPreference
if ($releaseViewExitCode -eq 0) {
  Write-Host "Release findes allerede. Uploader APK igen og overskriver asset..."
  & $ghPath release upload $tag $apkReady --repo $repo --clobber
} else {
  Write-Host "Release findes ikke endnu. Opretter ny release..."
  & $ghPath release create $tag $apkReady --repo $repo --title $title --notes $notes
}

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "GitHub Release fejlede."
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Release er klar:"
Write-Host "https://github.com/$repo/releases/tag/$tag"
Write-Host ""
Write-Host "APK-link som appen bruger:"
Write-Host $version.apkDownloadUrl
