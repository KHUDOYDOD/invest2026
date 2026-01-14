@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ДЕПЛОЙ НА RENDER + NEON
echo ========================================
echo.

echo 📋 ШАГ 1: Инициализация Git репозитория
echo.
git init
if errorlevel 1 (
    echo ❌ Ошибка инициализации Git
    pause
    exit /b 1
)

echo.
echo 📋 ШАГ 2: Добавление файлов в Git
echo.
git add .
git commit -m "Initial commit for Render deployment"
if errorlevel 1 (
    echo ⚠️ Возможно, уже есть коммит
)

echo.
echo ========================================
echo ✅ Git репозиторий готов!
echo ========================================
echo.
echo 📝 СЛЕДУЮЩИЕ ШАГИ:
echo.
echo 1. Создайте репозиторий на GitHub:
echo    https://github.com/new
echo.
echo 2. Выполните команды:
echo    git remote add origin https://github.com/ваш-username/invest2025.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Создайте базу данных в Neon:
echo    https://neon.tech
echo    - Создайте проект
echo    - Скопируйте Connection String
echo    - Выполните SQL из файла complete-database-setup.sql
echo.
echo 4. Создайте Web Service на Render:
echo    https://render.com
echo    - New + → Web Service
echo    - Подключите GitHub репозиторий
echo    - Добавьте Environment Variables (DATABASE_URL из Neon)
echo.
echo 📖 Подробная инструкция: RENDER_NEON_DEPLOYMENT.md
echo.
pause
