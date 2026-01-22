@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 БЫСТРОЕ ВОССТАНОВЛЕНИЕ VPS
echo ========================================
echo.

echo Подключаемся к VPS и восстанавливаем PM2...
echo Введите пароль: 12345678
echo.

ssh root@130.49.213.197

echo.
echo ========================================
echo ✅ ГОТОВО!
echo ========================================
echo.
echo После подключения выполните эти команды:
echo.
echo cd /root/invest2026
echo pm2 status
echo pm2 restart investpro
echo pm2 status
echo.
echo Если PM2 не запущен:
echo NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start
echo.
pause