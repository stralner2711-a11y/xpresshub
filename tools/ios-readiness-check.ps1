$ErrorActionPreference = 'Stop'

$project = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$issues = New-Object System.Collections.Generic.List[string]

function Pass($message) {
  Write-Host "OK: $message"
}

function Fail($message) {
  $issues.Add($message) | Out-Null
  Write-Host "FEJL: $message"
}

function Require-File($relativePath) {
  $path = Join-Path $project $relativePath
  if (Test-Path -LiteralPath $path) {
    Pass "$relativePath findes"
    return $path
  }
  Fail "$relativePath mangler"
  return $null
}

$packagePath = Require-File 'package.json'
$versionPath = Require-File 'public\version.json'
$configPath = Require-File 'capacitor.config.json'
$plistPath = Require-File 'ios\App\App\Info.plist'
$projectPath = Require-File 'ios\App\App.xcodeproj\project.pbxproj'
Require-File 'ios\App\App.xcworkspace\xcshareddata\IDEWorkspaceChecks.plist' | Out-Null
Require-File 'Build Apple iOS paa Mac.command' | Out-Null
Require-File 'tools\build-ios-mac.sh' | Out-Null
Require-File 'docs\IPHONE_WEBAPP_GUIDE.md' | Out-Null
Require-File 'docs\APPLE_IOS_APP.md' | Out-Null
Require-File 'public\icons\xpressintra-icon-192.png' | Out-Null
Require-File 'public\icons\xpressintra-icon-512.png' | Out-Null

if ($packagePath -and $versionPath) {
  $package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
  $version = Get-Content -LiteralPath $versionPath -Raw | ConvertFrom-Json
  if ($package.version -eq $version.activeVersion) {
    Pass "package.json og public/version.json matcher version $($package.version)"
  } else {
    Fail "package.json ($($package.version)) matcher ikke public/version.json ($($version.activeVersion))"
  }
}

if ($configPath) {
  $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
  if ($config.appId -eq 'dk.xpressbudet.xpressintra') {
    Pass 'Capacitor appId er dk.xpressbudet.xpressintra'
  } else {
    Fail "Capacitor appId er forkert: $($config.appId)"
  }
  if ($config.webDir -eq 'dist') {
    Pass 'Capacitor webDir er dist'
  } else {
    Fail "Capacitor webDir er forkert: $($config.webDir)"
  }
}

if ($plistPath) {
  $plist = Get-Content -LiteralPath $plistPath -Raw
  foreach ($needle in @(
    'NSLocationWhenInUseUsageDescription',
    'NSCameraUsageDescription',
    'NSPhotoLibraryUsageDescription',
    'når du selv',
    'vælger et billede'
  )) {
    if ($plist.Contains($needle)) {
      Pass "Info.plist indeholder $needle"
    } else {
      Fail "Info.plist mangler $needle"
    }
  }
}

if ($projectPath -and $versionPath) {
  $pbx = Get-Content -LiteralPath $projectPath -Raw
  $version = Get-Content -LiteralPath $versionPath -Raw | ConvertFrom-Json
  if ($pbx.Contains("MARKETING_VERSION = $($version.activeVersion);")) {
    Pass "iOS MARKETING_VERSION matcher $($version.activeVersion)"
  } else {
    Fail "iOS MARKETING_VERSION matcher ikke $($version.activeVersion)"
  }
  if ($pbx.Contains("CURRENT_PROJECT_VERSION = $($version.activeVersionCode);")) {
    Pass "iOS CURRENT_PROJECT_VERSION matcher build $($version.activeVersionCode)"
  } else {
    Fail "iOS CURRENT_PROJECT_VERSION matcher ikke build $($version.activeVersionCode)"
  }
}

if ($issues.Count) {
  Write-Host ''
  Write-Host "RESULTAT: FEJL ($($issues.Count))"
  exit 1
}

Write-Host ''
Write-Host 'RESULTAT: OK - iPhone/PWA er klar, og native iOS-projektet er klargjort til Mac/Xcode.'
