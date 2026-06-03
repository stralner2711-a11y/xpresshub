@echo off
setlocal EnableExtensions

net session >nul 2>&1
if not "%errorlevel%"=="0" (
  echo Starter igen med administrator-rettigheder...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

set "PROJECT=%~dp0"
set "READY=%PROJECT%github-upload-ready"
set "REPO=C:\Users\Tommy\Documents\GitHub\xpresshub"
set "GIT=C:\Program Files\Git\cmd\git.exe"
set "GH=C:\Program Files\GitHub CLI\gh.exe"
set "LOG=%PROJECT%opdater-alt-log.txt"
set "MSG=Release XpressIntra update"

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"

cls
echo ============================================================
echo XpressIntra - OPDATER ALT
echo ============================================================
echo.
echo Denne fil gor hele arbejdet:
echo 1. Bygger/synkroniserer appfiler
echo 2. Klargor GitHub-pakken
echo 3. Kopierer til GitHub-repoet
echo 4. Committer og pusher
echo 5. Bygger APK og opretter GitHub Release
echo.
echo Du skal bare lade vinduet koere faerdigt.
echo.

echo XpressIntra OPDATER ALT > "%LOG%"
echo Start: %DATE% %TIME% >> "%LOG%"
echo Project: %PROJECT% >> "%LOG%"
echo Ready: %READY% >> "%LOG%"
echo Repo: %REPO% >> "%LOG%"
echo. >> "%LOG%"

if not exist "%PROJECT%package.json" goto NoProject
if not exist "%REPO%\.git" goto NoRepo
if not exist "%GIT%" goto NoGit
if not exist "%GH%" goto NoGh

echo.
echo [1/6] Tjekker GitHub login...
"%GH%" auth status >> "%LOG%" 2>&1
if errorlevel 1 goto GhLoginFailed

echo.
echo [2/6] Bygger og synkroniserer Android-filer...
cd /d "%PROJECT%"
call npm.cmd run android:sync >> "%LOG%" 2>&1
if errorlevel 1 goto Failed

echo.
echo [3/6] Klargor GitHub-pakke...
if not exist "%READY%" mkdir "%READY%"
if exist "%READY%\qa\.edge-qa-profile" rmdir /S /Q "%READY%\qa\.edge-qa-profile" >> "%LOG%" 2>&1
if exist "%READY%\qa\screenshots" rmdir /S /Q "%READY%\qa\screenshots" >> "%LOG%" 2>&1
call :CopyFolder assets
if errorlevel 1 goto Failed
call :CopyFolder docs
if errorlevel 1 goto Failed
call :CopyFolder public
if errorlevel 1 goto Failed
call :CopyFolder qa
if errorlevel 1 goto Failed
call :CopyFolder src
if errorlevel 1 goto Failed
call :CopyFolder supabase
if errorlevel 1 goto Failed
call :CopyFolder tools
if errorlevel 1 goto Failed

echo Kopierer Android til pakken...
robocopy "%PROJECT%android" "%READY%\android" /E /R:1 /W:1 /XJ /NP /XD "%PROJECT%android\.gradle" "%PROJECT%android\build" "%PROJECT%android\app\build" "%PROJECT%android\capacitor-cordova-android-plugins\build" >> "%LOG%" 2>&1
if errorlevel 8 goto Failed

call :CopyRoot .gitignore
call :CopyRoot "Build Android APK.cmd"
call :CopyRoot "Build Android APK.ps1"
call :CopyRoot "Build Android Release AAB.cmd"
call :CopyRoot "Build Android Release AAB.ps1"
call :CopyRoot capacitor.config.json
call :CopyRoot index.html
call :CopyRoot manifest.webmanifest
call :CopyRoot netlify.toml
call :CopyRoot package-lock.json
call :CopyRoot package.json
call :CopyRoot README.md
call :CopyRoot service-worker.js
call :CopyRoot "Start Ren Web Preview.bat"
call :CopyRoot "Udgiv APK til GitHub.cmd"
call :CopyRoot "Udgiv APK til GitHub.ps1"
call :CopyRoot "KLIK HER - OPDATER ALT.cmd"
call :CopyRoot vercel.json

echo.
echo [4/6] Kopierer pakken til GitHub-repo...
attrib -R "%REPO%\*" /S /D >> "%LOG%" 2>&1
icacls "%REPO%" /grant "%USERNAME%:(OI)(CI)F" /T /C >> "%LOG%" 2>&1
if exist "%REPO%\qa\.edge-qa-profile" rmdir /S /Q "%REPO%\qa\.edge-qa-profile" >> "%LOG%" 2>&1
if exist "%REPO%\qa\screenshots" rmdir /S /Q "%REPO%\qa\screenshots" >> "%LOG%" 2>&1
robocopy "%READY%" "%REPO%" /E /R:1 /W:1 /XJ /NP >> "%LOG%" 2>&1
if errorlevel 4 goto Failed
findstr /C:"ERROR " "%LOG%" >nul
if not errorlevel 1 goto Failed

echo.
echo [5/6] Committer og pusher til GitHub...
"%GIT%" -C "%REPO%" status --short > "%TEMP%\xpressintra-status.txt" 2>> "%LOG%"
if errorlevel 1 goto Failed
for %%A in ("%TEMP%\xpressintra-status.txt") do if %%~zA==0 goto SkipCommit

"%GIT%" -C "%REPO%" add -A >> "%LOG%" 2>&1
if errorlevel 1 goto Failed
"%GIT%" -C "%REPO%" commit -m "%MSG%" >> "%LOG%" 2>&1
if errorlevel 1 goto Failed
"%GIT%" -C "%REPO%" push origin main >> "%LOG%" 2>&1
if errorlevel 1 goto Failed
goto AfterCommit

:SkipCommit
echo Ingen nye GitHub-aendringer at committe.
echo Ingen nye GitHub-aendringer at committe. >> "%LOG%"

:AfterCommit
echo.
echo [6/6] Bygger APK og opretter/overskriver release...
cd /d "%PROJECT%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%PROJECT%Udgiv APK til GitHub.ps1" >> "%LOG%" 2>&1
if errorlevel 1 goto Failed

echo.
echo ============================================================
echo FAERDIG - Alt er opdateret og sendt ud
echo ============================================================
echo.
echo Tjek release her:
echo https://github.com/stralner2711-a11y/xpresshub/releases/latest
echo.
echo Downloadside:
echo https://stralner2711-a11y.github.io/xpresshub/download.html
echo.
echo Log:
echo %LOG%
echo.
pause
exit /b 0

:CopyFolder
set "NAME=%~1"
if not exist "%PROJECT%%NAME%\" (
  echo Springer over mappe: %NAME% >> "%LOG%"
  exit /b 0
)
echo Klargor mappe: %NAME%
robocopy "%PROJECT%%NAME%" "%READY%\%NAME%" /E /R:1 /W:1 /XJ /NP /XD "%PROJECT%qa\.edge-qa-profile" "%PROJECT%qa\screenshots" >> "%LOG%" 2>&1
if errorlevel 8 exit /b 1
exit /b 0

