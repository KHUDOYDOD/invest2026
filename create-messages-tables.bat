@echo off
chcp 65001 >nul
echo ========================================
echo Создание таблиц для сообщений и уведомлений
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

psql "%DATABASE_URL%" -f create-messages-notifications-tables.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Таблицы успешно созданы!
    echo.
    echo Созданные таблицы:
    echo - messages (сообщения пользователей)
    echo - notifications (уведомления)
    echo - notification_preferences (настройки уведомлений)
    echo.
) else (
    echo.
    echo ❌ Ошибка при создании таблиц
    echo.
)

pause
