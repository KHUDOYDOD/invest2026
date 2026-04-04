@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🔄 ОБНОВЛЕНИЕ VPS СЕРВЕРА 213.171.31.215
echo ═══════════════════════════════════════════════════════
echo.

echo Выполняем команды на сервере...
echo.

ssh root@213.171.31.215 << 'EOF'
cd /var/www/invest2026
echo "📥 Загружаем изменения из GitHub..."
git pull origin main
echo ""
echo "📦 Устанавливаем зависимости..."
npm install
echo ""
echo "🔄 Перезапускаем PM2..."
pm2 restart invest2026
echo ""
echo "✅ Сервер обновлен!"
pm2 status
EOF

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ ОБНОВЛЕНИЕ ЗАВЕРШЕНО!
echo ═══════════════════════════════════════════════════════
echo.
echo 🌐 Откройте сайт: http://213.171.31.215
echo.
echo ⚠️  Очистите кэш браузера: Ctrl + Shift + R
echo    Или откройте в режиме инкогнито: Ctrl + Shift + N
echo.

timeout /t 3 >nul
start http://213.171.31.215

pause
