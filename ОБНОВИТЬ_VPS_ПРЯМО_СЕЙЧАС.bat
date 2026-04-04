@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🚀 ОБНОВЛЕНИЕ VPS 213.171.31.215
echo ═══════════════════════════════════════════════════════
echo.
echo Этот скрипт обновит сервер из GitHub
echo.
echo Сервер: 213.171.31.215
echo Проект: /var/www/invest2026
echo GitHub: https://github.com/KHUDOYDOD/invest2026
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo ВНИМАНИЕ: Вам нужно будет ввести пароль от сервера!
echo.
pause

echo.
echo Подключаемся к серверу и выполняем обновление...
echo.

ssh root@213.171.31.215 "cd /var/www/invest2026 && echo '✅ Подключено к серверу' && echo '' && echo '📥 Сбрасываем локальные изменения...' && git reset --hard HEAD && echo '' && echo '📥 Загружаем из GitHub...' && git pull origin main && echo '' && echo '🗑️  Удаляем кэш Next.js...' && rm -rf .next && echo '' && echo '📦 Устанавливаем зависимости...' && npm install && echo '' && echo '🔄 Перезапускаем PM2...' && pm2 restart invest2026 && echo '' && echo '✅ ГОТОВО!' && echo '' && pm2 status && echo '' && echo 'Последний коммит:' && git log --oneline -1"

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ ОБНОВЛЕНИЕ ЗАВЕРШЕНО!
echo ═══════════════════════════════════════════════════════
echo.
echo 🌐 Откройте: http://213.171.31.215
echo.
echo ⚠️  ОЧИСТИТЕ КЭШ БРАУЗЕРА:
echo.
echo    1. Нажмите: Ctrl + Shift + Delete
echo    2. Выберите: "Изображения и файлы в кэше"
echo    3. Период: "Все время"
echo    4. Нажмите: "Удалить данные"
echo.
echo    ИЛИ откройте в режиме инкогнито: Ctrl + Shift + N
echo.
echo ═══════════════════════════════════════════════════════
echo.

timeout /t 3 >nul
start http://213.171.31.215

pause
