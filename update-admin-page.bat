@echo off
chcp 65001 >nul
echo ========================================
echo OBNOVLENIE ADMIN STRANICY
echo ========================================
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

echo [1/4] Sborka proekta...
call npm run build

if errorlevel 1 (
    echo.
    echo Oshibka pri sborke!
    pause
    exit /b 1
)

echo.
echo [2/4] Udalenie staroy .next na VPS...
ssh root@130.49.213.197 "rm -rf /root/invest2026/.next"

echo.
echo [3/4] Kopirovanie novoy .next na VPS...
scp -r .next root@130.49.213.197:/root/invest2026/

if errorlevel 1 (
    echo.
    echo Oshibka pri kopirovanii!
    pause
    exit /b 1
)

echo.
echo [4/4] Perezapusk prilozheniya...
ssh root@130.49.213.197 "cd /root/invest2026 && pm2 restart investpro"

echo.
echo Zhdem 3 sekundy...
timeout /t 3 /nobreak >nul

echo.
echo Proverka statusa...
ssh root@130.49.213.197 "pm2 status"

echo.
echo ========================================
echo GOTOVO! Admin stranica obnovlena
echo ========================================
echo.
echo Teper mozhete otkryt:
echo http://130.49.213.197/admin
echo.
echo Dannye dlya vhoda:
echo Username: Admin
echo Password: X11021997x
echo.
echo (Snachala nuzhno sozdat admina cherez create-admin-simple.bat)
echo.
pause
