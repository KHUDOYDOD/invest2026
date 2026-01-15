@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   SOZDANIE ADMINA - AVTOPILOT
echo ========================================
echo.
echo Dannye admina:
echo   Username: Admin
echo   Password: X11021997x
echo   Email:    X45395x@gmail.com
echo.
echo ========================================
echo.
echo VNIMANIE:
echo Vam nuzhno vvesti parol VPS 4 raza: 12345678
echo.
echo Otkroyte fayl "!!! SKOPIRUY I VSTAVЬ !!!.txt"
echo i skopiruy parol pered zapuskom.
echo.
echo Potom prosto vstavlyayte parol kazhdyy raz.
echo.
echo ========================================
echo.
pause

echo.
echo [1/4] Kopiruem skript stranicy...
scp create-admin-page-on-vps.js root@130.49.213.197:/root/

echo.
echo [2/4] Sozdayom stranicu...
ssh root@130.49.213.197 "node /root/create-admin-page-on-vps.js && pm2 restart investpro"

echo.
echo [3/4] Kopiruem skript admina...
scp admin-script-for-vps.js root@130.49.213.197:/root/create-admin.js

echo.
echo [4/4] Sozdayom admina...
ssh root@130.49.213.197 "cd /root && node create-admin.js"

echo.
echo ========================================
echo VSE GOTOVO!
echo ========================================
echo.
echo Admin panel: http://130.49.213.197/admin
echo.
echo Username: Admin
echo Password: X11021997x
echo.
pause
