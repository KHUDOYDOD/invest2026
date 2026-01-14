@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   ОТКРЫТИЕ CLOUDFLARE PAGES
echo ═══════════════════════════════════════════════════════════
echo.
echo Открываю Cloudflare Pages...
echo.

start https://dash.cloudflare.com/sign-up/pages

echo.
echo ✅ Cloudflare Pages открыт в браузере
echo.
echo Что делать:
echo 1. Создайте аккаунт (если нет)
echo 2. Нажмите "Create a project"
echo 3. Подключите GitHub
echo 4. Выберите репозиторий: KHUDOYDOD/invest2026
echo 5. Настройте сборку (см. ДЕПЛОЙ_CLOUDFLARE.md)
echo.
pause
