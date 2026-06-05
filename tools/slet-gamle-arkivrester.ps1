param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$archiveRoot = (Resolve-Path (Join-Path $projectRoot 'arkiv')).Path
$logPath = Join-Path $projectRoot 'slet-gamle-arkivrester-log.txt'

$targets = @(
  @{
    Path = 'arkiv\oprydning-2026-06-04\.gradle-build-cache'
    Reason = 'Gammel Gradle build-cache. Kan genskabes automatisk.'
  },
  @{
    Path = 'arkiv\oprydning-2026-06-05\github-upload-ready'
    Reason = 'Gammel GitHub uploadpakke. Kan laves igen af opdateringsknappen.'
  },
  @{
    Path = 'arkiv\oprydning-2026-06-05\genskabelige-buildmapper'
    Reason = 'Gamle buildmapper. Kan genskabes automatisk.'
  },
  @{
    Path = 'arkiv\ikke-i-brug-2026-06-02\.tmp-preview-chrome'
    Reason = 'Midlertidig browsermappe fra gammel preview.'
  },
  @{
    Path = 'arkiv\ikke-i-brug-2026-06-02\.tmp-preview-chrome-1780421671543'
    Reason = 'Midlertidig browsermappe fra gammel preview.'
  },
  @{
    Path = 'arkiv\ikke-i-brug-2026-06-02\.tmp-preview-chrome-1780421882499'
    Reason = 'Midlertidig browsermappe fra gammel preview.'
  },
  @{
    Path = 'arkiv\ikke-i-brug-2026-06-02\.tmp-preview-edge-1780421914829'
    Reason = 'Midlertidig browsermappe fra gammel preview.'
  },
  @{
    Path = 'arkiv\oprydning-2026-06-04\release-klargjort'
    Reason = 'Gammel APK-kopi. Nyeste APK ligger i release-klargjort i roden.'
  },
  @{
    Path = 'arkiv\oprydning-2026-06-04\XpressIntra-GitHub-opdatering-1.2.3-20260603-222214.zip'
    Reason = 'Gammel zip-pakke fra tidligere version.'
  },
  @{
    Path = 'arkiv\oprydning-2026-06-04\xpresshub-github-upload-ready-20260603-194738.zip'
    Reason = 'Gammel zip-pakke fra tidligere version.'
  }
)

function Get-SizeMb {
  param([string]$Path)

  if (!(Test-Path -LiteralPath $Path)) {
    return 0
  }

  $item = Get-Item -LiteralPath $Path -Force
  if (!$item.PSIsContainer) {
    return [math]::Round($item.Length / 1MB, 2)
  }

  $sum = (Get-ChildItem -LiteralPath $Path -Recurse -Force -File -ErrorAction SilentlyContinue |
    Measure-Object Length -Sum).Sum

  if ($null -eq $sum) {
    return 0
  }

  return [math]::Round($sum / 1MB, 2)
}

function Assert-SafeTarget {
  param([string]$Path)

  $resolved = (Resolve-Path -LiteralPath $Path).Path
  if (!$resolved.StartsWith($archiveRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Stopper: '$resolved' ligger ikke inde i arkiv-mappen."
  }

  return $resolved
}

function Convert-ToLongPath {
  param([string]$Path)

  if ($Path.StartsWith('\\?\')) {
    return $Path
  }

  if ($Path.StartsWith('\\')) {
    return '\\?\UNC\' + $Path.Substring(2)
  }

  return '\\?\' + $Path
}

function Remove-SafeTarget {
  param(
    [string]$Path,
    [string]$DisplayPath
  )

  try {
    Remove-Item -LiteralPath $Path -Recurse -Force -ErrorAction Stop
    return $true
  } catch {
    "Normal sletning fejlede for: $DisplayPath" | Tee-Object -FilePath $logPath -Append
    "Fejl: $($_.Exception.Message)" | Tee-Object -FilePath $logPath -Append
  }

  $longPath = Convert-ToLongPath -Path $Path
  try {
    Remove-Item -LiteralPath $longPath -Recurse -Force -ErrorAction Stop
    "Slettet med lang-sti metode: $DisplayPath" | Tee-Object -FilePath $logPath -Append
    return $true
  } catch {
    "Kunne ikke slette: $DisplayPath" | Tee-Object -FilePath $logPath -Append
    "Fejl: $($_.Exception.Message)" | Tee-Object -FilePath $logPath -Append
    "Tip: Luk Android Studio, GitHub Desktop og eventuelle preview-vinduer, og koer filen igen." | Tee-Object -FilePath $logPath -Append
    return $false
  }
}

$existing = foreach ($target in $targets) {
  $fullPath = Join-Path $projectRoot $target.Path
  if (Test-Path -LiteralPath $fullPath) {
    [pscustomobject]@{
      Path = $fullPath
      DisplayPath = $target.Path
      MB = Get-SizeMb -Path $fullPath
      Reason = $target.Reason
    }
  }
}

if (!$existing) {
  "Der blev ikke fundet gamle arkivrester at slette." | Tee-Object -FilePath $logPath
  exit 0
}

$totalMb = [math]::Round(($existing | Measure-Object MB -Sum).Sum, 2)

"XpressIntra arkiv-oprydning" | Tee-Object -FilePath $logPath
"Projekt: $projectRoot" | Tee-Object -FilePath $logPath -Append
"Fundet til sletning: $totalMb MB" | Tee-Object -FilePath $logPath -Append
"" | Tee-Object -FilePath $logPath -Append

$existing |
  Sort-Object MB -Descending |
  Format-Table DisplayPath, MB, Reason -AutoSize |
  Out-String |
  Tee-Object -FilePath $logPath -Append

if ($DryRun) {
  "Dry-run: Intet er slettet." | Tee-Object -FilePath $logPath -Append
  exit 0
}

Write-Host ""
Write-Host "Dette sletter kun gamle arkiv-rester, build-cache og gamle uploadpakker."
Write-Host "Nyeste app-kode og nyeste APK i release-klargjort bliver ikke slettet."
Write-Host ""
$answer = Read-Host 'Skriv SLET for at frigive plads'

if ($answer -ne 'SLET') {
  "Afbrudt af bruger. Intet blev slettet." | Tee-Object -FilePath $logPath -Append
  exit 0
}

$deletedMb = 0
$failed = @()

foreach ($item in $existing) {
  $safePath = Assert-SafeTarget -Path $item.Path
  "Sletter: $($item.DisplayPath)" | Tee-Object -FilePath $logPath -Append
  if (Remove-SafeTarget -Path $safePath -DisplayPath $item.DisplayPath) {
    $deletedMb += $item.MB
  } else {
    $failed += $item.DisplayPath
  }
}

if ($failed.Count -gt 0) {
  "Faerdig med advarsler. Frigivet cirka $([math]::Round($deletedMb, 2)) MB." | Tee-Object -FilePath $logPath -Append
  "Kunne ikke slette disse:" | Tee-Object -FilePath $logPath -Append
  $failed | ForEach-Object { "- $_" | Tee-Object -FilePath $logPath -Append }
  exit 1
}

"Faerdig. Frigivet cirka $([math]::Round($deletedMb, 2)) MB." | Tee-Object -FilePath $logPath -Append
