@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 УНИВЕРСАЛЬНЫЙ ДЕПЛОЙ НА VPS
echo ========================================
echo.

set SERVER_IP=45.155.205.43
set USERNAME=root11
set PASSWORD=$X11021997x$
set PROJECT_NAME=invest2026

echo [INFO] Проверка доступности сервера...
ping -n 2 %SERVER_IP% >nul
if errorlevel 1 (
    echo ❌ Сервер %SERVER_IP% недоступен!
    echo Проверьте:
    echo - Включен ли сервер
    echo - Правильный ли IP адрес
    echo - Работает ли интернет
    pause
    exit /b 1
)

echo ✅ Сервер доступен!
echo.

echo [INFO] Тестирование SSH подключения...
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "echo 'SSH работает!'" 2>nul
if errorlevel 1 (
    echo ❌ SSH недоступен. Попробуем добавить SSH ключ...
    echo.
    
    echo [INFO] Создание SSH ключа (если не существует)...
    if not exist "%USERPROFILE%\.ssh\id_rsa_vps_new" (
        ssh-keygen -t rsa -b 4096 -f "%USERPROFILE%\.ssh\id_rsa_vps_new" -N ""
    )
    
    echo [INFO] Получение публичного ключа...
    set /p PUBLIC_KEY=<"%USERPROFILE%\.ssh\id_rsa_vps_new.pub"
    
    echo [INFO] Добавление ключа на сервер через веб-консоль...
    echo.
    echo 📋 ИНСТРУКЦИЯ:
    echo 1. Откройте веб-консоль вашего VPS провайдера
    echo 2. Подключитесь к серверу %SERVER_IP%
    echo 3. Выполните следующие команды:
    echo.
    echo mkdir -p ~/.ssh
    echo chmod 700 ~/.ssh
    echo echo "%PUBLIC_KEY%" ^>^> ~/.ssh/authorized_keys
    echo chmod 600 ~/.ssh/authorized_keys
    echo.
    echo 4. После выполнения нажмите любую клавишу
    pause
)

echo.
echo [1/12] Обновление системы...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "apt update && apt upgrade -y"

echo [2/12] Установка Node.js 20...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && apt-get install -y nodejs"

echo [3/12] Установка PM2, Nginx, Git...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "npm install -g pm2 && apt-get install -y nginx git"

echo [4/12] Клонирование проекта...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "cd /root && rm -rf %PROJECT_NAME% && git clone https://github.com/KHUDOYDOD/%PROJECT_NAME%.git"

echo [5/12] Установка зависимостей...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "cd /root/%PROJECT_NAME% && npm install"

echo [6/12] Создание .env.production...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "cd /root/%PROJECT_NAME% && cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://%SERVER_IP%
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
NODE_ENV=production
EOF"

echo [7/12] Сборка проекта...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "cd /root/%PROJECT_NAME% && npm run build"

echo [8/12] Настройка Nginx...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "cat > /etc/nginx/sites-available/default << 'EOF'
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
        proxy_read_timeout 86400;
    }
}
EOF"

echo [9/12] Перезапуск Nginx...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "nginx -t && systemctl restart nginx && systemctl enable nginx"

echo [10/12] Остановка старых процессов...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "pm2 delete all 2>/dev/null || true"

echo [11/12] Запуск приложения...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "cd /root/%PROJECT_NAME% && NODE_OPTIONS='--max-old-space-size=1024' pm2 start npm --name %PROJECT_NAME% --max-memory-restart 1000M -- start"

echo [12/12] Настройка автозапуска...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "pm2 startup && pm2 save"

echo.
echo ========================================
echo ✅ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
echo ========================================
echo.
echo 🌐 Сайт доступен по адресу: http://%SERVER_IP%
echo 🔧 Админка: http://%SERVER_IP%/admin/dashboard
echo.
echo 📋 Данные для входа в админку:
echo Логин: admin
echo Пароль: X11021997x
echo.

echo 🔧 Проверка статуса сервисов...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" %USERNAME%@%SERVER_IP% "pm2 status && echo '---' && systemctl status nginx --no-pager -l"

echo.
echo 🌐 Открываю сайт в браузере...
timeout /t 3 /nobreak >nul
start http://%SERVER_IP%
timeout /t 2 /nobreak >nul
start http://%SERVER_IP%/admin/dashboard

echo.
pause