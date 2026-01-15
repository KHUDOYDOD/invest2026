@echo off
chcp 65001 >nul
echo ========================================
echo   ПРОСМОТР ЛОГОВ ПРИЛОЖЕНИЯ
echo ========================================
echo.
echo Подключаемся к VPS и показываем логи...
echo Для выхода нажмите Ctrl+C
echo.

ssh root@130.49.213.197 "pm2 logs investpro --lines 50"

pause
