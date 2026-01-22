#!/bin/bash

# 🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ NEXT.JS НА VPS
# Использование: bash БЫСТРЫЙ_ДЕПЛОЙ_СКРИПТ.sh

echo "=========================================="
echo "🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ NEXT.JS НА VPS"
echo "=========================================="

# Переменные (измените под свой проект)
REPO_URL="https://github.com/KHUDOYDOD/invest2026.git"
PROJECT_NAME="invest2026"
APP_NAME="investpro"
DOMAIN_OR_IP="130.49.213.197"

echo "📦 Обновление системы..."
apt update && apt upgrade -y

echo "📦 Установка Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

echo "📦 Установка PM2..."
npm install -g pm2

echo "📦 Установка Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

echo "📦 Установка Git..."
apt install git -y

echo "📁 Клонирование проекта..."
cd /root
if [ -d "$PROJECT_NAME" ]; then
    echo "Проект уже существует, обновляем..."
    cd $PROJECT_NAME
    git pull origin main
else
    git clone $REPO_URL
    cd $PROJECT_NAME
fi

echo "📦 Установка зависимостей..."
npm install

echo "🔧 Создание .env.production..."
cat > .env.production << EOF
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://$DOMAIN_OR_IP
NODE_ENV=production
EOF

echo "🏗️ Сборка проекта..."
npm run build

echo "🔄 Остановка старого PM2 процесса..."
pm2 delete $APP_NAME 2>/dev/null || true

echo "🚀 Запуск нового PM2 процесса..."
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name $APP_NAME --max-memory-restart 800M -- start

echo "💾 Сохранение PM2 конфигурации..."
pm2 save
pm2 startup

echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN_OR_IP;

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

# Удаляем старую ссылку если есть
rm -f /etc/nginx/sites-enabled/$APP_NAME

# Создаем новую ссылку
ln -s /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/

# Удаляем дефолтный сайт
rm -f /etc/nginx/sites-enabled/default

echo "🔍 Проверка конфигурации Nginx..."
nginx -t

echo "🔄 Перезапуск Nginx..."
systemctl reload nginx

echo "📝 Создание скрипта обновления..."
cat > /root/update-$APP_NAME.sh << EOF
#!/bin/bash
cd /root/$PROJECT_NAME
git pull origin main
npm install
npm run build
pm2 restart $APP_NAME
echo "Обновление завершено!"
EOF

chmod +x /root/update-$APP_NAME.sh

echo "=========================================="
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!"
echo "=========================================="
echo ""
echo "🌐 Сайт доступен по адресу: http://$DOMAIN_OR_IP"
echo ""
echo "📊 Полезные команды:"
echo "  pm2 status                    # Статус приложения"
echo "  pm2 logs $APP_NAME           # Логи приложения"
echo "  pm2 restart $APP_NAME        # Перезапуск"
echo "  /root/update-$APP_NAME.sh    # Обновление проекта"
echo ""
echo "🔧 Файлы конфигурации:"
echo "  /root/$PROJECT_NAME/.env.production"
echo "  /etc/nginx/sites-available/$APP_NAME"
echo ""

# Показываем статус
echo "📊 Текущий статус:"
pm2 status
systemctl status nginx --no-pager -l

echo ""
echo "🎉 Готово! Проверьте сайт в браузере."