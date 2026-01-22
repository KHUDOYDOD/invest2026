@echo off
chcp 65001 >nul
echo ========================================
echo 📋 ПЕРЕМЕННЫЕ ДЛЯ CLOUDFLARE PAGES
echo ========================================
echo.

echo Скопируйте эти переменные в Cloudflare Pages:
echo.

echo DATABASE_URL
echo postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require | clip
echo ✅ DATABASE_URL скопирован в буфер обмена
echo.

timeout /t 2 /nobreak >nul

echo NEXTAUTH_SECRET
echo your-secret-key-here-change-this-in-production-2026 | clip
echo ✅ NEXTAUTH_SECRET скопирован в буфер обмена
echo.

timeout /t 2 /nobreak >nul

echo JWT_SECRET
echo your-jwt-secret-key-here-change-this-in-production-2026 | clip
echo ✅ JWT_SECRET скопирован в буфер обмена
echo.

echo 📋 ВСЕ ПЕРЕМЕННЫЕ:
echo.
echo DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
echo JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
echo.

echo 🌐 Открываю Cloudflare Pages для добавления переменных...
start https://pages.cloudflare.com

echo.
pause