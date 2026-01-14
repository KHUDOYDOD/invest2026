@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   КОПИРОВАНИЕ УПРОЩЁННОГО SQL (БЕЗ ЗАВИСИМОСТЕЙ)           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Копирую SQL без внешних ключей на users...
echo.

type "supabase-setup-simple.sql" | clip

echo ✅ Упрощённый SQL скопирован в буфер обмена!
echo.
echo 💡 Этот SQL создаст таблицы БЕЗ зависимостей от users
echo    Внешние ключи можно добавить позже, когда таблица users будет создана
echo.
echo 📝 Теперь:
echo    1. Перейдите в SQL Editor
echo    2. Очистите старый код (Ctrl+A, Delete)
echo    3. Нажмите Ctrl+V для вставки
echo    4. Нажмите "Run" или Ctrl+Enter
echo.
echo 🔗 SQL Editor:
echo    https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new
echo.
pause
