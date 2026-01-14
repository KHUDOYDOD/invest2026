@echo off
echo 🗄️ Подключение к базе данных investpro...
echo.
echo Введите пароль: postgres123
echo.

REM Попробуем найти psql в стандартных местах
set PSQL_PATH=""

if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" (
    set PSQL_PATH="C:\Program Files\PostgreSQL\16\bin\psql.exe"
) else if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set PSQL_PATH="C:\Program Files\PostgreSQL\15\bin\psql.exe"
) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    set PSQL_PATH="C:\Program Files\PostgreSQL\14\bin\psql.exe"
) else if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" (
    set PSQL_PATH="C:\Program Files\PostgreSQL\13\bin\psql.exe"
) else (
    echo ❌ PostgreSQL не найден в стандартных папках
    echo Попробуйте найти psql.exe вручную
    pause
    exit /b 1
)

echo ✅ Найден PostgreSQL: %PSQL_PATH%
echo.

%PSQL_PATH% -U postgres -d investpro

pause