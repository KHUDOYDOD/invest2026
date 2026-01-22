@echo off
chcp 65001 >nul
echo ========================================
echo 📋 КОПИРОВАНИЕ КОМАНД ДЛЯ VPS
echo ========================================
echo.

echo Команды скопированы в буфер обмена!
echo Вставьте их в веб-консоль VPS.
echo.

(
echo # Полная установка проекта на VPS 213.171.31.215
echo.
echo # 1. Обновление системы
echo apt update ^&^& apt upgrade -y
echo.
echo # 2. Установка Node.js 20
echo curl -fsSL https://deb.nodesource.com/setup_20.x ^| sudo -E bash -
echo apt-get install -y nodejs
echo.
echo # 3. Установка зависимостей
echo npm install -g pm2
echo apt-get install -y nginx git
echo.
echo # 4. Клонирование проекта
echo cd /root
echo rm -rf invest2026
echo git clone https://github.com/KHUDOYDOD/invest2026.git
echo cd invest2026
echo.
echo # 5. Установка зависимостей проекта
echo npm install
echo.
echo # 6. Создание конфигурации
echo cat ^> .env.production ^<^< 'EOF'
echo DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
echo NEXTAUTH_URL=http://213.171.31.215
echo JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
echo NODE_ENV=production
echo EOF
echo.
echo # 7. Сборка проекта
echo npm run build
echo.
echo # 8. Настройка Nginx
echo cat ^> /etc/nginx/sites-available/default ^<^< 'EOF'
echo server {
echo     listen 80;
echo     server_name 213.171.31.215;
echo     location / {
echo         proxy_pass http://localhost:3000;
echo         proxy_http_version 1.1;
echo         proxy_set_header Upgrade $http_upgrade;
echo         proxy_set_header Connection 'upgrade';
echo         proxy_set_header Host $host;
echo         proxy_set_header X-Real-IP $remote_addr;
echo         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo         proxy_set_header X-Forwarded-Proto $scheme;
echo         proxy_cache_bypass $http_upgrade;
echo     }
echo }
echo EOF
echo.
echo # 9. Запуск сервисов
echo systemctl restart nginx
echo systemctl enable nginx
echo.
echo # 10. Запуск приложения
echo NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start
echo pm2 startup
echo pm2 save
echo.
echo # Проверка работы
echo pm2 status
echo systemctl status nginx
) | clip

echo ✅ Команды скопированы в буфер обмена!
echo.
echo Теперь:
echo 1. Откройте веб-консоль VPS
echo 2. Войдите как root11 с паролем: $X11021997x$
echo 3. Вставьте команды (Ctrl+V)
echo 4. Выполните их по порядку
echo.
echo После установки сайт будет доступен:
echo 🌐 http://213.171.31.215
echo 🔧 http://213.171.31.215/admin/dashboard
echo.
pause