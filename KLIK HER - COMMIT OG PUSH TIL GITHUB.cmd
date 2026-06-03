@echo off
setlocal

set "REPO=C:\Users\Tommy\Documents\GitHub\xpresshub"
set "GIT=C:\Program Files\Git\cmd\git.exe"
set "LOG=C:\Users\Tommy\Documents\lastbils chauffør app\github-commit-push-log.txt"
set "MSG=Release 1.2.3 robust update check"

cls
echo ============================================================
echo XpressIntra - Commit og push til GitHub
echo ============================================================
echo.
echo Denne fil committer og sender opdateringen til GitHub.
echo Du skal ikke skrive noget.
echo.

if not exist "%GIT%" goto NoGit
if not exist "%REPO%\.git" goto NoRepo

echo Starter... > "%LOG%"
echo Repo: %REPO% >> "%LOG%"
echo Commit: %MSG% >> "%LOG%"
echo. >> "%LOG%"

echo Tjekker repo...
"%GIT%" -C "%REPO%" status --short >> "%LOG%" 2>&1
if errorlevel 1 goto Failed

"%GIT%" -C "%REPO%" status --short > "%TEMP%\xpressintra-git-status.txt" 2>nul
for %%A in ("%TEMP%\xpressintra-git-status.txt") do if %%~zA==0 goto NoChanges

echo.
echo Tilfoejer filer...
"%GIT%" -C "%REPO%" add -A >> "%LOG%" 2>&1
if errorlevel 1 goto Failed

echo.
echo Laver commit...
"%GIT%" -C "%REPO%" commit -m "%MSG%" >> "%LOG%" 2>&1
if errorlevel 1 goto Failed

echo.
echo Sender til GitHub...
"%GIT%" -C "%REPO%" push origin main >> "%LOG%" 2>&1
if errorlevel 1 goto Failed

echo.
echo ============================================================
echo FAERDIG - opdateringen er sendt til GitHub
echo ============================================================
echo.
echo Nu kan du koere:
echo Udgiv APK til GitHub.cmd
echo.
echo Log:
echo %LOG%
echo.
pause
exit /b 0

:NoChanges
echo.
echo Der er ingen aendringer at committe.
echo.
echo Hvis GitHub Desktop heller ikke kan committe, er det derfor knappen er graa.
echo Koer foerst:
echo KLIK HER - SEND TIL GITHUB DESKTOP.cmd
echo.
echo Log:
echo %LOG%
echo.
pause
exit /b 0

:NoGit
echo FEJL: Git blev ikke fundet her:
echo %GIT%
echo.
echo Installer Git for Windows eller aabn GitHub Desktop igen.
echo.
pause
exit /b 1

:NoRepo
echo FEJL: GitHub repoet blev ikke fundet her:
echo %REPO%
echo.
echo Aabn GitHub Desktop og clone repoet til:
echo C:\Users\Tommy\Documents\GitHub\xpresshub
echo.
pause
exit /b 1

:Failed
echo.
echo FEJL: Commit/push blev ikke faerdig.
echo.
echo Aabn denne log og send den til mig:
echo %LOG%
echo.
pause
exit /b 1
