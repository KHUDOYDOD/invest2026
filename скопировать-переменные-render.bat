@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   КОПИРОВАНИЕ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ДЛЯ RENDER
echo ═══════════════════════════════════════════════════════════
echo.

type ПЕРЕМЕННЫЕ_ДЛЯ_RENDER.txt | clip

echo ✅ Переменные окружения скопированы в буфер обмена!
echo.
echo Теперь в Render Dashboard:
echo.
echo 1. Откройте ваш сервис invest2026
echo 2. Перейдите в Environment (левое меню)
echo 3. Нажмите "Add from .env"
echo 4. Нажмите Ctrl+V чтобы вставить переменные
echo 5. Нажмите "Save Changes"
echo.
echo Render автоматически перезапустит сервис (1-2 минуты)
echo.
echo После этого сайт будет доступен:
echo https://invest2026.onrender.com
echo.
pause
