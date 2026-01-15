@echo off
chcp 65001 >nul
echo ========================================
echo   СТАТУС ПРИЛОЖЕНИЯ НА VPS
echo ========================================
echo.

ssh root@130.49.213.197 "pm2 status && echo. && echo 'Использование диска:' && df -h / | grep -v Filesystem && echo. && echo 'Использование памяти:' && free -h"

echo.
pause
