@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo    🎉 ОТКРЫВАЕМ НОВЫЙ ДИЗАЙН УВЕДОМЛЕНИЯ
echo ═══════════════════════════════════════════════════════
echo.
echo Открываем HTML файл с демонстрацией...
echo.

start "" "%~dp0УВИДЕТЬ_НОВЫЙ_ДИЗАЙН_СЕЙЧАС.html"

timeout /t 2 >nul

echo.
echo ✅ Файл открыт в браузере!
echo.
echo Также можно открыть:
echo   • Локальный сервер: http://localhost:3000
echo   • GitHub: https://github.com/KHUDOYDOD/invest2026
echo.
pause
