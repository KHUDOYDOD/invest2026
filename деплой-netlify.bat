@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 АВТОДЕПЛОЙ НА NETLIFY
echo ========================================
echo.

echo [INFO] Открываю Netlify для деплоя...
start https://app.netlify.com/start

echo.
echo 📋 ИНСТРУКЦИЯ:
echo.
echo 1. Войдите в Netlify через GitHub
echo 2. Выберите репозиторий: KHUDOYDOD/invest2026
echo 3. В настройках Build добавьте:
echo    Build command: npm run build
echo    Publish directory: .next
echo.
echo 4. В Environment variables добавьте:
echo    DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo    NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
echo    JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
echo.
echo 5. Нажмите Deploy site
echo.
echo ✅ Получите ссылку вида: https://amazing-name-123456.netlify.app
echo.
echo 🔑 Данные для входа в админку:
echo Логин: admin
echo Пароль: X11021997x
echo.
pause