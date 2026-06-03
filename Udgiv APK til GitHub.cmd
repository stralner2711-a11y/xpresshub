@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Udgiv APK til GitHub.ps1"
set "RELEASE_EXIT=%ERRORLEVEL%"
pause
exit /b %RELEASE_EXIT%
