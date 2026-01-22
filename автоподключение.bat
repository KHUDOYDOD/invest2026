@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 АВТОМАТИЧЕСКОЕ ПОДКЛЮЧЕНИЕ К СЕРВЕРУ
echo ========================================
echo.

set SERVER=213.171.31.215
set USER=root11
set PASS=$X11021997x$

echo [INFO] Попытка подключения к %SERVER%...

echo [1/5] Проверка SSH с нашим ключом...
ssh -i "%USERPROFILE%\.ssh\id_rsa" -o ConnectTimeout=5 -o StrictHostKeyChecking=no %USER%@%SERVER% "echo 'SSH работает с ключом'" 2>nul
if not errorlevel 1 (
    echo ✅ SSH с ключом работает!
    goto deploy
)

echo [2/5] Попытка SSH с паролем через plink...
echo y | plink -ssh -l %USER% -pw %PASS% %SERVER% "echo 'SSH работает с паролем'" 2>nul
if not errorlevel 1 (
    echo ✅ SSH с паролем работает!
    goto deploy_plink
)

echo [3/5] Попытка подключения через telnet...
echo open %SERVER% 22 | telnet 2>nul | findstr "Connected" >nul
if not errorlevel 1 (
    echo ✅ Telnet подключение возможно
)

echo [4/5] Проверка веб-портов...
powershell -Command "try { $tcp = New-Object System.Net.Sockets.TcpClient; $tcp.Connect('%SERVER%', 80); $tcp.Close(); Write-Host '✅ Порт 80 открыт' } catch { Write-Host '❌ Порт 80 закрыт' }"

echo [5/5] Создание инструкции для ручного подключения...
echo.
echo ❌ Автоматическое подключение не удалось
echo.
echo 📋 РУЧНОЕ ПОДКЛЮЧЕНИЕ:
echo 1. Откройте веб-консоль VPS провайдера
echo 2. Подключитесь к серверу %SERVER%
echo 3. Войдите как %USER% с паролем %PASS%
echo 4. Выполните команды из файла: КОМАНДЫ_НОВЫЙ_СЕРВЕР.txt
echo.
goto end

:deploy
echo.
echo 🚀 Запуск автоматического деплоя через SSH...
call деплой-новый-сервер.bat
goto end

:deploy_plink
echo.
echo 🚀 Запуск деплоя через plink...
echo Функция в разработке...
goto end

:end
pause