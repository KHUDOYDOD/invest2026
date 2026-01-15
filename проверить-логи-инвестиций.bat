@echo off
chcp 65001 >nul
echo ========================================
echo ЛОГИ СОЗДАНИЯ ИНВЕСТИЦИЙ
echo ========================================
echo.

ssh root@130.49.213.197 "pm2 logs investpro --lines 50 --nostream"

echo.
pause
