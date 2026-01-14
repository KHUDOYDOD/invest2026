@echo off
echo ========================================
echo   Настройка базы данных InvestPro
echo ========================================
echo.

REM Проверка наличия PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] PostgreSQL не найден!
    echo Пожалуйста, установите PostgreSQL с https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo [OK] PostgreSQL найден
echo.

REM Запрос пароля
set /p POSTGRES_PASSWORD="Введите пароль для пользователя postgres: "
echo.

REM Создание базы данных
echo [1/4] Создание базы данных investpro...
psql -U postgres -c "CREATE DATABASE investpro;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] База данных создана
) else (
    echo [INFO] База данных уже существует
)
echo.

REM Инициализация структуры
echo [2/4] Инициализация структуры базы данных...
psql -U postgres -d investpro -f complete-database-setup.sql
if %ERRORLEVEL% EQU 0 (
    echo [OK] Структура создана
) else (
    echo [ОШИБКА] Не удалось создать структуру
    pause
    exit /b 1
)
echo.

REM Обновление .env.local
echo [3/4] Обновление конфигурации...
echo DATABASE_URL=postgresql://postgres:%POSTGRES_PASSWORD%@localhost:5432/investpro > .env.local.temp
type .env.local | findstr /V "DATABASE_URL" >> .env.local.temp
move /Y .env.local.temp .env.local >nul
echo [OK] Конфигурация обновлена
echo.

REM Очистка демо-данных
echo [4/4] Очистка демо-данных...
set /p CLEAN_DEMO="Хотите очистить демо-данные? (y/n): "
if /i "%CLEAN_DEMO%"=="y" (
    node scripts/clean-demo-data.js
    echo [OK] Демо-данные очищены
) else (
    echo [SKIP] Демо-данные сохранены
)
echo.

echo ========================================
echo   Настройка завершена успешно!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Запустите: npm run dev
echo 2. Откройте: http://localhost:3000
echo 3. Зарегистрируйтесь на сайте
echo 4. Обновите роль на admin в базе данных
echo.
pause
