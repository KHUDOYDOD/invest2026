#!/bin/bash

# Скрипт автоматической настройки Next.js на VPS
# Запустите на VPS: bash vps-setup.sh

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА NEXT.JS НА VPS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Запрос данных
read -p "Введите ваш домен (например: yoursite.com): " DOMAIN
read -p "Введите IP вашего VPS: " VPS_IP

echo ""
echo "📝 Настройки:"
echo "   Домен: $DOMAIN"
echo "   IP VPS: $VPS_IP"
echo ""
read -p "Продолжить? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Отменено"
    exit 1
fi

echo ""
echo "ШАГ 1/7: Обновление системы..."
apt update && apt upgrade -y

echo ""
echo "ШАГ 2/7: Установка Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo ""
echo "ШАГ 3/7: Установка PM2..."
npm install -g pm2

echo ""
echo "ШАГ 4/7: Установка Nginx..."
apt install -y nginx

echo ""
echo "ШАГ 5/7: Установка Certbot..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "ШАГ 6/7: Клонирование проекта..."
cd /var/www
if [ -d "invest2026" ]; then
    echo "Папка invest2026 уже существует. Удалить? (y/n)"
    read -p "> " REMOVE
    if [ "$REMOVE" = "y" ]; then
        rm -rf invest2026
    fi
fi

git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026

echo ""
echo "ШАГ 7/7: Установка зависимостей..."
npm install

echo ""
echo "Создание .env.production..."
cat > .env.production << EOF
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=invest2026-super-secret-jwt-key-change-this-production-12345
NEXTAUTH_SECRET=invest2026-super-secret-nextauth-key-change-production-67890
NEXTAUTH_URL=https://$DOMAIN
NODE_ENV=production
EOF

echo ""
echo "Сборка проекта..."
npm run build

echo ""
echo "Запуск с PM2..."
pm2 start npm --name "invest2026" -- start
pm2 startup
pm2 save

echo ""
echo "Настройка Nginx..."
cat > /etc/nginx/sites-available/invest2026 << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/invest2026 /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

echo ""
echo "Настройка Firewall..."
apt install -y ufw
ufw allow 22
ufw allow 80
ufw allow 443
echo "y" | ufw enable

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ УСТАНОВКА ЗАВЕРШЕНА!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📝 СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1. Настройте DNS (в панели управления доменом):"
echo "   Тип: A"
echo "   Имя: @"
echo "   Значение: $VPS_IP"
echo ""
echo "2. Подождите 15-30 минут пока DNS обновится"
echo ""
echo "3. Установите SSL сертификат:"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "4. Откройте сайт: https://$DOMAIN"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🔧 Полезные команды:"
echo "   pm2 logs invest2026      - просмотр логов"
echo "   pm2 restart invest2026   - перезапуск"
echo "   systemctl restart nginx  - перезапуск Nginx"
echo ""
