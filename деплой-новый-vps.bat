@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ДЕПЛОЙ НА НОВЫЙ VPS
echo ========================================
echo.
echo VPS: 45.155.205.43
echo Логин: root11
echo Пароль: $X11021997x$
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

echo [1/6] Сборка проекта локально...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Ошибка при сборке!
    pause
    exit /b 1
)

echo.
echo [2/6] Создание архива проекта...
tar -czf project.tar.gz --exclude=node_modules --exclude=.git --exclude=.next/cache .next package.json package-lock.json next.config.mjs app components lib hooks contexts styles public tailwind.config.ts tsconfig.json postcss.config.mjs components.json

echo.
echo [3/6] Подключение к VPS и установка зависимостей...
echo Введите пароль: $X11021997x$
ssh root11@45.155.205.43 "
    echo '=== Установка Node.js и зависимостей ==='
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
    npm install -g pm2
    
    echo '=== Установка Nginx ==='
    apt-get update
    apt-get install -y nginx
    
    echo '=== Создание директории проекта ==='
    mkdir -p /root/invest2026
    cd /root/invest2026
    
    echo '=== Готово к загрузке файлов ==='
"

echo.
echo [4/6] Копирование файлов на VPS...
echo Введите пароль: $X11021997x$
scp project.tar.gz root11@45.155.205.43:/root/invest2026/

echo.
echo [5/6] Распаковка и настройка на VPS...
echo Введите пароль: $X11021997x$
ssh root11@45.155.205.43 "
    cd /root/invest2026
    tar -xzf project.tar.gz
    rm project.tar.gz
    
    echo '=== Установка зависимостей проекта ==='
    npm install --production
    
    echo '=== Создание .env.production ==='
    cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production
EOF
    
    echo '=== Настройка Nginx ==='
    cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name 45.155.205.43;

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
EOF
    
    systemctl restart nginx
    systemctl enable nginx
    
    echo '=== Запуск приложения через PM2 ==='
    NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start
    pm2 startup
    pm2 save
    
    echo '=== Проверка статуса ==='
    pm2 status
    systemctl status nginx --no-pager
"

echo.
echo [6/6] Очистка временных файлов...
del project.tar.gz

echo.
echo ========================================
echo ✅ ДЕПЛОЙ ЗАВЕРШЕН!
echo ========================================
echo.
echo 🌐 Сайт доступен по адресу: http://45.155.205.43
echo 👤 Админ панель: http://45.155.205.43/admin/dashboard
echo.
echo 📋 Данные для входа в админку:
echo Логин: admin
echo Пароль: X11021997x
echo.
echo 🔧 Управление сервером:
echo pm2 status - статус приложения
echo pm2 logs investpro - логи приложения
echo pm2 restart investpro - перезапуск
echo.
pause