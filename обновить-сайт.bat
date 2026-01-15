@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 ОБНОВЛЕНИЕ САЙТА НА VPS
echo ========================================
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

echo [1/4] Сборка проекта...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Ошибка при сборке!
    pause
    exit /b 1
)

REM Проверяем наличие SSH ключа
set SSH_KEY=%USERPROFILE%\.ssh\id_rsa_vps
if exist "%SSH_KEY%" (
    set SSH_CMD=ssh -i "%SSH_KEY%"
    set SCP_CMD=scp -i "%SSH_KEY%"
) else (
    set SSH_CMD=ssh
    set SCP_CMD=scp
)

echo.
echo [2/4] Удаление старой .next на VPS...
%SSH_CMD% root@130.49.213.197 "rm -rf /root/invest2026/.next"

echo.
echo [3/4] Копирование новой .next на VPS...
%SCP_CMD% -r .next root@130.49.213.197:/root/invest2026/

if errorlevel 1 (
    echo.
    echo ❌ Ошибка при копировании!
    pause
    exit /b 1
)

echo.
echo [4/4] Перезапуск приложения...
%SSH_CMD% root@130.49.213.197 "cd /root/invest2026 && pm2 restart investpro"

echo.
echo Ждем 3 секунды...
timeout /t 3 /nobreak >nul

echo.
echo Проверка статуса...
%SSH_CMD% root@130.49.213.197 "pm2 status"

echo.
echo ========================================
echo ✅ ГОТОВО! Сайт обновлен
echo ========================================
echo.
echo 🌐 Откройте: http://130.49.213.197
echo.
echo Если есть проблемы, запустите: vps-logs.bat
echo.
pause
