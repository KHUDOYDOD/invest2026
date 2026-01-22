@echo off
chcp 65001 >nul
echo ========================================
echo 📥 УСТАНОВКА POSTGRESQL ДЛЯ WINDOWS
echo ========================================
echo.

echo 🔗 Открываю страницу загрузки PostgreSQL...
start https://www.postgresql.org/download/windows/

echo.
echo 📋 ИНСТРУКЦИЯ:
echo 1. Скачайте PostgreSQL 16 для Windows
echo 2. Запустите установщик
echo 3. При установке выберите только "Command Line Tools"
echo 4. После установки перезапустите командную строку
echo 5. Команда psql будет доступна
echo.

echo 🔧 АЛЬТЕРНАТИВНЫЙ СПОСОБ - через Chocolatey:
echo choco install postgresql
echo.

echo 🔧 АЛЬТЕРНАТИВНЫЙ СПОСОБ - через Scoop:
echo scoop install postgresql
echo.

pause