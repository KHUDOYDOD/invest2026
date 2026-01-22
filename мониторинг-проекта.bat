@echo off
chcp 65001 >nul
echo ========================================
echo 📊 МОНИТОРИНГ УСТАНОВКИ INVEST2026
echo ========================================
echo.

set SERVER=213.171.31.215

:check_loop
echo [%TIME%] Проверка статуса установки...
echo.

echo 🔍 Проверка портов:
powershell -Command "$p80 = Test-NetConnection -ComputerName %SERVER% -Port 80 -WarningAction SilentlyContinue; $p3000 = Test-NetConnection -ComputerName %SERVER% -Port 3000 -WarningAction SilentlyContinue; Write-Host 'Порт 80 (Nginx):' $p80.TcpTestSucceeded; Write-Host 'Порт 3000 (Node.js):' $p3000.TcpTestSucceeded"

echo.
echo 🌐 Проверка содержимого сайта:
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://%SERVER%' -TimeoutSec 10; if ($r.Content -like '*nginx*') { Write-Host '📄 Nginx стартовая страница' -ForegroundColor Yellow } elseif ($r.Content -like '*invest*' -or $r.Content -like '*dashboard*' -or $r.Content -like '*InvestPro*') { Write-Host '🎉 ПРОЕКТ УСТАНОВЛЕН!' -ForegroundColor Green; Write-Host '🌐 Сайт: http://%SERVER%' -ForegroundColor Cyan; Write-Host '🔧 Админка: http://%SERVER%/admin/dashboard' -ForegroundColor Cyan } elseif ($r.Content -like '*404*' -or $r.Content -like '*502*' -or $r.Content -like '*503*') { Write-Host '⚠️ Ошибка сервера - проверьте логи' -ForegroundColor Red } else { Write-Host '❓ Неизвестная страница' -ForegroundColor Yellow } } catch { Write-Host '❌ Сайт недоступен: ' $_.Exception.Message -ForegroundColor Red }"

echo.
echo 📋 Статус: Мониторинг продолжается...
echo 💡 Команды для установки в файле: ФИНАЛЬНАЯ_УСТАНОВКА_ПРОЕКТА.txt
echo.

timeout /t 20 /nobreak >nul
cls
goto check_loop