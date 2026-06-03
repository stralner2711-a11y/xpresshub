@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Build Android APK.ps1"
set "BUILD_EXIT=%ERRORLEVEL%"
if "%XPRESSINTRA_AUTO%"=="1" exit /b %BUILD_EXIT%
pause
exit /b %BUILD_EXIT%
