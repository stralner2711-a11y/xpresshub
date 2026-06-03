@echo off
title XpressIntra Ren Web Preview
cd /d "%~dp0"
echo.
echo Lukker gamle lokale preview-servere paa port 4173, 5173 og 5174...
for %%p in (4173 5173 5174) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>nul
  )
)
echo.
echo Starter XpressIntra med frisk preview...
echo.
echo Naar serveren er klar, aabn denne:
echo http://127.0.0.1:5173/preview-demo.html?tab=home
echo.
start "" "http://127.0.0.1:5173/preview-demo.html?tab=home"
echo Browseren aabnes automatisk.
echo.
echo Hvis browseren stadig viser gammelt design:
echo Tryk Ctrl + F5 paa computeren, eller luk og aabn browseren paa mobilen.
echo.
"C:\Program Files\nodejs\npm.cmd" run dev -- --host 127.0.0.1 --port 5173 --force
pause
