@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   КОПИРОВАНИЕ ЧИСТОГО SQL В БУФЕР ОБМЕНА                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Копирую только SQL код (без markdown)...
echo.

type "supabase-setup.sql" | clip

echo ✅ Чистый SQL код скопирован в буфер обмена!
echo.
echo 📝 Теперь:
echo    1. Перейдите в SQL Editor
echo    2. Нажмите Ctrl+V для вставки
echo    3. Нажмите "Run" или Ctrl+Enter
echo.
echo 🔗 SQL Editor:
echo    https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new
echo.
pause
