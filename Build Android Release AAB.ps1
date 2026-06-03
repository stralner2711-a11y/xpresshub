$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot
$logPath = Join-Path $PSScriptRoot "android-release-build-log.txt"
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

function Run-Logged($command, $arguments) {
  Write-Host "> $command $($arguments -join ' ')"
  Add-Content -LiteralPath $logPath -Value "> $command $($arguments -join ' ')"
  & $command @arguments 2>&1 | Tee-Object -FilePath $logPath -Append
  if ($LASTEXITCODE -ne 0) {
    throw "Kommando fejlede: $command $($arguments -join ' ')"
  }
}

function Read-PlainPassword($prompt) {
  $secure = Read-Host $prompt -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

function Ensure-ReleaseKeystore {
  $androidDir = Join-Path $PSScriptRoot "android"
  $appReleaseDir = Join-Path $androidDir "app\release"
  $keystorePath = Join-Path $appReleaseDir "xpressintra-release.jks"
  $propertiesPath = Join-Path $androidDir "keystore.properties"
  $alias = "xpressintra"

  if ((Test-Path -LiteralPath $keystorePath) -and (Test-Path -LiteralPath $propertiesPath)) {
    Write-Host "Release-noegle fundet: $keystorePath"
    return
  }

  Write-Step "Opretter release-noegle"
  Write-Host "VIGTIGT: Gem adgangskoden. Den skal bruges til fremtidige Play Store-opdateringer."
  $password = Read-PlainPassword "Skriv en ny adgangskode til app-noeglen"
  $confirm = Read-PlainPassword "Skriv den samme adgangskode igen"
  if ($password -ne $confirm) {
    throw "Adgangskoderne var ikke ens. Koer scriptet igen."
  }
  if ($password.Length -lt 8) {
    throw "Adgangskoden skal vaere mindst 8 tegn."
  }

  if (!(Test-Path -LiteralPath $appReleaseDir)) {
    New-Item -ItemType Directory -Path $appReleaseDir | Out-Null
  }

  $keytool = Get-Command keytool.exe -ErrorAction SilentlyContinue
  if (!$keytool) {
    throw "keytool.exe blev ikke fundet. Aabn Android Studio en gang, eller installer Java/Android Studio."
  }

  Run-Logged $keytool.Source @(
    "-genkeypair",
    "-v",
    "-keystore", $keystorePath,
    "-alias", $alias,
    "-keyalg", "RSA",
    "-keysize", "2048",
    "-validity", "10000",
    "-storepass", $password,
    "-keypass", $password,
    "-dname", "CN=XpressBudet, OU=Internal, O=XpressBudet, L=Hasselager, S=Midtjylland, C=DK"
  )

  $properties = @"
storeFile=release/xpressintra-release.jks
storePassword=$password
keyAlias=$alias
keyPassword=$password
"@
  [System.IO.File]::WriteAllText($propertiesPath, $properties, [System.Text.UTF8Encoding]::new($false))
  Write-Host "Release-noegle og keystore.properties er oprettet."
}

Write-Step "XpressIntra Android Release AAB build"

Add-PathIfExists "C:\Program Files\nodejs"
if (Test-Path "C:\Program Files\Android\Android Studio\jbr") {
  $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
  Add-PathIfExists "C:\Program Files\Android\Android Studio\jbr\bin"
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
  Write-Host "FEJL: npm blev ikke fundet. Installer Node.js LTS og genstart computeren."
  exit 1
}

$java = Get-Command java.exe -ErrorAction SilentlyContinue
if (!$java) {
  Write-Host "FEJL: Java blev ikke fundet. Aabn Android Studio og lad standard-installationen blive faerdig."
  exit 1
}

if (!$sdk -or !(Test-Path -LiteralPath $sdk)) {
  Write-Host "FEJL: Android SDK blev ikke fundet. Aabn Android Studio -> SDK Manager og installer SDK."
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

  Ensure-ReleaseKeystore

  Write-Step "Synkroniserer webapp til Android"
  Run-Logged "npm.cmd" @("run", "android:sync")

  Write-Step "Bygger signeret release AAB"
  Push-Location -LiteralPath "android"
  try {
    $localGradle = Find-LocalGradleBat
    if ($localGradle) {
      Write-Host "Bruger lokal Gradle: $localGradle"
      Add-Content -LiteralPath $logPath -Value "Bruger lokal Gradle: $localGradle"
      Run-Logged $localGradle @("bundleRelease", "--stacktrace", "--no-daemon")
    } else {
      Run-Logged ".\gradlew.bat" @("bundleRelease", "--stacktrace", "--no-daemon")
    }
  } finally {
    Pop-Location
  }

  $aab = Join-Path $PSScriptRoot "android\app\build\outputs\bundle\release\app-release.aab"
  if (!(Test-Path -LiteralPath $aab)) {
    throw "Build sagde OK, men AAB blev ikke fundet: $aab"
  }

  Write-Host ""
  Write-Host "Release AAB er klar til Google Play Console:"
  Write-Host $aab
  Add-Content -LiteralPath $logPath -Value "`nRelease AAB er klar: $aab"
  exit 0
} catch {
  Write-Host ""
  Write-Host "Release AAB-build fejlede."
  Write-Host $_.Exception.Message
  Write-Host ""
  Write-Host "Jeg har gemt den fulde fejl her:"
  Write-Host $logPath
  Add-Content -LiteralPath $logPath -Value "`nFEJL: $($_.Exception.Message)"
  exit 1
}
