@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 БЫСТРОЕ ВОССТАНОВЛЕНИЕ САЙТА
echo ========================================
echo.

echo VPS: 130.49.213.197
echo Пароль: 12345678
echo.

echo [1/3] Проверка соединения...
ping -n 1 130.49.213.197 >nul
if errorlevel 1 (
    echo ❌ VPS недоступен!
    pause
    exit /b 1
)
echo ✅ VPS отвечает

echo.
echo [2/3] Восстановление PM2 процесса...
echo Введите пароль: 12345678
echo.

ssh root@130.49.213.197 "cd /root/invest2026 && pm2 restart investpro || NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start && pm2 status"

echo.
echo [3/3] Проверка статуса...
ssh root@130.49.213.197 "pm2 status && echo 'Сайт восстановлен!'"

echo.
echo ========================================
echo ✅ ГОТОВО! ПРОВЕРЬТЕ САЙТ
echo ========================================
echo.
echo 🌐 Сайт: http://130.49.213.197
echo 📊 Админ: http://130.49.213.197/admin/dashboard
echo.
echo Логин: admin@admin.admin
echo Пароль: admin123
echo.
pause