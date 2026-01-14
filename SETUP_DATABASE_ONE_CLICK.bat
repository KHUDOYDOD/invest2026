@echo off
chcp 65001 >nul
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   АВТОМАТИЧЕСКАЯ НАСТРОЙКА БАЗЫ ДАННЫХ SUPABASE               ║
echo ║   Один клик - и всё готово!                                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Этот скрипт выполнит все необходимые действия:
echo.
echo    ✓ Откроет SQL Editor в браузере
echo    ✓ Скопирует SQL код в буфер обмена
echo    ✓ Покажет инструкции
echo.
echo ⏳ Начинаю настройку...
echo.
timeout /t 2 >nul

echo 📋 Шаг 1/3: Копирую SQL в буфер обмена...
type "EXECUTE_THIS_IN_SUPABASE.md" | clip
echo    ✅ SQL скопирован!
echo.
timeout /t 1 >nul

echo 🌐 Шаг 2/3: Открываю SQL Editor в браузере...
start https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new
echo    ✅ Браузер открыт!
echo.
timeout /t 2 >nul

echo 📝 Шаг 3/3: Инструкции для вас
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   ЧТО ДЕЛАТЬ В БРАУЗЕРЕ:                                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo    1. В открывшемся SQL Editor нажмите Ctrl+V
echo       (SQL уже скопирован в буфер обмена)
echo.
echo    2. Нажмите кнопку "Run" или Ctrl+Enter
echo.
echo    3. Дождитесь завершения (2-3 секунды)
echo.
echo    4. Вы увидите сообщение "Success" ✅
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   ПРОВЕРКА РЕЗУЛЬТАТА:                                        ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo После выполнения SQL откройте эти URL:
echo.
echo    • https://invest2025-main.vercel.app/api/statistics
echo    • https://invest2025-main.vercel.app/api/settings/site
echo    • https://invest2025-main.vercel.app/api/testimonials
echo.
echo Все должны вернуть статус 200 и данные в JSON формате!
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   ИЛИ ЗАПУСТИТЕ АВТОМАТИЧЕСКУЮ ПРОВЕРКУ:                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo    node check-api-endpoints.js
echo.
echo.
echo 💡 Если нужна помощь, откройте файл:
echo    SETUP_COMPLETE_FINAL.md
echo.
echo.
pause
