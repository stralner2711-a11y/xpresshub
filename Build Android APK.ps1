$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot
$logPath = Join-Path $PSScriptRoot "android-build-log.txt"
if (Test-Path $logPath) { Remove-Item -LiteralPath $logPath -Force }

function Write-Step($message) {
  Write-Host ""
  Write-Host "=== $message ==="
  Add-Content -LiteralPath $logPath -Value "`n=== $message ==="
}

function Add-PathIfExists($path) {
  if ($path -and (Test-Path -LiteralPath $path)) {
    $env:Path = "$path;$env:Path"
  }
}

function Find-AndroidSdk {
  $candidates = @(
    $env:ANDROID_HOME,
    $env:ANDROID_SDK_ROOT,
    (Join-Path $env:LOCALAPPDATA "Android\Sdk"),
    (Join-Path $env:USERPROFILE "AppData\Local\Android\Sdk"),
    "C:\Android\Sdk",
    "C:\Program Files\Android\Sdk"
  ) | Where-Object { $_ }

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) { return $candidate }
  }

  $studioOptions = @(
    (Join-Path $env:APPDATA "Google\AndroidStudio2025.1\options\jdk.table.xml"),
    (Join-Path $env:APPDATA "Google\AndroidStudio2024.3\options\jdk.table.xml"),
    (Join-Path $env:APPDATA "Google\AndroidStudio2024.2\options\jdk.table.xml")
  )
  foreach ($file in $studioOptions) {
    if (!(Test-Path -LiteralPath $file)) { continue }
    $content = Get-Content -LiteralPath $file -Raw
    if ($content -match "Android SDK[^`n]+?homePath[`"']?\s*value=[`"']([^`"']+)") {
      $sdk = [System.Environment]::ExpandEnvironmentVariables($matches[1])
      if (Test-Path -LiteralPath $sdk) { return $sdk }
    }
  }

  return $null
}

function Find-LocalGradleBat {
  $wrapperRoot = Join-Path $env:USERPROFILE ".gradle\wrapper\dists\gradle-8.11.1-all"
  if (!(Test-Path -LiteralPath $wrapperRoot)) { return $null }

  $gradleBat = Get-ChildItem -LiteralPath $wrapperRoot -Recurse -Filter "gradle.bat" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*\gradle-8.11.1\bin\gradle.bat" } |
    Select-Object -First 1

  if ($gradleBat) { return $gradleBat.FullName }
  return $null
}

function Remove-UnusedGoogleServicesPlugin {
  $googleServicesJson = Join-Path $PSScriptRoot "android\app\google-services.json"
  $rootGradle = Join-Path $PSScriptRoot "android\build.gradle"
  $appGradle = Join-Path $PSScriptRoot "android\app\build.gradle"
  if ((Test-Path -LiteralPath $googleServicesJson) -or !(Test-Path -LiteralPath $rootGradle) -or !(Test-Path -LiteralPath $appGradle)) {
    return
  }

  $rootContent = Get-Content -LiteralPath $rootGradle -Raw
  $rootContent = $rootContent -replace "(?m)^\s*classpath 'com\.google\.gms:google-services:[^']+'\s*\r?\n", ""
  [System.IO.File]::WriteAllText($rootGradle, $rootContent, [System.Text.UTF8Encoding]::new($false))

  $appContent = Get-Content -LiteralPath $appGradle -Raw
  $googleServicesBlockPattern = '(?s)\r?\ntry \{\s*def servicesJSON = file\(''google-services\.json''\).*?Push Notifications won''t work"\)\s*\}\s*'
  $appContent = $appContent -replace $googleServicesBlockPattern, "`r`n"
  [System.IO.File]::WriteAllText($appGradle, $appContent, [System.Text.UTF8Encoding]::new($false))
}

function Ensure-OfflineGradleSupport {
  $patches = @(
    @{
      Path = Join-Path $PSScriptRoot "node_modules\@capacitor\android\capacitor\build.gradle"
      BuildscriptNeedle = "repositories {`r`n        google()"
      BuildscriptReplacement = "repositories {`r`n        def offlineRepoPath = System.getenv(`"XPRESSINTRA_GRADLE_OFFLINE_REPO`")`r`n        def offlineRepo = offlineRepoPath ? file(offlineRepoPath) : file(`"../../../../android/offline-maven`")`r`n        if (offlineRepo.exists()) {`r`n            maven { url offlineRepo }`r`n        }`r`n        google()"
      RepositoriesNeedle = "`r`nrepositories {`r`n    google()"
      RepositoriesReplacement = "`r`nrepositories {`r`n    def offlineRepoPath = System.getenv(`"XPRESSINTRA_GRADLE_OFFLINE_REPO`")`r`n    def offlineRepo = offlineRepoPath ? file(offlineRepoPath) : file(`"../../../../android/offline-maven`")`r`n    if (offlineRepo.exists()) {`r`n        maven { url offlineRepo }`r`n    }`r`n    google()"
    },
    @{
      Path = Join-Path $PSScriptRoot "android\capacitor-cordova-android-plugins\build.gradle"
      BuildscriptNeedle = "repositories {`r`n        google()"
      BuildscriptReplacement = "repositories {`r`n        def offlineRepoPath = System.getenv(`"XPRESSINTRA_GRADLE_OFFLINE_REPO`")`r`n        def offlineRepo = offlineRepoPath ? file(offlineRepoPath) : file(`"../offline-maven`")`r`n        if (offlineRepo.exists()) {`r`n            maven { url offlineRepo }`r`n        }`r`n        google()"
      RepositoriesNeedle = "`r`nrepositories {`r`n    google()"
      RepositoriesReplacement = "`r`nrepositories {`r`n    def offlineRepoPath = System.getenv(`"XPRESSINTRA_GRADLE_OFFLINE_REPO`")`r`n    def offlineRepo = offlineRepoPath ? file(offlineRepoPath) : file(`"../offline-maven`")`r`n    if (offlineRepo.exists()) {`r`n        maven { url offlineRepo }`r`n    }`r`n    google()"
    }
  )

  foreach ($patch in $patches) {
    if (!(Test-Path -LiteralPath $patch.Path)) { continue }
    $content = Get-Content -LiteralPath $patch.Path -Raw
    $content = $content -replace "JavaVersion\.VERSION_21", "JavaVersion.VERSION_17"
    if ($content -notmatch "XPRESSINTRA_GRADLE_OFFLINE_REPO") {
      $content = $content.Replace($patch.BuildscriptNeedle, $patch.BuildscriptReplacement)
      $content = $content.Replace($patch.RepositoriesNeedle, $patch.RepositoriesReplacement)
    }
    [System.IO.File]::WriteAllText($patch.Path, $content, [System.Text.UTF8Encoding]::new($false))
  }
}

