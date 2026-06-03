@echo off
setlocal EnableExtensions
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\opdater-alt.ps1"
echo.
echo Script afsluttede med kode %ERRORLEVEL%.
echo Hvis der stod en fejl, maa vinduet gerne blive aabent nu.
pause
