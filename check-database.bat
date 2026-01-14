@echo off
chcp 65001 >nul
echo ========================================
echo Проверка базы данных
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

psql "%DATABASE_URL%" -f scripts/check-users-table.sql

echo.
pause
