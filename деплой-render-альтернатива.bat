@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 АЛЬТЕРНАТИВНЫЙ ДЕПЛОЙ НА RENDER
echo ========================================
echo.

echo 📋 Поскольку VPS недоступен, используем Render.com
echo.

echo [INFO] Открываю необходимые ссылки...
echo.

echo 1️⃣ GitHub репозиторий:
start https://github.com/KHUDOYDOD/invest2026
timeout /t 2 /nobreak >nul

echo 2️⃣ Render Dashboard:
start https://dashboard.render.com
timeout /t 2 /nobreak >nul

echo 3️⃣ Neon Database:
start https://console.neon.tech
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo 📋 ИНСТРУКЦИЯ ПО ДЕПЛОЮ НА RENDER
echo ========================================
echo.

echo 🔧 ШАГ 1: Подготовка GitHub
echo - Убедитесь что код загружен в репозиторий
echo - Проверьте что есть файлы package.json и next.config.mjs
echo.

echo 🔧 ШАГ 2: Создание Web Service на Render
echo - Зайдите на dashboard.render.com
echo - Нажмите "New +" → "Web Service"
echo - Подключите GitHub репозиторий: KHUDOYDOD/invest2026
echo - Выберите ветку: main
echo.

echo 🔧 ШАГ 3: Настройки деплоя
echo Name: invest2026
echo Environment: Node
echo Build Command: npm install ^&^& npm run build
echo Start Command: npm start
echo.

echo 🔧 ШАГ 4: Переменные окружения
echo Добавьте следующие переменные:
echo.
echo DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
echo NEXTAUTH_URL=https://invest2026.onrender.com
echo JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
echo NODE_ENV=production
echo.

echo 🔧 ШАГ 5: Деплой
echo - Нажмите "Create Web Service"
echo - Дождитесь завершения деплоя (5-10 минут)
echo - Сайт будет доступен по адресу: https://invest2026.onrender.com
echo.

echo ========================================
echo 📋 ГОТОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ КОПИРОВАНИЯ
echo ========================================
echo.

echo DATABASE_URL
echo postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo.

echo NEXTAUTH_SECRET  
echo your-secret-key-here-change-this-in-production-2026
echo.

echo NEXTAUTH_URL
echo https://invest2026.onrender.com
echo.

echo JWT_SECRET
echo your-jwt-secret-key-here-change-this-in-production-2026
echo.

echo NODE_ENV
echo production
echo.

echo ========================================
echo 🎯 ПОСЛЕ ДЕПЛОЯ
echo ========================================
echo.

echo ✅ Сайт будет доступен по адресу:
echo https://invest2026.onrender.com
echo.

echo ✅ Админка будет доступна по адресу:
echo https://invest2026.onrender.com/admin/dashboard
echo.

echo 🔑 Данные для входа в админку:
echo Логин: admin
echo Пароль: X11021997x
echo.

echo ⚠️  ВАЖНО: Render засыпает через 15 минут неактивности
echo Первый запуск после сна может занять 30-60 секунд
echo.

echo 📞 Если возникли проблемы:
echo 1. Проверьте логи деплоя в Render Dashboard
echo 2. Убедитесь что все переменные окружения добавлены
echo 3. Проверьте подключение к базе данных Neon
echo.

pause