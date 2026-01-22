@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ДЕПЛОЙ НА CLOUDFLARE PAGES
echo ========================================
echo.

echo 📋 ИНСТРУКЦИЯ:
echo.
echo 1. Идите на: https://pages.cloudflare.com
echo 2. Нажмите "Create a project"
echo 3. Выберите "Connect to Git"
echo 4. Подключите GitHub: https://github.com/KHUDOYDOD/invest2026
echo 5. Настройки сборки:
echo    - Framework preset: Next.js
echo    - Build command: npm run build
echo    - Build output directory: .next
echo.
echo 6. Environment variables (переменные окружения):
echo    DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo    NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
echo    JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
echo.
echo 7. Нажмите "Save and Deploy"
echo.
echo ✅ Через 2-3 минуты получите рабочий сайт!
echo.

echo 🌐 Открываю Cloudflare Pages...
start https://pages.cloudflare.com

echo.
echo 📋 Также открываю GitHub репозиторий...
timeout /t 2 /nobreak >nul
start https://github.com/KHUDOYDOD/invest2026

echo.
echo 💡 ПРЕИМУЩЕСТВА CLOUDFLARE PAGES:
echo - ✅ Бесплатно навсегда
echo - ✅ Автоматические обновления из GitHub
echo - ✅ Глобальная CDN сеть
echo - ✅ SSL сертификат
echo - ✅ Домен .pages.dev
echo - ✅ Никаких блокировок провайдеров
echo.
pause