function Run-Logged($command, $arguments) {
  Write-Host "> $command $($arguments -join ' ')"
  Add-Content -LiteralPath $logPath -Value "> $command $($arguments -join ' ')"
  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $output = @(& $command @arguments 2>&1 | ForEach-Object { "$_" })
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
  $output | ForEach-Object { Write-Host $_ }
  if ($output.Count -gt 0) {
    [System.IO.File]::AppendAllText($logPath, (($output -join [Environment]::NewLine) + [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))
  }
  if ($exitCode -ne 0) {
    throw "Kommando fejlede: $command $($arguments -join ' ')"
  }
}

function Get-GradleBuildArguments {
  $arguments = @("assembleDebug", "--stacktrace", "--no-daemon", "--no-watch-fs", "--no-build-cache", "--max-workers=1")
  if (Test-Path -LiteralPath (Join-Path $PSScriptRoot "android\offline-maven")) {
    $arguments += "--offline"
  }
  return $arguments
}

function Clear-BuiltWebAssets {
  foreach ($relativePath in @(
    "dist",
    "android\app\src\main\assets\public"
  )) {
    $target = Join-Path $PSScriptRoot $relativePath
    if (!(Test-Path -LiteralPath $target)) { continue }
    $resolved = (Resolve-Path -LiteralPath $target).Path
    if (!$resolved.StartsWith($PSScriptRoot, [StringComparison]::OrdinalIgnoreCase)) {
      throw "Sikkerhedsstop: vil ikke rydde udenfor projektmappen: $resolved"
    }
    Remove-Item -LiteralPath $resolved -Recurse -Force
    Add-Content -LiteralPath $logPath -Value "Ryddet gammel web-build: $resolved"
  }
}

Write-Step "XpressIntra Android APK build"

Add-PathIfExists "C:\Program Files\nodejs"
$androidStudioJbrCandidates = @(
  "C:\Program Files\Android\Android Studio\jbr",
  "C:\Program Files\Android\Android Studio1\jbr",
  "C:\Program Files\Android\Android Studio2\jbr"
)
foreach ($jbr in $androidStudioJbrCandidates) {
  $javaExe = Join-Path $jbr "bin\java.exe"
  if (Test-Path -LiteralPath $javaExe) {
    $env:JAVA_HOME = $jbr
    Add-PathIfExists (Join-Path $jbr "bin")
    break
  }
}

$sdk = Find-AndroidSdk
if ($sdk) {
  $env:ANDROID_HOME = $sdk
  $env:ANDROID_SDK_ROOT = $sdk
  Add-PathIfExists (Join-Path $sdk "platform-tools")
  Add-PathIfExists (Join-Path $sdk "cmdline-tools\latest\bin")
  Add-PathIfExists (Join-Path $sdk "tools\bin")
}

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (!$npm) {
  Write-Host "FEJL: npm blev ikke fundet."
  Write-Host "Installer Node.js LTS fra https://nodejs.org/ og genstart computeren."
  exit 1
}

$java = Get-Command java.exe -ErrorAction SilentlyContinue
if (!$java) {
  Write-Host "FEJL: Java blev ikke fundet."
  Write-Host "Aabn Android Studio og lad standard-installationen blive faerdig."
  exit 1
}

if (!$sdk -or !(Test-Path -LiteralPath $sdk)) {
  Write-Host "FEJL: Android SDK blev ikke fundet."
  Write-Host "Aabn Android Studio -> More Actions -> SDK Manager og installer SDK Platform, Build-Tools, Platform-Tools og Command-line Tools."
  exit 1
}

Write-Host "npm: $($npm.Source)"
Write-Host "java: $($java.Source)"
Write-Host "Android SDK: $sdk"
Add-Content -LiteralPath $logPath -Value "npm: $($npm.Source)`njava: $($java.Source)`nAndroid SDK: $sdk"

try {
  if (!(Test-Path -LiteralPath "node_modules")) {
    Write-Step "Installerer app-pakker"
    Run-Logged "npm.cmd" @("install")
  }

  if (!(Test-Path -LiteralPath "android")) {
    Write-Step "Bygger webapp"
    Run-Logged "npm.cmd" @("run", "build")

    Write-Step "Opretter Android-projekt"
    Run-Logged "npx.cmd" @("cap", "add", "android")
  }

  Clear-BuiltWebAssets

  Write-Step "Synkroniserer webapp til Android"
  Run-Logged "npm.cmd" @("run", "android:sync")
  Remove-UnusedGoogleServicesPlugin
  Ensure-OfflineGradleSupport

  $offlinePrep = Join-Path $PSScriptRoot "tools\prepare-gradle-offline-repo.ps1"
  if (Test-Path -LiteralPath $offlinePrep) {
    Write-Step "Klargør lokal Gradle-cache"
    Run-Logged "powershell.exe" @("-ExecutionPolicy", "Bypass", "-File", $offlinePrep)
  }

  Write-Step "Bygger debug APK"
  $buildStartedAt = Get-Date
  $apk = Join-Path $PSScriptRoot "android\app\build\outputs\apk\debug\app-debug.apk"
  if (Test-Path -LiteralPath $apk) {
    Remove-Item -LiteralPath $apk -Force
  }
  $problemReports = Join-Path $PSScriptRoot "android\build\reports\problems"
  if (Test-Path -LiteralPath $problemReports) {
    try {
      Remove-Item -LiteralPath $problemReports -Recurse -Force
    } catch {
      Write-Host "Kunne ikke rydde gammel Gradle-rapport, fortsætter alligevel."
      Add-Content -LiteralPath $logPath -Value "Kunne ikke rydde gammel Gradle-rapport: $($_.Exception.Message)"
    }
  }
  Push-Location -LiteralPath "android"
  try {
    $localGradle = Find-LocalGradleBat
    if ($localGradle) {
      Write-Host "Bruger lokal Gradle: $localGradle"
      Add-Content -LiteralPath $logPath -Value "Bruger lokal Gradle: $localGradle"
      Run-Logged $localGradle (Get-GradleBuildArguments)
    } else {
      Run-Logged ".\gradlew.bat" (Get-GradleBuildArguments)
    }
  } finally {
    Pop-Location
  }

  if (!(Test-Path -LiteralPath $apk)) {
    throw "Build sagde OK, men APK blev ikke fundet: $apk"
  }
  if ((Get-Item -LiteralPath $apk).LastWriteTime -lt $buildStartedAt) {
    throw "Build fandt kun en gammel APK. Ny APK blev ikke dannet."
  }

  Write-Host ""
  Write-Host "APK er bygget:"
  Write-Host $apk
  Add-Content -LiteralPath $logPath -Value "`nAPK er bygget: $apk"
  exit 0
} catch {
  Write-Host ""
  Write-Host "APK-build fejlede."
  Write-Host $_.Exception.Message
  if ((Test-Path -LiteralPath $logPath) -and ((Get-Content -LiteralPath $logPath -Raw) -match "Permission denied: getsockopt|services.gradle.org|dl\.google\.com|repo\.maven\.apache\.org|gradle-[0-9].*\.zip")) {
    Write-Host ""
    Write-Host "Det ligner en Android/Gradle-download der bliver blokeret."
    Write-Host "Aabn Android Studio, aabn mappen 'android', og lad den synkronisere Gradle faerdig."
    Write-Host "Hvis Windows Firewall, antivirus, VPN eller firma-netvaerk spoerger, saa tillad Java/Android Studio adgang til nettet."
    Write-Host "Gradle skal kunne hente fra dl.google.com og repo.maven.apache.org."
    Write-Host "Koer derefter denne fil igen."
  }
  Write-Host ""
  Write-Host "Jeg har gemt den fulde fejl her:"
  Write-Host $logPath
  Write-Host ""
  Write-Host "Send gerne indholdet af android-build-log.txt, hvis den stadig fejler."
  Add-Content -LiteralPath $logPath -Value "`nFEJL: $($_.Exception.Message)"
  exit 1
}
