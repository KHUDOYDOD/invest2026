#!/bin/bash

echo "=== АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА VPS ==="
echo "IP: 45.155.205.43"
echo "Логин: root11"
echo ""

# 1. Обновление системы
echo "[1/12] Обновление системы..."
apt update && apt upgrade -y

# 2. Установка Node.js 20
echo "[2/12] Установка Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# 3. Установка PM2 и других зависимостей
echo "[3/12] Установка PM2 и зависимостей..."
npm install -g pm2
apt-get install -y nginx git

# 4. Клонирование проекта
echo "[4/12] Клонирование проекта..."
cd /root
rm -rf invest2026
git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026

# 5. Установка зависимостей проекта
echo "[5/12] Установка зависимостей проекта..."
npm install --production

# 6. Создание .env.production
echo "[6/12] Создание .env.production..."
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
EOF

# 7. Сборка проекта
echo "[7/12] Сборка проекта..."
npm run build

# 8. Настройка Nginx
echo "[8/12] Настройка Nginx..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name 45.155.205.43;

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

# 9. Перезапуск Nginx
echo "[9/12] Перезапуск Nginx..."
systemctl restart nginx
systemctl enable nginx

# 10. Остановка старых процессов PM2
echo "[10/12] Остановка старых процессов..."
pm2 delete all 2>/dev/null || true

# 11. Запуск приложения
echo "[11/12] Запуск приложения..."
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start

# 12. Автозапуск и проверка
echo "[12/12] Настройка автозапуска..."
pm2 startup
pm2 save

echo ""
echo "=== ПРОВЕРКА СТАТУСА ==="
pm2 status
systemctl status nginx --no-pager -l

echo ""
echo "🎉 ДЕПЛОЙ ЗАВЕРШЕН!"
echo "🌐 Сайт: http://45.155.205.43"
echo "👤 Админ: http://45.155.205.43/admin/dashboard"
echo "📋 Логин: admin | Пароль: X11021997x"
echo ""