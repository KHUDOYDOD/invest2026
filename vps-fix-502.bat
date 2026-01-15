@echo off
chcp 65001 >nul
echo ========================================
echo ИСПРАВЛЕНИЕ ОШИБКИ 502
echo ========================================
echo.
echo Подключаемся к VPS и исправляем проблему...
echo.

ssh root@130.49.213.197 "pm2 delete all && fuser -k 3000/tcp 2>/dev/null; sleep 2 && cd /root/invest2026 && pm2 start npm --name investpro -- start && pm2 save && pm2 status"

echo.
echo ========================================
echo ГОТОВО! Проверьте сайт
echo ========================================
echo.
echo Откройте: http://130.49.213.197
echo.
pause
