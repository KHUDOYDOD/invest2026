@echo off
chcp 65001 >nul
echo ========================================
echo   ДИАГНОСТИКА ДОСТУПА К САЙТУ
echo ========================================
echo.

echo 1. Проверка доступности порта 80...
powershell -Command "Test-NetConnection -ComputerName 213.171.31.215 -Port 80 | Select-Object ComputerName, RemotePort, TcpTestSucceeded"
echo.

echo 2. Проверка HTTP ответа...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://213.171.31.215' -UseBasicParsing -TimeoutSec 5; Write-Host 'Статус:' $r.StatusCode; Write-Host 'Размер:' $r.Content.Length 'байт' } catch { Write-Host 'Ошибка:' $_.Exception.Message }"
echo.

echo 3. Проверка DNS...
nslookup tradepo.ru
echo.

echo 4. Проверка маршрута...
tracert -h 5 -w 1000 213.171.31.215
echo.

echo 5. Ping сервера...
ping -n 4 213.171.31.215
echo.

echo ========================================
echo   РЕЗУЛЬТАТЫ ДИАГНОСТИКИ
echo ========================================
echo.
echo Если порт 80 доступен и HTTP ответ 200:
echo   - Сервер работает нормально
echo   - Проблема в браузере или кэше
echo.
echo Если порт недоступен:
echo   - Проблема с сетью или файрволом
echo   - Проверьте VPN/прокси
echo.
pause