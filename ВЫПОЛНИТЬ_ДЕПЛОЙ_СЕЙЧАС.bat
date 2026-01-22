@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА НОВЫЙ VPS
echo ========================================
echo.
echo VPS: 45.155.205.43
echo Логин: root11
echo.

echo [INFO] Попытка подключения к VPS...
echo.

REM Создаем временный скрипт для выполнения на VPS
echo #!/bin/bash > temp_deploy.sh
echo echo "=== АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА VPS ===" >> temp_deploy.sh
echo apt update ^&^& apt upgrade -y >> temp_deploy.sh
echo curl -fsSL https://deb.nodesource.com/setup_20.x ^| sudo -E bash - >> temp_deploy.sh
echo apt-get install -y nodejs >> temp_deploy.sh
echo npm install -g pm2 >> temp_deploy.sh
echo apt-get install -y nginx git >> temp_deploy.sh
echo cd /root >> temp_deploy.sh
echo rm -rf invest2026 >> temp_deploy.sh
echo git clone https://github.com/KHUDOYDOD/invest2026.git >> temp_deploy.sh
echo cd invest2026 >> temp_deploy.sh
echo npm install --production >> temp_deploy.sh
echo cat ^> .env.production ^<^< 'EOF' >> temp_deploy.sh
echo DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require >> temp_deploy.sh
echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026 >> temp_deploy.sh
echo NEXTAUTH_URL=http://45.155.205.43 >> temp_deploy.sh
echo JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026 >> temp_deploy.sh
echo EOF >> temp_deploy.sh
echo npm run build >> temp_deploy.sh
echo systemctl restart nginx >> temp_deploy.sh
echo systemctl enable nginx >> temp_deploy.sh
echo pm2 delete all 2^>/dev/null ^|^| true >> temp_deploy.sh
echo NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start >> temp_deploy.sh
echo pm2 startup >> temp_deploy.sh
echo pm2 save >> temp_deploy.sh
echo pm2 status >> temp_deploy.sh
echo echo "🎉 ДЕПЛОЙ ЗАВЕРШЕН!" >> temp_deploy.sh
echo echo "🌐 Сайт: http://45.155.205.43" >> temp_deploy.sh

echo [INFO] Попытка выполнения деплоя...
ssh -o ConnectTimeout=30 -o StrictHostKeyChecking=no root11@45.155.205.43 < temp_deploy.sh

if errorlevel 1 (
    echo.
    echo ❌ SSH подключение не удалось!
    echo.
    echo 📋 АЛЬТЕРНАТИВНЫЕ СПОСОБЫ:
    echo.
    echo 1. Подключитесь к VPS через веб-консоль
    echo 2. Скопируйте команды из файла: КОМАНДЫ_ДЛЯ_VPS.txt
    echo 3. Выполните их по порядку
    echo.
    echo 🔧 Или настройте SSH ключ:
    echo 1. Запустите: создать-ключ-новый-vps.bat
    echo 2. Добавьте ключ на VPS
    echo 3. Повторите деплой
) else (
    echo.
    echo ✅ ДЕПЛОЙ УСПЕШНО ЗАВЕРШЕН!
    echo.
    echo 🌐 Открываю сайт...
    start http://45.155.205.43
    timeout /t 2 /nobreak >nul
    start http://45.155.205.43/admin/dashboard
    echo.
    echo 📋 Данные для входа в админку:
    echo Логин: admin
    echo Пароль: X11021997x
)

del temp_deploy.sh 2>nul
echo.
pause