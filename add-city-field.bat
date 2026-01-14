@echo off
chcp 65001 >nul
echo ========================================
echo Добавление поля city в таблицу users
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="DATABASE_URL" set DATABASE_URL=%%b
)

if "%DATABASE_URL%"=="" (
    echo ❌ Ошибка: DATABASE_URL не найден в .env.local
    pause
    exit /b 1
)

echo 📊 Подключение к базе данных...
echo.

psql "%DATABASE_URL%" -f add-city-field.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Поле city успешно добавлено!
    echo.
    echo Теперь вы можете редактировать город в профиле.
    echo.
) else (
    echo.
    echo ❌ Ошибка при добавлении поля
    echo.
)

pause
