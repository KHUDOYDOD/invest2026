@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ДЕПЛОЙ НА НОВЫЙ VPS 213.171.31.215
echo ========================================
echo.

set SERVER_IP=213.171.31.215
set USERNAME=root11
set PASSWORD=$X11021997x$

echo [INFO] Проверка доступности сервера...
ping -n 2 %SERVER_IP% >nul
if errorlevel 1 (
    echo ❌ Сервер %SERVER_IP% недоступен!
    echo Ожидание доступности сервера...
    timeout /t 10 /nobreak >nul
    ping -n 2 %SERVER_IP% >nul
    if errorlevel 1 (
        echo ❌ Сервер все еще недоступен!
        echo Проверьте статус сервера у провайдера
        pause
        exit /b 1
    )
)

echo ✅ Сервер доступен!
echo.

echo [INFO] Попытка SSH подключения...
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "echo 'SSH работает!'" 2>nul
if errorlevel 1 (
    echo ❌ SSH недоступен. Используйте веб-консоль для установки.
    echo.
    echo 📋 КОМАНДЫ ДЛЯ ВЕБ-КОНСОЛИ:
    echo.
    echo 1. Обновление системы:
    echo apt update ^&^& apt upgrade -y
    echo.
    echo 2. Установка Node.js:
    echo curl -fsSL https://deb.nodesource.com/setup_20.x ^| sudo -E bash -
    echo apt-get install -y nodejs
    echo.
    echo 3. Установка зависимостей:
    echo npm install -g pm2
    echo apt-get install -y nginx git
    echo.
    echo 4. Клонирование проекта:
    echo cd /root
    echo git clone https://github.com/KHUDOYDOD/invest2026.git
    echo cd invest2026
    echo npm install
    echo.
    echo 5. Создание .env.production:
    echo cat ^> .env.production ^<^< 'EOF'
    echo DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
    echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
    echo NEXTAUTH_URL=http://%SERVER_IP%
    echo JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
    echo NODE_ENV=production
    echo EOF
    echo.
    echo 6. Сборка и запуск:
    echo npm run build
    echo pm2 start npm --name investpro -- start
    echo.
    pause
    exit /b 1
)

echo ✅ SSH подключение работает!
echo.

echo [1/12] Обновление системы...
ssh -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "apt update && apt upgrade -y"

echo [2/12] Установка Node.js...
ssh %USERNAME%@%SERVER_IP% "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && apt-get install -y nodejs"

echo [3/12] Установка PM2 и зависимостей...
ssh %USERNAME%@%SERVER_IP% "npm install -g pm2 && apt-get install -y nginx git"

echo [4/12] Клонирование проекта...
ssh %USERNAME%@%SERVER_IP% "cd /root && rm -rf invest2026 && git clone https://github.com/KHUDOYDOD/invest2026.git"

echo [5/12] Установка зависимостей проекта...
ssh %USERNAME%@%SERVER_IP% "cd /root/invest2026 && npm install"

echo [6/12] Создание .env.production...
ssh %USERNAME%@%SERVER_IP% "cd /root/invest2026 && cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://%SERVER_IP%
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
NODE_ENV=production
EOF"

echo [7/12] Сборка проекта...
ssh %USERNAME%@%SERVER_IP% "cd /root/invest2026 && npm run build"

echo [8/12] Настройка Nginx...
ssh %USERNAME%@%SERVER_IP% "cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name %SERVER_IP%;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF"

echo [9/12] Перезапуск Nginx...
ssh %USERNAME%@%SERVER_IP% "systemctl restart nginx && systemctl enable nginx"

echo [10/12] Остановка старых процессов...
ssh %USERNAME%@%SERVER_IP% "pm2 delete all 2>/dev/null || true"

echo [11/12] Запуск приложения...
ssh %USERNAME%@%SERVER_IP% "cd /root/invest2026 && NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start"

echo [12/12] Настройка автозапуска...
ssh %USERNAME%@%SERVER_IP% "pm2 startup && pm2 save"

echo.
echo ========================================
echo ✅ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
echo ========================================
echo.
echo 🌐 Сайт: http://%SERVER_IP%
echo 🔧 Админка: http://%SERVER_IP%/admin/dashboard
echo.
echo 📋 Данные для входа в админку:
echo Логин: admin
echo Пароль: X11021997x
echo.

echo 🌐 Открываю сайт...
start http://%SERVER_IP%
timeout /t 2 /nobreak >nul
start http://%SERVER_IP%/admin/dashboard

echo.
echo 🔧 Проверка статуса...
ssh %USERNAME%@%SERVER_IP% "pm2 status && systemctl status nginx --no-pager"

echo.
pause