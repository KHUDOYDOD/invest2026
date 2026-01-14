@echo off
chcp 65001 >nul
echo ========================================
echo Добавление поля password_hash
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

echo Подключение к базе данных...
echo.

psql "%DATABASE_URL%" -f scripts/add-password-field.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Поле password_hash успешно добавлено!
    echo ========================================
    echo.
    echo Для существующих пользователей установлен
    echo временный пароль: 123456
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ Ошибка при добавлении поля
    echo ========================================
)

echo.
pause
