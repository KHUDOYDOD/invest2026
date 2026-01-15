@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   AVTOMATICHESKAYA USTANOVKA
echo ========================================
echo.
echo Chto budet sdelano:
echo   1. Sozdanie admin stranicy
echo   2. Sozdanie admin polzovatelya
echo.
echo Dannye admina:
echo   Username: Admin
echo   Password: X11021997x
echo   Email:    X45395x@gmail.com
echo.
echo Vam nuzhno vvesti parol VPS: 12345678
echo (4 raza - eto normalno)
echo.
pause

echo.
echo ========================================
echo SHAG 1: SOZDANIE ADMIN STRANICY
echo ========================================
echo.

echo Kopiruem skript...
scp create-admin-page-on-vps.js root@130.49.213.197:/root/

echo.
echo Sozdayom fayl page.tsx...
ssh root@130.49.213.197 "node /root/create-admin-page-on-vps.js"

echo.
echo Perezapuskaem PM2...
ssh root@130.49.213.197 "pm2 restart investpro"

echo.
echo ========================================
echo SHAG 2: SOZDANIE ADMIN POLZOVATELYA
echo ========================================
echo.

echo Kopiruem skript...
scp admin-script-for-vps.js root@130.49.213.197:/root/create-admin.js

echo.
echo Sozdayom admina v baze dannyh...
ssh root@130.49.213.197 "cd /root && node create-admin.js"

echo.
echo ========================================
echo VSE GOTOVO!
echo ========================================
echo.
echo Admin panel: http://130.49.213.197/admin
echo.
echo Dannye dlya vhoda:
echo   Username: Admin
echo   Password: X11021997x
echo.
echo ========================================
echo.
pause
