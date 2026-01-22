@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 ДЕПЛОЙ НА VPS 45.155.205.43
echo ========================================
echo.

set SERVER_IP=45.155.205.43
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

echo [INFO] Попытка SSH подключения с ключом...
set SSH_KEY=%USERPROFILE%\.ssh\id_rsa_vps_new
if exist "%SSH_KEY%" (
    ssh -i "%SSH_KEY%" -o ConnectTimeout=10 -o StrictHostKeyChecking=no %USERNAME%@%SERVER_IP% "echo 'SSH с ключом работает!'" 2>nul
    if not errorlevel 1 (
        echo ✅ SSH с ключом работает!
        set USE_KEY=1
        goto :deploy
    )
)

echo [INFO] SSH с ключом не работает, пробуем с паролем...
echo Для подключения с паролем нужно установить sshpass или использовать другой метод
echo.
echo 📋 ИНСТРУКЦИЯ ДЛЯ РУЧНОГО ПОДКЛЮЧЕНИЯ:
echo 1. Откройте веб-консоль вашего VPS провайдера
echo 2. Подключитесь к серверу %SERVER_IP%
echo 3. Войдите как %USERNAME% с паролем %PASSWORD%
echo 4. Выполните команды установки вручную
echo.
pause
exit /b 1

:deploy

echo.
echo ✅ SSH подключение работает!
echo.
echo [1/12] Обновление системы...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "apt update && apt upgrade -y"

echo [2/12] Установка Node.js...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && apt-get install -y nodejs"

echo [3/12] Установка PM2 и зависимостей...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "npm install -g pm2 && apt-get install -y nginx git"

echo [4/12] Клонирование проекта...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "cd /root && rm -rf invest2026 && git clone https://github.com/KHUDOYDOD/invest2026.git"

echo [5/12] Установка зависимостей проекта...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "cd /root/invest2026 && npm install --production"

echo [6/12] Создание .env.production...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "cd /root/invest2026 && cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
EOF"

echo [7/12] Сборка проекта...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "cd /root/invest2026 && npm run build"

echo [8/12] Настройка Nginx...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "cat > /etc/nginx/sites-available/default << 'EOF'
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
EOF"

echo [9/12] Перезапуск Nginx...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "systemctl restart nginx && systemctl enable nginx"

echo [10/12] Остановка старых процессов...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "pm2 delete all 2>/dev/null || true"

echo [11/12] Запуск приложения...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "cd /root/invest2026 && NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start"

echo [12/12] Настройка автозапуска...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "pm2 startup && pm2 save"

echo.
echo ========================================
echo ✅ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
echo ========================================
echo.
echo 🌐 Открываю сайт...
start http://45.155.205.43
timeout /t 2 /nobreak >nul
start http://45.155.205.43/admin/dashboard

echo.
echo 📋 Данные для входа в админку:
echo Логин: admin
echo Пароль: X11021997x
echo.
echo 🔧 Проверка статуса...
ssh -i "%SSH_KEY%" root11@45.155.205.43 "pm2 status && systemctl status nginx --no-pager"

echo.
pause