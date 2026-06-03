param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$supabaseDir = Join-Path $root "supabase"
$outputFile = Join-Path $supabaseDir "RUN_THIS_IN_SUPABASE.sql"
$sqlEditorUrl = "https://supabase.com/dashboard/project/mtfbdoajzmlgqbeiubxe/sql/new"

$files = @(
  "fix-location-share-mode.sql",
  "fix-employee-registration.sql",
  "fix-pickup-live-notes.sql",
  "first-admin.sql"
)

$missing = @()
foreach ($file in $files) {
  $path = Join-Path $supabaseDir $file
  if (-not (Test-Path -LiteralPath $path)) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "Mangler disse Supabase-filer:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  Write-Host ""
  exit 1
}

$header = @"
-- XpressIntra samlet Supabase-fix
-- Oprettet automatisk fra projektets Supabase-fixfiler.
-- Saadan bruges den:
-- 1. Aabn Supabase SQL Editor.
-- 2. Indsaet hele teksten.
-- 3. Tryk Run.
--
-- VIGTIGT:
-- Hvis databasen slet ikke er oprettet endnu, skal supabase/schema.sql koeres foerst.
-- Denne fil er til et projekt hvor grunddatabasen allerede findes.

"@

$content = New-Object System.Text.StringBuilder
[void]$content.AppendLine($header)

foreach ($file in $files) {
  $path = Join-Path $supabaseDir $file
  [void]$content.AppendLine("")
  [void]$content.AppendLine("-- ============================================================")
  [void]$content.AppendLine("-- $file")
  [void]$content.AppendLine("-- ============================================================")
  [void]$content.AppendLine("")
  [void]$content.AppendLine((Get-Content -LiteralPath $path -Raw))
}

$sql = $content.ToString()
Set-Content -LiteralPath $outputFile -Value $sql -Encoding UTF8
Set-Clipboard -Value $sql

Write-Host ""
Write-Host "Supabase SQL er klar." -ForegroundColor Green
Write-Host "Jeg har lavet filen:" -ForegroundColor Green
Write-Host $outputFile -ForegroundColor Yellow
Write-Host ""
Write-Host "Jeg har ogsaa kopieret SQL-teksten til udklipsholderen." -ForegroundColor Green
Write-Host ""
Write-Host "Naar Supabase-siden aabner:" -ForegroundColor Cyan
Write-Host "1. Klik i SQL feltet."
Write-Host "2. Tryk Ctrl + V."
Write-Host "3. Tryk Run."
Write-Host ""

if (-not $NoOpen) {
  Start-Process $sqlEditorUrl
}
