param(
  [string]$ProjectPath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path,
  [string]$RepoPath = 'C:\Users\Tommy\Documents\GitHub\xpresshub',
  [string]$RepoName = 'stralner2711-a11y/xpresshub',
  [switch]$LocalOnly
)

$ErrorActionPreference = 'Stop'
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$gitPath = 'C:\Program Files\Git\cmd\git.exe'
$ghPath = 'C:\Program Files\GitHub CLI\gh.exe'
$aaptCandidates = @(
  (Join-Path $env:LOCALAPPDATA 'Android\Sdk\build-tools\37.0.0\aapt2.exe'),
  (Join-Path $env:LOCALAPPDATA 'Android\Sdk\build-tools\36.1.0\aapt2.exe'),
  (Join-Path $env:LOCALAPPDATA 'Android\Sdk\build-tools\36.0.0\aapt2.exe'),
  (Join-Path $env:LOCALAPPDATA 'Android\Sdk\build-tools\34.0.0\aapt2.exe')
)

$script:failures = @()
$script:warnings = @()

function Pass($message) { Write-Host "[OK] $message" }
function Warn($message) { $script:warnings += $message; Write-Host "[ADVARSEL] $message" }
function Fail($message) { $script:failures += $message; Write-Host "[FEJL] $message" }

function Read-JsonFile($path, $label) {
  if (!(Test-Path -LiteralPath $path)) {
    Fail "$label mangler: $path"
    return $null
  }
  try {
    return Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
  } catch {
    Fail "$label er ikke gyldig JSON: $($_.Exception.Message)"
    return $null
  }
}

function Assert-SameVersion($left, $right, $leftLabel, $rightLabel) {
  if (!$left -or !$right) { return }
  if ($left.activeVersion -ne $right.activeVersion -or [int]$left.activeVersionCode -ne [int]$right.activeVersionCode) {
    Fail "$leftLabel og $rightLabel matcher ikke ($($left.activeVersion)/$($left.activeVersionCode) mod $($right.activeVersion)/$($right.activeVersionCode))"
  } else {
    Pass "$leftLabel og $rightLabel matcher version $($left.activeVersion) build $($left.activeVersionCode)"
  }
}

function ConvertTo-CmdArgument($value) {
  $text = [string]$value
  if ($text -notmatch '[\s"&<>|^]') { return $text }
  return '"' + ($text -replace '"', '\"') + '"'
}

function ConvertTo-CmdLine($filePath, [string[]]$arguments = @()) {
  @((ConvertTo-CmdArgument $filePath)) + ($arguments | ForEach-Object { ConvertTo-CmdArgument $_ }) -join ' '
}

