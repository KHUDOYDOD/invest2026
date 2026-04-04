@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🔥 ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ VPS
echo ═══════════════════════════════════════════════════════
echo.
echo Сервер: 213.171.31.215
echo.
echo Это принудительно обновит сервер из GitHub!
echo.
pause

echo.
echo [1/6] Останавливаем PM2...
ssh root@213.171.31.215 "pm2 stop invest2026"

echo.
echo [2/6] Переходим в папку проекта...
ssh root@213.171.31.215 "cd /var/www/invest2026 && pwd"

echo.
echo [3/6] Сбрасываем локальные изменения...
ssh root@213.171.31.215 "cd /var/www/invest2026 && git reset --hard HEAD"

echo.
echo [4/6] Загружаем изменения из GitHub...
ssh root@213.171.31.215 "cd /var/www/invest2026 && git pull origin main"

echo.
echo [5/6] Удаляем кэш и устанавливаем зависимости...
ssh root@213.171.31.215 "cd /var/www/invest2026 && rm -rf .next && npm install"

echo.
echo [6/6] Перезапускаем PM2...
ssh root@213.171.31.215 "pm2 restart invest2026"

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ ОБНОВЛЕНИЕ ЗАВЕРШЕНО!
echo ═══════════════════════════════════════════════════════
echo.
echo Проверяем статус:
ssh root@213.171.31.215 "pm2 status"

echo.
echo Последний коммит на сервере:
ssh root@213.171.31.215 "cd /var/www/invest2026 && git log --oneline -1"

echo.
echo ═══════════════════════════════════════════════════════
echo.
echo 🌐 Откройте: http://213.171.31.215
echo.
echo ⚠️  ОЧИСТИТЕ КЭШ БРАУЗЕРА:
echo    Ctrl + Shift + Delete
echo    Или откройте в режиме инкогнито: Ctrl + Shift + N
echo.
echo ═══════════════════════════════════════════════════════
echo.

timeout /t 3 >nul
start http://213.171.31.215

pause
