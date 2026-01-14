@echo off
chcp 65001 >nul
echo ========================================
echo Добавление полей профиля в базу данных
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

echo Подключение к базе данных...
echo.

psql "%DATABASE_URL%" -f scripts/add-profile-fields.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Поля профиля успешно добавлены!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✗ Ошибка при добавлении полей
    echo ========================================
)

echo.
pause
