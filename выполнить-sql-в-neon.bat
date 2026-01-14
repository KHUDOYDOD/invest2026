@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🗄️ ВЫПОЛНЕНИЕ SQL В NEON DATABASE
echo ═══════════════════════════════════════════════════════════════
echo.

echo Проверяю наличие psql...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ PostgreSQL клиент (psql) не установлен!
    echo.
    echo 📝 Два способа выполнить SQL:
    echo.
    echo СПОСОБ 1 - Через Neon Dashboard (рекомендуется):
    echo    1. Откройте: https://console.neon.tech
    echo    2. Выберите вашу базу данных
    echo    3. Откройте SQL Editor
    echo    4. Скопируйте содержимое файла neon-database-setup.sql
    echo    5. Вставьте и нажмите Run
    echo.
    echo СПОСОБ 2 - Установить PostgreSQL:
    echo    1. Скачайте: https://www.postgresql.org/download/windows/
    echo    2. Установите только клиентские инструменты
    echo    3. Запустите этот файл снова
    echo.
    echo Открыть Neon Dashboard сейчас? (Y/N)
    choice /c YN /n
    if errorlevel 2 goto end
    start https://console.neon.tech
    goto end
)

echo ✅ psql найден!
echo.
echo Выполняю SQL скрипт...
echo.

psql "postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require" -f neon-database-setup.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ SQL успешно выполнен!
    echo.
    echo 🎉 База данных готова к использованию!
    echo.
    echo 📝 Следующий шаг:
    echo    Запустите: открыть-cloudflare-pages.bat
    echo.
) else (
    echo.
    echo ❌ Ошибка при выполнении SQL!
    echo.
    echo 💡 Попробуйте выполнить SQL через Neon Dashboard:
    echo    https://console.neon.tech
    echo.
)

:end
pause
