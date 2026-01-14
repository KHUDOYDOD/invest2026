@echo off
echo ========================================
echo   Автоматическая настройка системы
echo ========================================
echo.

REM Проверка PostgreSQL
echo [1/5] Проверка PostgreSQL...
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] PostgreSQL НЕ УСТАНОВЛЕН
    echo.
    echo Пожалуйста, установите PostgreSQL:
    echo 1. Откройте: https://www.postgresql.org/download/windows/
    echo 2. Скачайте установщик
    echo 3. Запустите и следуйте инструкциям
    echo 4. ЗАПОМНИТЕ ПАРОЛЬ для пользователя postgres!
    echo.
    echo После установки запустите этот скрипт снова.
    echo.
    pause
    
    REM Пытаемся открыть страницу загрузки
    start https://www.postgresql.org/download/windows/
    exit /b 1
)

echo [OK] PostgreSQL установлен
echo.

REM Проверка Node.js
echo [2/5] Проверка Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Node.js не найден!
    pause
    exit /b 1
)
echo [OK] Node.js установлен
echo.

REM Проверка .env.local
echo [3/5] Проверка конфигурации...
if not exist .env.local (
    echo [!] Файл .env.local не найден
    echo Создаю файл с настройками по умолчанию...
    echo.
    
    set /p DB_PASSWORD="Введите пароль PostgreSQL: "
    
    (
        echo # База данных PostgreSQL
        echo DATABASE_URL=postgresql://postgres:%DB_PASSWORD%@localhost:5432/investpro
        echo.
        echo # Альтернативные переменные для базы данных
        echo POSTGRES_URL=postgresql://postgres:%DB_PASSWORD%@localhost:5432/investpro
        echo POSTGRES_PRISMA_URL=postgresql://postgres:%DB_PASSWORD%@localhost:5432/investpro
        echo.
        echo # Аутентификация
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
        echo NEXTAUTH_SECRET=your_super_secret_nextauth_key_change_this_in_production
        echo NEXTAUTH_URL=http://localhost:3000
        echo.
        echo # Настройки приложения
        echo NODE_ENV=development
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > .env.local
    
    echo [OK] Файл .env.local создан
) else (
    echo [OK] Файл .env.local существует
)
echo.

REM Настройка базы данных
echo [4/5] Настройка базы данных...
echo.
set /p SETUP_DB="Настроить базу данных? (y/n): "
if /i "%SETUP_DB%"=="y" (
    call setup-database.bat
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось настроить базу данных
        pause
        exit /b 1
    )
)
echo.

REM Создание супер-админа
echo [5/5] Создание супер-администратора...
echo.
set /p CREATE_ADMIN="Создать супер-администратора? (y/n): "
if /i "%CREATE_ADMIN%"=="y" (
    call create-super-admin.bat
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось создать супер-администратора
        pause
        exit /b 1
    )
)
echo.

echo ========================================
echo   Настройка завершена!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Запустите: npm run dev
echo 2. Откройте: http://localhost:3000
echo 3. Войдите с данными супер-админа
echo.
echo Данные для входа сохранены в:
echo   SUPER_ADMIN_CREDENTIALS.md
echo.
pause
