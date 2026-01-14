@echo off
chcp 65001 >nul
echo ========================================
echo Создание таблицы настроек сайта
echo ========================================
echo.

set PGPASSWORD=1234
set PSQL_PATH=C:\Users\x4539\AppData\Local\Programs\pgAdmin 4\runtime\psql.exe

echo Подключение к базе данных invest_platform...
echo.

"%PSQL_PATH%" -h localhost -p 5432 -U postgres -d invest_platform -f scripts/create-settings-table.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Таблица настроек успешно создана!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✗ Ошибка при создании таблицы
    echo ========================================
)

echo.
pause
