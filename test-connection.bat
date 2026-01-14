@echo off
chcp 65001 >nul
echo ========================================
echo Тест подключения к базе данных
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

echo Попытка подключения к базе данных...
echo DATABASE_URL: %DATABASE_URL%
echo.

psql "%DATABASE_URL%" -c "SELECT version();"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Подключение успешно!
    echo ========================================
    echo.
    echo Проверка таблицы users...
    psql "%DATABASE_URL%" -c "SELECT COUNT(*) as total_users FROM users;"
    echo.
    echo Проверка поля password_hash...
    psql "%DATABASE_URL%" -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash';"
) else (
    echo.
    echo ========================================
    echo ✗ Ошибка подключения!
    echo ========================================
    echo.
    echo Возможные причины:
    echo 1. PostgreSQL не запущен
    echo 2. Неправильный пароль в DATABASE_URL
    echo 3. База данных investpro не существует
    echo.
)

echo.
pause
