@echo off
chcp 65001 >nul
echo ========================================
echo 📊 МОНИТОРИНГ УСТАНОВКИ ПРОЕКТА
echo ========================================
echo.

set SERVER=213.171.31.215

:check_loop
echo [%TIME%] Проверка статуса сервера...

echo 🔍 Проверка портов...
powershell -Command "Test-NetConnection -ComputerName %SERVER% -Port 80 -WarningAction SilentlyContinue | Select-Object RemotePort, TcpTestSucceeded"
powershell -Command "Test-NetConnection -ComputerName %SERVER% -Port 3000 -WarningAction SilentlyContinue | Select-Object RemotePort, TcpTestSucceeded"

echo.
echo 🌐 Проверка веб-сайта...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://%SERVER%' -TimeoutSec 5; if ($r.Content -like '*nginx*') { Write-Host 'Nginx работает' } elseif ($r.Content -like '*invest*' -or $r.Content -like '*dashboard*') { Write-Host 'Проект установлен!' } else { Write-Host 'Неизвестная страница' } } catch { Write-Host 'Сайт недоступен' }"

echo.
echo 📋 Статус: Ожидание установки проекта...
echo 💡 Выполните команды из файла: УСТАНОВКА_ПРОЕКТА_СЕЙЧАС.txt
echo.

timeout /t 30 /nobreak >nul
goto check_loop