@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА CLOUDFLARE PAGES
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📦 Проект: invest2026
echo 🌐 GitHub: https://github.com/KHUDOYDOD/invest2026
echo 🗄️ База данных: Neon PostgreSQL
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

echo ШАГ 1/4: Проверка Git репозитория...
echo.
if not exist ".git" (
    echo ❌ Git репозиторий не найден!
    echo.
    pause
    exit /b 1
)
echo ✅ Git репозиторий найден
echo.

echo ШАГ 2/4: Коммит и push изменений в GitHub...
echo.
git add .
git commit -m "Update for Cloudflare Pages deployment"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Не удалось выполнить push (возможно, нет изменений)
    echo.
) else (
    echo.
    echo ✅ Изменения отправлены в GitHub
    echo.
)

echo ШАГ 3/4: Открытие Cloudflare Pages Dashboard...
echo.
timeout /t 2 /nobreak >nul
start https://dash.cloudflare.com/

echo ✅ Dashboard открыт в браузере
echo.

echo ШАГ 4/4: Инструкции для завершения деплоя...
echo.
echo ═══════════════════════════════════════════════════════════════
echo   📋 НАСТРОЙКА В CLOUDFLARE DASHBOARD
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1️⃣ Перейдите в Workers ^& Pages → Create application → Pages
echo.
echo 2️⃣ Выберите Connect to Git → invest2026
echo.
echo 3️⃣ Настройки сборки:
echo    • Framework preset: Next.js
echo    • Build command: npm install ^&^& npm run build
echo    • Build output directory: .next
echo    • Node version: 18
echo.
echo 4️⃣ Добавьте переменные окружения (Environment Variables):
echo.
echo    DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo.
echo    POSTGRES_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo.
echo    JWT_SECRET=invest2026-super-secret-jwt-key-change-this-production-12345
echo.
echo    NEXTAUTH_SECRET=invest2026-super-secret-nextauth-key-change-production-67890
echo.
echo    NEXTAUTH_URL=https://invest2026.pages.dev
echo.
echo    NODE_ENV=production
echo.
echo 5️⃣ Нажмите Save and Deploy
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 💡 Полная инструкция: CLOUDFLARE_PAGES_ДЕПЛОЙ.md
echo.
echo 🔧 Дополнительные команды:
echo    • скопировать-переменные-cloudflare-pages.bat - копировать env переменные
echo    • выполнить-sql-в-neon.bat - настроить базу данных
echo    • открыть-neon.bat - открыть Neon Dashboard
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
