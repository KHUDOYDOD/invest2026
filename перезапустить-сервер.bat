@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo    🔄 ПЕРЕЗАПУСК СЕРВЕРА
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1. Останавливаем Node.js процессы...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo 2. Удаляем кэш Next.js...
if exist .next rmdir /s /q .next
timeout /t 1 >nul

echo 3. Запускаем сервер...
start "Next.js Server" cmd /k npm run dev

echo.
echo ✅ Сервер перезапущен!
echo.
echo 📝 Теперь:
echo    1. Откройте браузер в режиме ИНКОГНИТО (Ctrl+Shift+N)
echo    2. Перейдите на: http://localhost:3000/dashboard/requests
echo    3. Войдите в систему
echo.
echo ═══════════════════════════════════════════════════════════════
pause
