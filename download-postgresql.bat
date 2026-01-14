@echo off
echo ========================================
echo   Скачивание PostgreSQL
echo ========================================
echo.

echo Открываю страницу загрузки PostgreSQL...
echo.
echo После скачивания:
echo 1. Запустите установщик
echo 2. Следуйте инструкциям
echo 3. ЗАПОМНИТЕ ПАРОЛЬ!
echo 4. После установки запустите: auto-setup.bat
echo.

REM Открываем страницу загрузки
start https://www.postgresql.org/download/windows/

echo.
echo Страница загрузки открыта в браузере.
echo.
pause
