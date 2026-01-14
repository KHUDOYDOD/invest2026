@echo off
chcp 65001 >nul
echo ========================================
echo Настройка базы данных для регистрации
echo ========================================
echo.

REM Загружаем переменные окружения из .env.local
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

echo Шаг 1: Добавление поля password_hash...
psql "%DATABASE_URL%" -f scripts/add-password-field.sql
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Ошибка на шаге 1
    pause
    exit /b 1
)
echo ✓ Шаг 1 завершен
echo.

echo Шаг 2: Добавление полей профиля...
psql "%DATABASE_URL%" -f scripts/add-profile-fields.sql
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Ошибка на шаге 2
    pause
    exit /b 1
)
echo ✓ Шаг 2 завершен
echo.

echo Шаг 3: Создание тестового пользователя...
psql "%DATABASE_URL%" -f scripts/create-test-registration.sql
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Ошибка на шаге 3
    pause
    exit /b 1
)
echo ✓ Шаг 3 завершен
echo.

echo ========================================
echo ✓ Настройка завершена успешно!
echo ========================================
echo.
echo Теперь вы можете:
echo 1. Войти с тестовым аккаунтом:
echo    Email: test@example.com
echo    Пароль: 123456
echo.
echo 2. Или зарегистрировать нового пользователя
echo.
echo Не забудьте перезапустить сервер!
echo.
pause