function Invoke-Checked($file, [string[]]$arguments, $workingDirectory = $ProjectPath) {
  Push-Location -LiteralPath $workingDirectory
  try {
    $temp = Join-Path $env:TEMP ("xpressintra-gh-check-" + [guid]::NewGuid().ToString('N') + ".txt")
    $command = ConvertTo-CmdLine $file $arguments
    & cmd.exe /D /C "$command > `"$temp`" 2>&1"
    $code = $LASTEXITCODE
    $output = if (Test-Path -LiteralPath $temp) { Get-Content -LiteralPath $temp -Raw -ErrorAction SilentlyContinue } else { '' }
    Remove-Item -LiteralPath $temp -Force -ErrorAction SilentlyContinue
    return [pscustomobject]@{ Code = $code; Output = [string]$output }
  } finally {
    Pop-Location
  }
}

function Decode-GitHubContent($apiResult) {
  $json = $apiResult.Output | ConvertFrom-Json
  $content = [string]$json.content
  $clean = $content -replace '\s', ''
  return [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($clean)) | ConvertFrom-Json
}

Write-Host '============================================================'
Write-Host 'XpressIntra GitHub/release-kontrol'
Write-Host '============================================================'
Write-Host "Projekt: $ProjectPath"
Write-Host "GitHub-mappe: $RepoPath"
Write-Host "Repo: $RepoName"
Write-Host ''

$publicVersion = Read-JsonFile (Join-Path $ProjectPath 'public\version.json') 'public/version.json'
$docsVersion = Read-JsonFile (Join-Path $ProjectPath 'docs\version.json') 'docs/version.json'
$rootVersion = Read-JsonFile (Join-Path $ProjectPath 'version.json') 'version.json'

Assert-SameVersion $publicVersion $docsVersion 'public/version.json' 'docs/version.json'
Assert-SameVersion $publicVersion $rootVersion 'public/version.json' 'version.json'

if ($publicVersion) {
  $tag = "v$($publicVersion.activeVersion)"
  $expectedCode = [int]$publicVersion.activeVersionCode
  if ([string]$publicVersion.apkDownloadUrl -notmatch "/releases/download/$tag/xpressintra\.apk$") {
    Fail "APK-linket peger ikke paa den aktive release $tag"
  } else {
    Pass "APK-linket peger paa $tag"
  }
} else {
  $tag = ''
  $expectedCode = 0
}

$apkPath = Join-Path $ProjectPath 'release-klargjort\xpressintra.apk'
if (Test-Path -LiteralPath $apkPath) {
  Pass "Lokal APK findes: $apkPath"
  $aapt = $aaptCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
  if ($aapt) {
    # Androids aapt2 paa Windows kan ikke altid laese stier med danske tegn.
    # Brug derfor en kort ASCII-sti til selve versionskontrollen.
    $inspectionApk = Join-Path $env:TEMP ("xpressintra-apk-check-" + [guid]::NewGuid().ToString('N') + '.apk')
    Copy-Item -LiteralPath $apkPath -Destination $inspectionApk -Force
    try {
      $badging = Invoke-Checked $aapt @('dump', 'badging', $inspectionApk)
    } finally {
      Remove-Item -LiteralPath $inspectionApk -Force -ErrorAction SilentlyContinue
    }
    if ($badging.Code -eq 0) {
      $line = ($badging.Output -split "`n" | Where-Object { $_ -match '^package:' } | Select-Object -First 1)
      if ($line -match "versionCode='(\d+)'\s+versionName='([^']+)'") {
        $apkCode = [int]$Matches[1]
        $apkVersion = $Matches[2]
        if ($publicVersion -and ($apkCode -ne $expectedCode -or $apkVersion -ne [string]$publicVersion.activeVersion)) {
          Fail "Lokal APK er $apkVersion build $apkCode, men version.json siger $($publicVersion.activeVersion) build $expectedCode"
        } else {
          Pass "Lokal APK matcher version.json: $apkVersion build $apkCode"
        }
      } else {
        Warn 'Kunne ikke laese versionCode/versionName fra lokal APK.'
      }
    } else {
      Warn "aapt2 kunne ikke laese APK'en: $($badging.Output)"
    }
  } else {
    Warn 'aapt2 blev ikke fundet, saa lokal APK-version kunne ikke kontrolleres.'
  }
} else {
  Warn "Lokal APK findes ikke endnu: $apkPath"
}

if (!(Test-Path -LiteralPath (Join-Path $RepoPath '.git'))) {
  Fail "GitHub-mappen er ikke et Git-repo: $RepoPath"
} else {
  Pass 'GitHub-mappen har et Git-repo'
}

if (!(Test-Path -LiteralPath $gitPath)) {
  Fail "Git mangler: $gitPath"
} else {
  Pass 'Git er installeret'
  if (Test-Path -LiteralPath (Join-Path $RepoPath '.git')) {
    $remote = Invoke-Checked $gitPath @('-C', $RepoPath, 'remote', 'get-url', 'origin')
    if ($remote.Code -ne 0) {
      Fail "Kunne ikke laese Git remote: $($remote.Output)"
    } elseif ($remote.Output -notmatch 'stralner2711-a11y[\/:]xpresshub(\.git)?') {
      Fail "Git remote peger ikke paa xpresshub: $($remote.Output)"
    } else {
      Pass "Git remote er korrekt: $($remote.Output.Trim())"
    }
  }
}

