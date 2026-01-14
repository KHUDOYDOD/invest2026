@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo   📋 КОПИРОВАНИЕ ПЕРЕМЕННЫХ ДЛЯ CLOUDFLARE PAGES
echo ═══════════════════════════════════════════════════════════════
echo.

set "envFile=DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
set "envFile=%envFile%

POSTGRES_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
set "envFile=%envFile%

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
set "envFile=%envFile%

JWT_SECRET=invest2026-super-secret-jwt-key-change-this-production-12345"
set "envFile=%envFile%

NEXTAUTH_SECRET=invest2026-super-secret-nextauth-key-change-production-67890"
set "envFile=%envFile%

NEXTAUTH_URL=https://invest2026.pages.dev"
set "envFile=%envFile%

NODE_ENV=production"

echo %envFile% | clip

echo ✅ Переменные окружения скопированы в буфер обмена!
echo.
echo 📝 Теперь:
echo    1. Откройте Cloudflare Dashboard
echo    2. Перейдите в Workers ^& Pages → invest2026 → Settings
echo    3. Найдите раздел Environment Variables
echo    4. Добавьте каждую переменную отдельно
echo.
echo 💡 Список переменных также сохранен в файле .env.cloudflare
echo.
pause
