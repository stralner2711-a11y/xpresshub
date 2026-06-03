@echo off
setlocal

net session >nul 2>&1
if not "%errorlevel%"=="0" (
  echo Starter igen med administrator-rettigheder...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

set "SRC=%~dp0github-upload-ready"
set "DST=C:\Users\Tommy\Documents\GitHub\xpresshub"
set "LOG=%~dp0github-desktop-auto-sync-log.txt"

cls
echo ============================================================
echo XpressIntra - Send til GitHub Desktop
echo ============================================================
echo.
echo Denne fil kopierer den faerdige GitHub-pakke over i repoet.
echo Du skal ikke skrive noget.
echo.
echo Fra:
echo %SRC%
echo.
echo Til:
echo %DST%
echo.

if not exist "%SRC%\" goto NoSource
if not exist "%DST%\.git" goto NoRepo

echo Starter kopiering... > "%LOG%"
echo Fra: %SRC% >> "%LOG%"
echo Til: %DST% >> "%LOG%"
echo. >> "%LOG%"

echo Fjerner skrivebeskyttelse paa GitHub-mappen...
attrib -R "%DST%\*" /S /D >> "%LOG%" 2>&1

echo Sikrer adgang for din Windows-bruger...
icacls "%DST%" /grant "%USERNAME%:(OI)(CI)F" /T /C >> "%LOG%" 2>&1

echo.
echo Kopierer filer...
robocopy "%SRC%" "%DST%" /E /R:1 /W:1 /XJ /NP /TEE /LOG+:"%LOG%"
if errorlevel 4 goto Failed
findstr /C:"ERROR " "%LOG%" >nul
if not errorlevel 1 goto Failed

echo.
echo ============================================================
echo FAERDIG - GitHub Desktop-mappen er opdateret
echo ============================================================
echo.
echo Naeste trin:
echo 1. Aabn GitHub Desktop
echo 2. Skriv commit-besked:
echo    Release 1.2.3 robust update check
echo 3. Tryk Commit to main
echo 4. Tryk Push origin
echo.
echo Log:
echo %LOG%
echo.
pause
exit /b 0

:NoSource
echo FEJL: Jeg kan ikke finde github-upload-ready mappen.
echo.
echo Jeg leder efter:
echo %SRC%
echo.
pause
exit /b 1

:NoRepo
echo FEJL: GitHub repoet blev ikke fundet.
echo.
echo Jeg leder efter:
echo %DST%
echo.
echo Aabn GitHub Desktop og clone repoet til:
echo C:\Users\Tommy\Documents\GitHub\xpresshub
echo.
pause
exit /b 1

:Failed
echo.
echo FEJL: Kopiering blev ikke faerdig.
echo.
echo Aabn denne log og send den til mig:
echo %LOG%
echo.
pause
exit /b 1
