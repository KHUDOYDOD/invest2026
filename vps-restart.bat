@echo off
chcp 65001 >nul
echo ========================================
echo   ПЕРЕЗАПУСК ПРИЛОЖЕНИЯ НА VPS
echo ========================================
echo.

ssh root@130.49.213.197 "pm2 restart investpro && pm2 status"

echo.
echo ✅ Приложение перезапущено!
echo.
pause
