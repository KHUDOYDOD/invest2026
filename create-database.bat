@echo off
chcp 65001 >nul
echo ========================================
echo Создание базы данных investpro
echo ========================================
echo.

echo Подключение к PostgreSQL...
psql -U postgres -c "CREATE DATABASE investpro;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ База данных investpro создана успешно!
) else (
    echo.
    echo База данных investpro уже существует или произошла ошибка
)

echo.
echo Проверка базы данных...
psql -U postgres -c "\l" | findstr investpro

echo.
echo ========================================
pause