if ($LocalOnly) {
  Warn 'Kører LocalOnly: GitHub online/release kontroller er sprunget over.'
} else {
  if (!(Test-Path -LiteralPath $ghPath)) {
    Fail "GitHub CLI mangler: $ghPath"
  } else {
    Pass 'GitHub CLI er installeret'
    $auth = Invoke-Checked $ghPath @('auth', 'status') $ProjectPath
    if ($auth.Code -ne 0) {
      Fail "GitHub login virker ikke i denne terminal: $($auth.Output)"
    } else {
      Pass 'GitHub login virker'
    }

    $repoInfo = Invoke-Checked $ghPath @('api', "repos/$RepoName", '--jq', '.default_branch + " " + .visibility') $ProjectPath
    if ($repoInfo.Code -ne 0) {
      Fail "GitHub repo kunne ikke laeses: $($repoInfo.Output)"
    } else {
      Pass "GitHub repo kan laeses: $($repoInfo.Output.Trim())"
    }

    foreach ($remoteFile in @('version.json', 'docs/version.json')) {
      $api = Invoke-Checked $ghPath @('api', "repos/$RepoName/contents/$remoteFile`?ref=main") $ProjectPath
      if ($api.Code -ne 0) {
        Fail "Kunne ikke hente $remoteFile fra GitHub main: $($api.Output)"
        continue
      }
      try {
        $remoteVersion = Decode-GitHubContent $api
        Assert-SameVersion $publicVersion $remoteVersion 'lokal public/version.json' "GitHub $remoteFile"
      } catch {
        Fail "Kunne ikke fortolke $remoteFile fra GitHub: $($_.Exception.Message)"
      }
    }

    if ($tag) {
      $release = Invoke-Checked $ghPath @('release', 'view', $tag, '--repo', $RepoName, '--json', 'tagName,isDraft,isPrerelease,url,assets') $ProjectPath
      if ($release.Code -ne 0) {
        Fail "Release $tag findes ikke eller kan ikke laeses: $($release.Output)"
      } else {
        try {
          $releaseJson = $release.Output | ConvertFrom-Json
          if ($releaseJson.isDraft) { Fail "Release $tag er stadig en kladde" } else { Pass "Release $tag er publiceret" }
          $asset = @($releaseJson.assets) | Where-Object { $_.name -eq 'xpressintra.apk' } | Select-Object -First 1
          if (!$asset) {
            Fail "Release $tag mangler xpressintra.apk"
          } elseif ([int64]$asset.size -lt 1000000) {
            Fail "xpressintra.apk paa release $tag virker for lille ($($asset.size) bytes)"
          } else {
            Pass "Release $tag har xpressintra.apk ($([math]::Round([int64]$asset.size / 1MB, 1)) MB)"
          }
        } catch {
          Fail "Kunne ikke fortolke release ${tag}: $($_.Exception.Message)"
        }
      }
    }

    foreach ($url in @(
      'https://stralner2711-a11y.github.io/xpresshub/version.json',
      'https://raw.githubusercontent.com/stralner2711-a11y/xpresshub/main/version.json',
      [string]$publicVersion.apkDownloadUrl
    ) | Where-Object { $_ }) {
      try {
        $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 20
        if ([int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 400) {
          Pass "Online link svarer: $url"
        } else {
          Warn "Online link svarede med status $($response.StatusCode): $url"
        }
      } catch {
        Warn "Online link kunne ikke kontrolleres lige nu: $url ($($_.Exception.Message))"
      }
    }
  }
}

Write-Host ''
Write-Host '============================================================'
if ($script:failures.Count -gt 0) {
  Write-Host "RESULTAT: FEJL ($($script:failures.Count))"
  $script:failures | ForEach-Object { Write-Host "- $_" }
  if ($script:warnings.Count -gt 0) {
    Write-Host ''
    Write-Host "Advarsler ($($script:warnings.Count)):"
    $script:warnings | ForEach-Object { Write-Host "- $_" }
  }
  exit 1
}

Write-Host "RESULTAT: OK"
if ($script:warnings.Count -gt 0) {
  Write-Host "Advarsler ($($script:warnings.Count)):"
  $script:warnings | ForEach-Object { Write-Host "- $_" }
}
exit 0
