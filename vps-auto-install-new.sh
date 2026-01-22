#!/bin/bash

# Автоматическая установка проекта на VPS 213.171.31.215
# Выполните этот скрипт в консоли VPS

echo "========================================="
echo "🚀 АВТОМАТИЧЕСКАЯ УСТАНОВКА INVESTPRO"
echo "========================================="
echo ""

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Запустите скрипт от имени root"
    exit 1
fi

echo "✅ Запуск от имени root"

# 1. Обновление системы
echo ""
echo "[1/10] Обновление системы..."
apt update && apt upgrade -y

# 2. Установка Node.js 20
echo ""
echo "[2/10] Установка Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# 3. Установка зависимостей
echo ""
echo "[3/10] Установка PM2, Nginx, Git..."
npm install -g pm2
apt-get install -y nginx git

# 4. Клонирование проекта
echo ""
echo "[4/10] Клонирование проекта..."
cd /root
rm -rf invest2026
git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026

# 5. Установка зависимостей проекта
echo ""
echo "[5/10] Установка зависимостей проекта..."
npm install

# 6. Создание конфигурации
echo ""
echo "[6/10] Создание .env.production..."
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://213.171.31.215
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
NODE_ENV=production
EOF

# 7. Сборка проекта
echo ""
echo "[7/10] Сборка проекта..."
npm run build

# 8. Настройка Nginx
echo ""
echo "[8/10] Настройка Nginx..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name 213.171.31.215;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 9. Запуск сервисов
echo ""
echo "[9/10] Запуск Nginx..."
systemctl restart nginx
systemctl enable nginx

# 10. Запуск приложения
echo ""
echo "[10/10] Запуск приложения..."
pm2 delete all 2>/dev/null || true
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start
pm2 startup
pm2 save

echo ""
echo "========================================="
echo "✅ УСТАНОВКА ЗАВЕРШЕНА!"
echo "========================================="
echo ""
echo "🌐 Сайт доступен: http://213.171.31.215"
echo "🔧 Админка: http://213.171.31.215/admin/dashboard"
echo ""
echo "Данные для входа в админку:"
echo "Логин: admin"
echo "Пароль: X11021997x"
echo ""
echo "Проверка статуса:"
echo "pm2 status"
echo "systemctl status nginx"
echo ""