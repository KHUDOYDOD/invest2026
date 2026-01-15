@echo off
chcp 65001 >nul
echo ========================================
echo SOZDANIE ADMINA NA VPS
echo ========================================
echo.
echo Username: Admin
echo Email:    X45395x@gmail.com
echo Password: X11021997x
echo.

echo [1/2] Kopiruem skript na VPS...
scp admin-script-for-vps.js root@130.49.213.197:/root/create-admin.js

if errorlevel 1 (
    echo Oshibka kopirovaniya!
    pause
    exit /b 1
)

echo.
echo [2/2] Zapuskaem skript na VPS...
echo.

ssh root@130.49.213.197 "cd /root && node create-admin.js"

echo.
echo ========================================
echo GOTOVO!
echo ========================================
echo.
echo Dannye dlya vhoda:
echo Username: Admin
echo Password: X11021997x
echo.
echo Admin panel:
echo http://130.49.213.197/admin
echo.
pause
