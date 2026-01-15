@echo off
chcp 65001 >nul
echo ========================================
echo SOZDANIE ADMINA
echo ========================================
echo.
echo Username: Admin
echo Email:    X45395x@gmail.com
echo Password: X11021997x
echo.
echo Sozdayom admina...
echo.

set NODE_TLS_REJECT_UNAUTHORIZED=0
node create-admin-final.js

echo.
echo ========================================
echo GOTOVO!
echo ========================================
echo.
echo Teper mozhete voyti:
echo http://130.49.213.197/admin
echo.
echo Username: Admin
echo Password: X11021997x
echo.
pause
