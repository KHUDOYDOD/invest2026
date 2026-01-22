@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ДЕПЛОЙ НА VERCEL - 2 МИНУТЫ
echo ========================================
echo.

echo [1/3] Открываю Vercel...
start https://vercel.com/new

echo.
echo 📋 ДЕЛАЙТЕ ПО ПОРЯДКУ:
echo.
echo 1. Нажмите "Continue with GitHub"
echo 2. Войдите в GitHub аккаунт
echo 3. В поиске введите: KHUDOYDOD/invest2026
echo 4. Нажмите "Import" рядом с репозиторием
echo.
echo 5. В разделе "Environment Variables" добавьте:
echo.
echo    DATABASE_URL
echo    postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo.
echo    NEXTAUTH_SECRET
echo    your-secret-key-here-change-this-in-production-2026
echo.
echo    JWT_SECRET  
echo    your-jwt-secret-key-here-change-this-in-production-2026
echo.
echo 6. Нажмите "Deploy"
echo 7. Ждите 2-3 минуты
echo.
echo ✅ ПОЛУЧИТЕ ССЫЛКУ: https://invest2026-xxx.vercel.app
echo.
echo 🔑 Данные для входа:
echo Логин: admin
echo Пароль: X11021997x
echo.
echo 📱 Админ панель: https://ваш-домен.vercel.app/admin/dashboard
echo.
pause