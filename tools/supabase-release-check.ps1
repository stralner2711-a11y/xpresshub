param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

try {
  $ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
} catch {
  $ProjectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
}

function Fail($message) {
  Write-Host "FEJL: $message" -ForegroundColor Red
  exit 1
}

function Pass($message) {
  Write-Host "OK: $message"
}

$configPath = Join-Path $ProjectRoot 'public\app-config.js'
$schemaPath = Join-Path $ProjectRoot 'supabase\schema.sql'
$fullSetupPath = Join-Path $ProjectRoot 'supabase\RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql'
$setupNotePath = Join-Path $ProjectRoot 'supabase\XPRESSINTRA_CURRENT_SUPABASE_SETUP.md'
$appPath = Join-Path $ProjectRoot 'src\app.js'
$workerPath = Join-Path $ProjectRoot 'public\service-worker.js'

if (!(Test-Path $configPath)) { Fail "public/app-config.js mangler" }
if (!(Test-Path $schemaPath)) { Fail "supabase/schema.sql mangler" }
if (!(Test-Path $fullSetupPath)) { Fail "supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql mangler" }
if (!(Test-Path $setupNotePath)) { Fail "supabase/XPRESSINTRA_CURRENT_SUPABASE_SETUP.md mangler" }
if (!(Test-Path $appPath)) { Fail "src/app.js mangler" }
if (!(Test-Path $workerPath)) { Fail "public/service-worker.js mangler" }

$config = Get-Content $configPath -Raw
$schema = Get-Content $schemaPath -Raw
$fullSetup = Get-Content $fullSetupPath -Raw
$app = Get-Content $appPath -Raw
$worker = Get-Content $workerPath -Raw

if ($config -match 'service_role|sb_secret_|SUPABASE_SERVICE_ROLE') {
  Fail "app-config.js maa ikke indeholde service_role eller hemmelige noegler"
}
if ($app -match 'service_role|sb_secret_|SUPABASE_SERVICE_ROLE') {
  Fail "src/app.js maa ikke indeholde service_role eller hemmelige noegler"
}
if ($app -match "localStorage\.setItem\([^)]*password|sessionStorage\.setItem\([^)]*password|roadlog:[^'\""]*password") {
  Fail "Appen maa ikke gemme adgangskoder lokalt"
}
if ($worker -notmatch "/auth/" -or $worker -notmatch "/rest/" -or $worker -notmatch "/storage/" -or $worker -notmatch "app-config\.js") {
  Fail "Service worker skal springe login, API, storage og app-config over cache"
}

$urlMatch = [regex]::Match($config, "url:\s*'([^']+)'")
$keyMatch = [regex]::Match($config, "anonKey:\s*'([^']+)'")
if (!$urlMatch.Success) { Fail "Supabase URL mangler i app-config.js" }
if (!$keyMatch.Success) { Fail "Supabase publishable/anon key mangler i app-config.js" }

$supabaseUrl = $urlMatch.Groups[1].Value
$anonKey = $keyMatch.Groups[1].Value

if ($supabaseUrl -ne 'https://mtfbdoajzmlgqbeiubxe.supabase.co') {
  Fail "Supabase URL peger ikke paa det aftalte projekt"
}

if ($anonKey.Length -lt 20) {
  Fail "Supabase publishable key ser for kort ud"
}

$requiredTables = @(
  'profiles',
  'profile_private_details',
  'employee_invitations',
  'vehicles',
  'notifications',
  'location_shares',
  'workday_sessions',
  'pickup_tasks',
  'conversations',
  'conversation_members',
  'messages',
  'media_attachments',
  'announcements',
  'private_log_entries'
)

foreach ($table in $requiredTables) {
  if ($schema -notmatch "create table if not exists public\.$table") {
    Fail "schema.sql mangler public.$table"
  }
  if ($schema -notmatch "alter table public\.$table enable row level security") {
    Fail "schema.sql mangler RLS for public.$table"
  }
}

if ($schema -notmatch 'create policy') { Fail "schema.sql mangler RLS policies" }
if ($schema -notmatch 'xpressintra-media') { Fail "schema.sql mangler Storage bucket/policies for xpressintra-media" }
if ($fullSetup -notmatch 'xpressintra-media') { Fail "RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql mangler xpressintra-media" }
if ($fullSetup -notmatch '00000000-0000-4000-8000-000000000001') { Fail "Supabase full setup mangler standard faelleschat" }
if ($schema -notmatch 'create schema if not exists private') { Fail "schema.sql mangler private schema til interne RLS-hjaelpefunktioner" }
if ($schema -notmatch 'function private\.is_admin\(\)' -or $schema -notmatch 'function private\.can_read_conversation') {
  Fail "schema.sql skal bruge private RLS-hjaelpefunktioner"
}
if ($schema -notmatch 'function private\.protect_profile_security_fields\(\)' -or $schema -notmatch 'execute procedure private\.protect_profile_security_fields\(\)') {
  Fail "schema.sql skal laase profilens rolle/adgangsfelter med en private trigger"
}
if ($schema -match 'function public\.(is_admin|is_dispatcher_or_admin|is_conversation_member|can_read_conversation|can_access_conversation)') {
  Fail "schema.sql maa ikke oprette offentlige RLS-hjaelpefunktioner"
}
if ($fullSetup -notmatch 'drop schema if exists private cascade' -or $fullSetup -notmatch 'function private\.is_admin\(\)') {
  Fail "Fuld Supabase SQL mangler reset/oprettelse af private RLS-hjaelpefunktioner"
}
foreach ($requiredText in @('password_reset_required', 'onboarding_method', 'standard_password', 'invitation_id', 'expires_at', 'used_by', 'Din arbejdsmail er ikke oprettet i XpressIntra endnu')) {
  if ($schema -notmatch [regex]::Escape($requiredText)) {
    Fail "schema.sql mangler standardkode-onboarding: $requiredText"
  }
  if ($fullSetup -notmatch [regex]::Escape($requiredText)) {
    Fail "RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql mangler standardkode-onboarding: $requiredText"
  }
}

Pass "Supabase config peger paa $supabaseUrl"
Pass "Kun offentlig publishable/anon key bruges i app-config.js"
Pass "Supabase SQL, RLS, Storage og standardchat er med i pakken"
Pass "Standardkode-login er med i Supabase SQL og afviser ikke-oprettede mails"
Pass "Interne RLS-hjaelpefunktioner ligger i private schema, ikke som public RPC"
Pass "Login-sikkerhed tjekket: ingen gemte adgangskoder og ingen hemmelige noegler i appen"

if ($env:XPRESSINTRA_SUPABASE_ONLINE_CHECK -eq '1') {
  try {
    $response = Invoke-WebRequest -Uri "$supabaseUrl/auth/v1/settings" -Headers @{ apikey = $anonKey } -UseBasicParsing -TimeoutSec 15
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      Pass "Supabase Auth endpoint svarer HTTP $($response.StatusCode)"
    } else {
      Fail "Supabase Auth endpoint svarede HTTP $($response.StatusCode)"
    }
  } catch {
    Fail "Online Supabase-test fejlede: $($_.Exception.Message)"
  }
} else {
  Write-Host "INFO: Online Supabase-test er sprunget over. Saet XPRESSINTRA_SUPABASE_ONLINE_CHECK=1 for at teste live endpoint."
}
