$ErrorActionPreference = 'Stop'

$project = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$cacheRoot = Join-Path $env:USERPROFILE '.gradle\caches\modules-2\files-2.1'
$offlineRepo = Join-Path $project 'android\offline-maven'

if (!(Test-Path -LiteralPath $cacheRoot)) {
  Write-Host "FEJL: Gradle cache blev ikke fundet:"
  Write-Host $cacheRoot
  exit 1
}

if (!(Test-Path -LiteralPath $offlineRepo)) {
  New-Item -ItemType Directory -Path $offlineRepo -Force | Out-Null
}

Write-Host "Bygger lokal Gradle/Android offline-repo..."
Write-Host "Fra: $cacheRoot"
Write-Host "Til:  $offlineRepo"
Write-Host ""

$files = Get-ChildItem -LiteralPath $cacheRoot -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Name -match '\.(aar|jar|module|pom)$' -and
    $_.Directory.Parent -and
    $_.Directory.Parent.Parent -and
    $_.Directory.Parent.Parent.Parent
  }

$copied = 0
$skipped = 0
foreach ($file in $files) {
  if (!(Test-Path -LiteralPath $file.FullName)) {
    $skipped++
    continue
  }

  $versionDir = $file.Directory.Parent
  $artifactDir = $versionDir.Parent
  $groupDir = $artifactDir.Parent

  $group = $groupDir.FullName.Substring($cacheRoot.Length).TrimStart('\')
  if ([string]::IsNullOrWhiteSpace($group)) { continue }

  $artifact = $artifactDir.Name
  $version = $versionDir.Name
  $groupPath = (($group -replace '\\', '.') -replace '\.', [IO.Path]::DirectorySeparatorChar)
  $targetDir = Join-Path $offlineRepo (Join-Path $groupPath (Join-Path $artifact $version))
  if (!(Test-Path -LiteralPath $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
  }

  $extension = [IO.Path]::GetExtension($file.Name)
  if ($file.Name -match '(-sources|-javadoc)\.' -or $file.Name -like "$artifact-$version*") {
    $targetName = $file.Name
  } else {
    $targetName = "$artifact-$version$extension"
  }

  $target = Join-Path $targetDir $targetName
  if (!(Test-Path -LiteralPath $target) -or ((Get-Item -LiteralPath $target).Length -ne $file.Length)) {
    try {
      Copy-Item -LiteralPath $file.FullName -Destination $target -Force
      $copied++
    } catch {
      Write-Host "Springer over: $($file.FullName)"
      Write-Host "  $($_.Exception.Message)"
      $skipped++
    }
  }
}

Write-Host ""
Write-Host "Offline-repo klar."
Write-Host "Filer kopieret/opdateret: $copied"
Write-Host "Filer sprunget over: $skipped"
Write-Host "Mappe: $offlineRepo"
