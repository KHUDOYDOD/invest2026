@echo off
echo ========================================
echo   Установка PostgreSQL
echo ========================================
echo.

echo Скачиваем PostgreSQL 16 (стабильная версия)...
echo.

REM Создаем временную папку
mkdir temp 2>nul

REM Скачиваем PostgreSQL
echo Открываем страницу загрузки PostgreSQL...
start https://www.postgresql.org/download/windows/

echo.
echo ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
echo.
echo 1. Скачайте PostgreSQL 16 (рекомендуется)
echo 2. Запустите установщик от имени администратора
echo 3. При установке:
echo    - Выберите все компоненты
echo    - Установите пароль: postgres123
echo    - Порт: 5432 (по умолчанию)
echo    - Локаль: Russian, Russia
echo 4. После установки запустите: setup-database-new.bat
echo.

echo Создаем скрипт настройки с новым паролем...

echo @echo off > setup-database-new.bat
echo echo ======================================== >> setup-database-new.bat
echo echo   Настройка базы данных с новым паролем >> setup-database-new.bat
echo echo ======================================== >> setup-database-new.bat
echo echo. >> setup-database-new.bat
echo. >> setup-database-new.bat
echo REM Добавляем PostgreSQL в PATH >> setup-database-new.bat
echo set PATH=%%PATH%%;C:\Program Files\PostgreSQL\16\bin >> setup-database-new.bat
echo. >> setup-database-new.bat
echo echo [1/4] Создание базы данных investpro... >> setup-database-new.bat
echo set PGPASSWORD=postgres123 >> setup-database-new.bat
echo psql -U postgres -c "CREATE DATABASE investpro;" >> setup-database-new.bat
echo echo [OK] База данных создана >> setup-database-new.bat
echo echo. >> setup-database-new.bat
echo. >> setup-database-new.bat
echo echo [2/4] Инициализация структуры... >> setup-database-new.bat
echo psql -U postgres -d investpro -f complete-database-setup.sql >> setup-database-new.bat
echo echo [OK] Структура создана >> setup-database-new.bat
echo echo. >> setup-database-new.bat
echo. >> setup-database-new.bat
echo echo [3/4] Обновление .env.local... >> setup-database-new.bat
echo echo DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/investpro ^> .env.local.new >> setup-database-new.bat
echo type .env.local ^| findstr /V "DATABASE_URL" ^>^> .env.local.new >> setup-database-new.bat
echo move /Y .env.local.new .env.local >> setup-database-new.bat
echo echo [OK] Конфигурация обновлена >> setup-database-new.bat
echo echo. >> setup-database-new.bat
echo. >> setup-database-new.bat
echo echo [4/4] Запуск проекта... >> setup-database-new.bat
echo npm run dev >> setup-database-new.bat
echo. >> setup-database-new.bat
echo pause >> setup-database-new.bat

echo.
echo Скрипт setup-database-new.bat создан!
echo.
pause