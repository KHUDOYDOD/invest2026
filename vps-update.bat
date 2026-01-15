@echo off
chcp 65001 >nul
echo ========================================
echo ОБНОВЛЕНИЕ ПРОЕКТА НА VPS
echo ========================================
echo.

ssh root@130.49.213.197 "cd /root/invest2026 && git pull && npm install && npm run build && pm2 restart investpro"

echo.
echo ✅ Обновление завершено!
echo.
pause
