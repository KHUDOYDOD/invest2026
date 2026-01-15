@echo off
chcp 65001 >nul
echo ========================================
echo ПРОВЕРКА АДМИНОВ В БАЗЕ ДАННЫХ
echo ========================================
echo.

echo Копируем скрипт на VPS...
scp check-admins-vps.js root@130.49.213.197:/root/

echo.
echo Запускаем проверку...
echo.

ssh root@130.49.213.197 "cd /root && node check-admins-vps.js"

echo.
pause