:CopyRoot
set "FILE=%~1"
if exist "%PROJECT%%FILE%" (
  copy /Y "%PROJECT%%FILE%" "%READY%\%FILE%" >> "%LOG%" 2>&1
)
exit /b 0

:NoProject
echo FEJL: Projektmappen ser forkert ud.
echo Log: %LOG%
pause
exit /b 1

:NoRepo
echo FEJL: GitHub-repoet blev ikke fundet:
echo %REPO%
echo.
echo Clone repoet i GitHub Desktop til Documents\GitHub\xpresshub.
pause
exit /b 1

:NoGit
echo FEJL: Git blev ikke fundet:
echo %GIT%
echo.
echo Installer Git for Windows.
pause
exit /b 1

:NoGh
echo FEJL: GitHub CLI blev ikke fundet:
echo %GH%
echo.
echo Installer GitHub CLI fra https://cli.github.com/
pause
exit /b 1

:GhLoginFailed
echo FEJL: GitHub CLI er ikke logget ind.
echo.
echo Aabn PowerShell og kor:
echo gh auth login
echo.
echo Log: %LOG%
pause
exit /b 1

:Failed
echo.
echo ============================================================
echo FEJL - Opdater alt blev ikke faerdig
echo ============================================================
echo.
echo Send mig denne log:
echo %LOG%
echo.
pause
exit /b 1
