@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 ПРОВЕРКА СТАТУСА VPS СЕРВЕРА
echo ========================================
echo.

set SERVER_IP=45.155.205.43
set USERNAME=root11

echo [1/5] Проверка доступности сервера...
ping -n 4 %SERVER_IP%
if errorlevel 1 (
    echo ❌ Сервер недоступен!
    echo.
    echo 🔧 Возможные причины:
    echo - Сервер выключен
    echo - Проблемы с интернетом
    echo - Изменился IP адрес
    echo.
    echo 📞 Обратитесь к провайдеру VPS
    pause
    exit /b 1
) else (
    echo ✅ Сервер доступен!
)

echo.
echo [2/5] Проверка SSH подключения...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" -o ConnectTimeout=10 -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "echo 'SSH работает!'" 2>nul
if errorlevel 1 (
    echo ❌ SSH недоступен
    echo Попробуйте подключиться через веб-консоль
) else (
    echo ✅ SSH подключение работает!
)

echo.
echo [3/5] Проверка статуса PM2...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "pm2 status" 2>nul
if errorlevel 1 (
    echo ❌ PM2 не запущен или недоступен
) else (
    echo ✅ PM2 работает!
)

echo.
echo [4/5] Проверка статуса Nginx...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "systemctl is-active nginx" 2>nul
if errorlevel 1 (
    echo ❌ Nginx не запущен
) else (
    echo ✅ Nginx работает!
)

echo.
echo [5/5] Проверка доступности сайта...
curl -s -o nul -w "HTTP Status: %%{http_code}" http://%SERVER_IP% 2>nul
if errorlevel 1 (
    echo ❌ Сайт недоступен
) else (
    echo ✅ Сайт отвечает!
)

echo.
echo ========================================
echo 📊 ИТОГОВЫЙ СТАТУС
echo ========================================
echo.

echo 🌐 Попытка открыть сайт...
start http://%SERVER_IP%
timeout /t 2 /nobreak >nul
start http://%SERVER_IP%/admin/dashboard

echo.
echo 📋 Ссылки:
echo Главная: http://%SERVER_IP%
echo Админка: http://%SERVER_IP%/admin/dashboard
echo.
echo 🔑 Данные для входа:
echo Логин: admin
echo Пароль: X11021997x
echo.
pause