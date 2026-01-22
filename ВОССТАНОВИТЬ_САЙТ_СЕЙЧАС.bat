@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 ВОССТАНОВЛЕНИЕ САЙТА - АВТОМАТИЧЕСКИ
echo ========================================
echo.

echo VPS: 130.49.213.197
echo Пароль: 12345678
echo.

echo [1/5] Проверка соединения...
ping -n 2 130.49.213.197 >nul
if errorlevel 1 (
    echo ❌ VPS недоступен!
    pause
    exit /b 1
)
echo ✅ VPS отвечает

echo.
echo [2/5] Сборка проекта...
call npm run build
if errorlevel 1 (
    echo ❌ Ошибка сборки!
    pause
    exit /b 1
)
echo ✅ Проект собран

echo.
echo [3/5] Восстановление PM2 процесса...
echo Вводим пароль: 12345678
echo.

(
echo cd /root/invest2026
echo pm2 status
echo pm2 restart investpro ^|^| NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start
echo pm2 status
echo exit
) | ssh root@130.49.213.197

echo.
echo [4/5] Обновление кода...
echo Вводим пароль еще раз: 12345678
echo.

(
echo cd /root/invest2026
echo git pull origin main
echo exit
) | ssh root@130.49.213.197

echo.
echo [5/5] Копирование .next и перезапуск...
echo Последний раз вводим пароль: 12345678
echo.

scp -r .next root@130.49.213.197:/root/invest2026/

(
echo cd /root/invest2026
echo pm2 restart investpro
echo pm2 status
echo echo "Сайт восстановлен!"
echo exit
) | ssh root@130.49.213.197

echo.
echo ========================================
echo ✅ ГОТОВО! САЙТ ДОЛЖЕН РАБОТАТЬ
echo ========================================
echo.
echo 🌐 Проверьте: http://130.49.213.197
echo 📊 Админ панель: http://130.49.213.197/admin/dashboard
echo.
echo Логин: admin
echo Пароль: X11021997x
echo.
pause