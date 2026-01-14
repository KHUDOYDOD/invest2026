@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     🔧 НАСТРОЙКА ТАБЛИЦЫ НАСТРОЕК САЙТА                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Этот скрипт создаст таблицу site_settings в базе данных
echo    и заполнит её начальными настройками.
echo.
echo ⚠️  Убедитесь, что PostgreSQL запущен и .env.local настроен!
echo.
pause

node scripts/setup-site-settings.js

echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ Готово! Теперь админ-панель /admin/site-management
echo    полностью привязана к базе данных PostgreSQL.
echo.
echo 🚀 Запустите сервер: npm run dev
echo 🌐 Откройте: http://localhost:3000/admin/site-management
echo.
pause
