@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   КОПИРОВАНИЕ ПЕРЕМЕННЫХ ДЛЯ CLOUDFLARE PAGES
echo ═══════════════════════════════════════════════════════════
echo.

type .env.cloudflare | clip

echo ✅ Переменные окружения скопированы в буфер обмена!
echo.
echo Теперь в Cloudflare Dashboard:
echo.
echo 1. Откройте Pages → invest2026 → Settings
echo 2. Перейдите в Environment Variables
echo 3. Добавьте каждую переменную вручную:
echo.
echo    DATABASE_URL = (вставьте значение)
echo    POSTGRES_URL = (вставьте значение)
echo    POSTGRES_URL_NON_POOLING = (вставьте значение)
echo    JWT_SECRET = (вставьте значение)
echo    NEXTAUTH_SECRET = (вставьте значение)
echo    NEXTAUTH_URL = https://invest2026.pages.dev
echo    NODE_ENV = production
echo.
echo 4. Нажмите Save
echo.
echo Cloudflare автоматически пересоберёт проект
echo.
pause
