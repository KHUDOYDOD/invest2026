@echo off
chcp 65001 >nul
echo ========================================
echo Поиск правильного пароля PostgreSQL
echo ========================================
echo.

echo Попробуем разные пароли...
echo.

set passwords=postgres admin root 12345 password 123456 postgres123

for %%p in (%passwords%) do (
    echo Проверка пароля: %%p
    psql "postgresql://postgres:%%p@localhost:5432/postgres" -c "SELECT 1;" >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo.
        echo ========================================
        echo ✓ НАЙДЕН ПРАВИЛЬНЫЙ ПАРОЛЬ: %%p
        echo ========================================
        echo.
        echo Обновите файл .env.local:
        echo DATABASE_URL=postgresql://postgres:%%p@localhost:5432/investpro
        echo.
        pause
        exit /b 0
    )
)

echo.
echo ========================================
echo ✗ Пароль не найден среди стандартных
echo ========================================
echo.
echo Попробуйте вспомнить пароль, который вы
echo установили при установке PostgreSQL.
echo.
echo Или сбросьте пароль:
echo 1. Откройте pgAdmin
echo 2. Правый клик на "postgres" ^> Properties
echo 3. Вкладка "Definition" ^> измените пароль
echo.
pause
