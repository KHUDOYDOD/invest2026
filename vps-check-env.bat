@echo off
chcp 65001 >nul
echo ========================================
echo ПРОВЕРКА .env НА VPS
echo ========================================
echo.

ssh root@130.49.213.197 "cat /root/invest2026/.env.production"

echo.
pause
