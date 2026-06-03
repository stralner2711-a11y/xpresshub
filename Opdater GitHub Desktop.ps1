$ErrorActionPreference = "Stop"

$project = $PSScriptRoot.TrimEnd("\")
$target = Join-Path $env:USERPROFILE "Documents\GitHub\xpresshub"

if (!(Test-Path -LiteralPath $target)) {
  Write-Host "FEJL: GitHub Desktop-mappen blev ikke fundet:"
  Write-Host $target
  Write-Host ""
  Write-Host "Clone repoet i GitHub Desktop til Documents\GitHub\xpresshub og kør filen igen."
  exit 1
}

if (!(Test-Path -LiteralPath (Join-Path $target ".git"))) {
  Write-Host "FEJL: Mappen findes, men den ligner ikke et GitHub repo:"
  Write-Host $target
  exit 1
}

function Sync-Folder($name, $extraArgs = @()) {
  $source = Join-Path $project $name
  $dest = Join-Path $target $name
  if (!(Test-Path -LiteralPath $source)) {
    Write-Host "Springer over, findes ikke: $name"
    return
  }
  Write-Host ""
  Write-Host "Opdaterer mappe: $name"
  robocopy $source $dest /E /NFL /NDL /NJH /NJS /NP @extraArgs | Out-Null
  $code = $LASTEXITCODE
  if ($code -gt 7) { throw "Robocopy fejlede for $name med kode $code" }
}

function Copy-RootFile($name) {
  $source = Join-Path $project $name
  if (Test-Path -LiteralPath $source) {
    Copy-Item -LiteralPath $source -Destination (Join-Path $target $name) -Force
    Write-Host "Opdateret fil: $name"
  }
}

Write-Host "XpressIntra -> GitHub Desktop"
Write-Host "Fra: $project"
Write-Host "Til:  $target"

Sync-Folder "assets"
Sync-Folder "docs"
Sync-Folder "public"
Sync-Folder "qa"
Sync-Folder "src"
Sync-Folder "supabase"
Sync-Folder "tools"
Sync-Folder "android" @(
  "/XD",
  (Join-Path $project "android\.gradle"),
  (Join-Path $project "android\build"),
  (Join-Path $project "android\app\build"),
  (Join-Path $project "android\capacitor-cordova-android-plugins\build")
)

@(
  ".gitignore",
  "Build Android APK.cmd",
  "Build Android APK.ps1",
  "Build Android Release AAB.cmd",
  "Build Android Release AAB.ps1",
  "capacitor.config.json",
  "index.html",
  "manifest.webmanifest",
  "netlify.toml",
  "package-lock.json",
  "package.json",
  "README.md",
  "service-worker.js",
  "Start Ren Web Preview.bat",
  "vercel.json"
) | ForEach-Object { Copy-RootFile $_ }

Write-Host ""
Write-Host "Færdig. Åbn GitHub Desktop, skriv en commit-besked og tryk:"
Write-Host "1. Commit to main"
Write-Host "2. Push origin"
Write-Host ""
Write-Host "Forslag til commit-besked:"
Write-Host "Release 1.2.1 login cleanup and update metadata"
