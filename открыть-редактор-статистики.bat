@echo off
echo ========================================
echo   РЕДАКТОР СТАТИСТИКИ САЙТА
echo ========================================
echo.
echo Открываем админ панель для редактирования статистики...
echo.
start http://localhost:3000/admin/statistics
echo.
echo Если сервер не запущен, запустите его командой:
echo npm run dev
echo.
pause
