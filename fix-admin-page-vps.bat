@echo off
chcp 65001 >nul
echo ========================================
echo SOZDANIE ADMIN STRANICY NA VPS
echo ========================================
echo.

echo [1/3] Kopiruem skript na VPS...
scp create-admin-page-on-vps.js root@130.49.213.197:/root/

echo.
echo [2/3] Sozdayom fayl page.tsx na VPS...
ssh root@130.49.213.197 "node /root/create-admin-page-on-vps.js"

echo.
echo [3/3] Perezapuskaem PM2...
ssh root@130.49.213.197 "pm2 restart investpro"

echo.
echo ========================================
echo GOTOVO!
echo ========================================
echo.
echo Teper otkroyte: http://130.49.213.197/admin
echo.
pause
