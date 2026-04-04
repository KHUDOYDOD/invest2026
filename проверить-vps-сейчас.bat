@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🔍 ПРОВЕРКА VPS СЕРВЕРА 213.171.31.215
echo ═══════════════════════════════════════════════════════
echo.

echo [1] Проверяем подключение к серверу...
ping -n 2 213.171.31.215 >nul
if %errorlevel%==0 (
    echo ✅ Сервер доступен
) else (
    echo ❌ Сервер недоступен
    pause
    exit /b
)

echo.
echo [2] Проверяем статус PM2...
ssh root@213.171.31.215 "pm2 status"

echo.
echo [3] Проверяем текущую версию на сервере...
ssh root@213.171.31.215 "cd /var/www/invest2026 && git log --oneline -1"

echo.
echo [4] Проверяем последнюю версию на GitHub...
git log --oneline -1

echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
