@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Opdater GitHub Desktop.ps1"
set "SYNC_EXIT=%ERRORLEVEL%"
pause
exit /b %SYNC_EXIT%
