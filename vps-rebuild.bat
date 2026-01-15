@echo off
chcp 65001 >nul
echo ========================================
echo ПЕРЕСБОРКА ПРОЕКТА НА VPS
echo ========================================
echo.
echo Это займет 2-3 минуты...
echo.

ssh root@130.49.213.197 "cd /root/invest2026 && rm -rf .next && NODE_OPTIONS='--max-old-space-size=768' npm run build && pm2 restart investpro"

echo.
echo ========================================
echo ГОТОВО!
echo ========================================
echo.
pause
