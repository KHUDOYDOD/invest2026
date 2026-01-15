@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   АВТОМАТИЧЕСКАЯ УСТАНОВКА АДМИНА
echo ========================================
echo.
echo Что будет сделано:
echo   1. Создание страницы /admin
echo   2. Создание админ пользователя
echo.
echo Данные админа:
echo   Username: Admin
echo   Password: X11021997x
echo   Email:    X45395x@gmail.com
echo.
echo Вам нужно ввести пароль VPS: 12345678
echo (4 раза - это нормально)
echo.
pause

echo.
echo ========================================
echo ШАГ 1: СОЗДАНИЕ АДМИН СТРАНИЦЫ
echo ========================================
echo.

echo Копируем скрипт...
scp create-admin-page-on-vps.js root@130.49.213.197:/root/

echo.
echo Создаём файл page.tsx...
ssh root@130.49.213.197 "node /root/create-admin-page-on-vps.js"

echo.
echo Перезапускаем PM2...
ssh root@130.49.213.197 "pm2 restart investpro"

echo.
echo ========================================
echo ШАГ 2: СОЗДАНИЕ АДМИН ПОЛЬЗОВАТЕЛЯ
echo ========================================
echo.

echo Копируем скрипт...
scp admin-script-for-vps.js root@130.49.213.197:/root/create-admin.js

echo.
echo Создаём админа в базе данных...
ssh root@130.49.213.197 "cd /root && node create-admin.js"

echo.
echo ========================================
echo ВСЁ ГОТОВО!
echo ========================================
echo.
echo Админ панель: http://130.49.213.197/admin
echo.
echo Данные для входа:
echo   Username: Admin
echo   Password: X11021997x
echo.
echo ========================================
echo.
pause
