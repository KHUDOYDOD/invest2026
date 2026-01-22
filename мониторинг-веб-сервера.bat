@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 МОНИТОРИНГ ВЕБ-СЕРВЕРА 213.171.31.215
echo ========================================
echo.

set SERVER=213.171.31.215
set CHECK_INTERVAL=15

echo 📊 Мониторинг портов 80, 443, 3000, 8080
echo ⏱️ Проверка каждые %CHECK_INTERVAL% секунд
echo 🛑 Нажмите Ctrl+C для остановки
echo.

:check_loop
echo [%TIME%] Проверка веб-портов...

powershell -Command "Test-NetConnection -ComputerName %SERVER% -Port 80 -WarningAction SilentlyContinue | Select-Object RemotePort, TcpTestSucceeded | Format-Table -AutoSize"

if errorlevel 1 (
    echo ❌ Порт 80 закрыт
) else (
    echo ✅ Порт 80 открыт! Проверяем сайт...
    start http://%SERVER%
    goto success
)

echo Ожидание %CHECK_INTERVAL% секунд...
timeout /t %CHECK_INTERVAL% /nobreak >nul
goto check_loop

:success
echo.
echo ✅ Веб-сервер обнаружен!
echo 🌐 Сайт: http://%SERVER%
echo.
pause