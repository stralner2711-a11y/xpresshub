@echo off
setlocal

set "REPO=C:\Users\Tommy\Documents\GitHub\xpresshub"
set "GIT=C:\Program Files\Git\cmd\git.exe"

cls
echo ============================================================
echo XpressIntra - GitHub status
echo ============================================================
echo.

if not exist "%GIT%" (
  echo Git blev ikke fundet.
  pause
  exit /b 1
)

if not exist "%REPO%\.git" (
  echo Repoet blev ikke fundet:
  echo %REPO%
  pause
  exit /b 1
)

echo Branch:
"%GIT%" -C "%REPO%" branch --show-current
echo.

echo Aendringer:
"%GIT%" -C "%REPO%" status --short
echo.

echo Hvis der ikke staar noget under Aendringer, er der intet at committe.
echo Hvis der staar filer, kan du koere:
echo KLIK HER - COMMIT OG PUSH TIL GITHUB.cmd
echo.
pause
