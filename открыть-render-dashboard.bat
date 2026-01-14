@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   ОТКРЫТИЕ RENDER DASHBOARD
echo ═══════════════════════════════════════════════════════════
echo.
echo Открываю Render Dashboard...
echo.

start https://dashboard.render.com/

echo.
echo ✅ Render Dashboard открыт в браузере
echo.
echo Что проверить:
echo 1. Статус сборки (должна быть успешной)
echo 2. Логи деплоя
echo 3. Переменные окружения (Environment Variables)
echo.
pause
