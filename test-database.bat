@echo off
chcp 65001 >nul
echo ========================================
echo Проверка структуры базы данных
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

echo Проверка таблицы users...
echo.

psql "%DATABASE_URL%" -c "\d users"

echo.
echo ========================================
echo Проверка завершена
echo ========================================
echo.
pause
