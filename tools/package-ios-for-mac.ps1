$ErrorActionPreference = 'Stop'

$project = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$outDir = Join-Path $project 'ios-release-ready'
$zipPath = Join-Path $project 'ios-release-ready.zip'
$logPath = Join-Path $project 'ios-release-ready-log.txt'

function Write-Log($text = '') {
  $text | Tee-Object -FilePath $logPath -Append
}

function Stop-Packaging($message) {
  Write-Log ''
  Write-Log "FEJL: $message"
  Write-Log "Log: $logPath"
  exit 1
}

function Safe-Remove($path) {
  if (!(Test-Path -LiteralPath $path)) { return }
  $resolved = (Resolve-Path -LiteralPath $path).Path
  if (!$resolved.StartsWith($project, [StringComparison]::OrdinalIgnoreCase)) {
    Stop-Packaging "Sikkerhedsstop: vil ikke slette udenfor projektmappen: $resolved"
  }
  Remove-Item -LiteralPath $resolved -Recurse -Force
}

function Copy-Folder($name, [string[]]$excludeDirs = @()) {
  $source = Join-Path $project $name
  $destination = Join-Path $outDir $name
  if (!(Test-Path -LiteralPath $source)) {
    Write-Log "Springer over: $name findes ikke"
    return
  }
  if (!(Test-Path -LiteralPath $destination)) {
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
  }
  $robocopyArgs = @($source, $destination, '/E', '/R:1', '/W:1', '/XJ', '/NP')
  if ($excludeDirs.Count) {
    $robocopyArgs += '/XD'
    $robocopyArgs += $excludeDirs
  }
  & robocopy @robocopyArgs *>> $logPath
  if ($LASTEXITCODE -ge 8) {
    Stop-Packaging "Kopiering fejlede for $name med kode $LASTEXITCODE"
  }
}

function Copy-RootFile($name) {
  $source = Join-Path $project $name
  if (Test-Path -LiteralPath $source) {
    Copy-Item -LiteralPath $source -Destination (Join-Path $outDir $name) -Force
    Write-Log "Kopieret: $name"
  }
}

"XpressIntra iOS Mac package" | Set-Content -LiteralPath $logPath -Encoding UTF8
Write-Log "Start: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Log "Projekt: $project"
Write-Log "Output: $outDir"
Write-Log ''

Write-Log '[1/5] Synkroniserer Android/iOS assets...'
Push-Location -LiteralPath $project
try {
  npm run native:sync *>> $logPath
  if ($LASTEXITCODE -ne 0) { Stop-Packaging "native:sync fejlede med kode $LASTEXITCODE" }

  Write-Log '[2/5] Tjekker iOS klarhed...'
  npm run ios:check *>> $logPath
  if ($LASTEXITCODE -ne 0) { Stop-Packaging "ios:check fejlede med kode $LASTEXITCODE" }
} finally {
  Pop-Location
}

Write-Log '[3/5] Rydder gammel iOS-pakke...'
Safe-Remove $outDir
Safe-Remove $zipPath
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

Write-Log '[4/5] Kopierer nødvendige filer til Mac-pakken...'
foreach ($folder in @('assets', 'docs', 'public', 'src', 'supabase', 'tools', 'ios')) {
  if ($folder -eq 'ios') {
    Copy-Folder $folder @(
      (Join-Path $project 'ios\App\Pods'),
      (Join-Path $project 'ios\App\build'),
      (Join-Path $project 'ios\App\DerivedData')
    )
  } else {
    Copy-Folder $folder
  }
}

foreach ($file in @(
  '.gitignore',
  'Build Apple iOS paa Mac.command',
  'capacitor.config.json',
  'index.html',
  'manifest.webmanifest',
  'package-lock.json',
  'package.json',
  'README.md',
  'service-worker.js',
  'version.json'
)) {
  Copy-RootFile $file
}

Write-Log '[5/5] Laver zip-fil...'
Compress-Archive -LiteralPath (Join-Path $outDir '*') -DestinationPath $zipPath -Force

Write-Log ''
Write-Log 'FAERDIG'
Write-Log "Mappe: $outDir"
Write-Log "Zip:   $zipPath"
Write-Host ''
Write-Host 'iOS Mac-pakken er klar.'
Write-Host "Mappe: $outDir"
Write-Host "Zip:   $zipPath"
