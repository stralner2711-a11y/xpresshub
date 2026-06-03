param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$supabaseDir = Join-Path $root "supabase"
$outputFile = Join-Path $supabaseDir "RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql"
$sqlEditorUrl = "https://supabase.com/dashboard/project/mtfbdoajzmlgqbeiubxe/sql/new"

$orderedFiles = @(
  "schema.sql",
  "fix-channel-chat-access.sql",
  "fix-location-share-mode.sql",
  "fix-employee-registration.sql",
  "fix-pickup-live-notes.sql",
  "first-admin.sql"
)

$generatedFiles = @(
  "RUN_THIS_IN_SUPABASE.sql",
  "RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql"
)

$extraFiles = Get-ChildItem -LiteralPath $supabaseDir -Filter "*.sql" |
  Where-Object { $orderedFiles -notcontains $_.Name -and $generatedFiles -notcontains $_.Name } |
  Sort-Object Name |
  ForEach-Object { $_.Name }

$files = @($orderedFiles + $extraFiles)

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
-- XpressIntra fuld Supabase-opsaetning
-- Brug denne i ET Supabase SQL-vindue.
--
-- Saadan bruges den:
-- 1. Log ind i Supabase.
-- 2. Aabn SQL Editor.
-- 3. Indsaet hele teksten.
-- 4. Tryk Run.
--
-- Indeholder:
-- - Hele database-strukturen
-- - Sikkerhedsregler/RLS
-- - Chatkanaler
-- - Livekort/GPS fix
-- - Medarbejderregistrering/invitationer
-- - Pickup live-noter
-- - Creator-rettighed til stralner2711@gmail.com
--
-- VIGTIGT:
-- Hvis creator-rettigheden skal saettes med det samme, skal brugeren
-- stralner2711@gmail.com allerede vaere oprettet/logget ind i Supabase Auth.

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
Write-Host "Fuld Supabase SQL er klar." -ForegroundColor Green
Write-Host "Jeg har lavet filen:" -ForegroundColor Green
Write-Host $outputFile -ForegroundColor Yellow
Write-Host ""
Write-Host "Jeg har ogsaa kopieret hele teksten til udklipsholderen." -ForegroundColor Green
Write-Host ""
Write-Host "Naar Supabase-siden aabner:" -ForegroundColor Cyan
Write-Host "1. Slet eventuel tekst i SQL feltet."
Write-Host "2. Tryk Ctrl + V."
Write-Host "3. Tryk Run."
Write-Host ""

if (-not $NoOpen) {
  Start-Process $sqlEditorUrl
}
