@echo off
echo ========================================
echo   Создание Супер-Администратора
echo ========================================
echo.

REM Проверка наличия Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Node.js не найден!
    echo Пожалуйста, установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js найден
echo.

REM Проверка наличия PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ПРЕДУПРЕЖДЕНИЕ] PostgreSQL не найден в PATH
    echo Убедитесь, что PostgreSQL установлен и запущен
    echo.
)

REM Проверка .env.local
if not exist .env.local (
    echo [ОШИБКА] Файл .env.local не найден!
    echo Пожалуйста, сначала настройте базу данных:
    echo   setup-database.bat
    pause
    exit /b 1
)

echo [OK] Конфигурация найдена
echo.

echo ========================================
echo   ВНИМАНИЕ!
echo ========================================
echo.
echo Будет создан супер-администратор с:
echo   - ID: 1 (первый пользователь)
echo   - Email: creator@investpro.com
echo   - Пароль: SuperAdmin2025!
echo   - Роль: super_admin (полный контроль)
echo.
echo Этот пользователь будет иметь ПОЛНЫЙ доступ
echo ко всем функциям системы!
echo.
set /p CONFIRM="Продолжить? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Отменено пользователем
    pause
    exit /b 0
)
echo.

echo ========================================
echo   Создание супер-администратора...
echo ========================================
echo.

REM Запуск скрипта создания
node scripts/create-super-admin.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Успешно создан!
    echo ========================================
    echo.
    echo Данные сохранены в файл:
    echo   SUPER_ADMIN_CREDENTIALS.md
    echo.
    echo Следующие шаги:
    echo   1. Откройте: http://localhost:3000/login
    echo   2. Войдите с данными из файла
    echo   3. Получите полный доступ к системе!
    echo.
) else (
    echo.
    echo ========================================
    echo   Ошибка при создании!
    echo ========================================
    echo.
    echo Возможные причины:
    echo   - PostgreSQL не запущен
    echo   - Неверные данные в .env.local
    echo   - База данных не инициализирована
    echo.
    echo Попробуйте:
    echo   1. Запустите PostgreSQL
    echo   2. Проверьте .env.local
    echo   3. Запустите: setup-database.bat
    echo.
)

pause
