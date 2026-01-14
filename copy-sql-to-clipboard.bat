@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   КОПИРОВАНИЕ SQL В БУФЕР ОБМЕНА                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Копирую SQL код в буфер обмена...
echo.

type "EXECUTE_THIS_IN_SUPABASE.md" | clip

echo ✅ SQL код скопирован в буфер обмена!
echo.
echo 📝 Теперь:
echo    1. Перейдите в открытый SQL Editor
echo    2. Нажмите Ctrl+V для вставки
echo    3. Нажмите "Run" или Ctrl+Enter
echo.
echo 🔗 Если SQL Editor не открыт:
echo    https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new
echo.
pause
