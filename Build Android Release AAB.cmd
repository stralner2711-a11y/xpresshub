@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0Build Android Release AAB.ps1"
pause
