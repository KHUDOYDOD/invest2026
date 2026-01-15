#!/bin/bash

# ============================================
# АВТОМАТИЧЕСКАЯ УСТАНОВКА INVESTPRO НА VPS
# ============================================

set -e  # Остановка при ошибке

echo "🚀 Начинаем автоматическую установку..."
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Конфигурация
VPS_IP="130.49.213.197"
GITHUB_REPO="https://github.com/KHUDOYDOD/invest2026.git"
DATABASE_URL="postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
PROJECT_DIR="/root/invest2026"
APP_NAME="investpro"

echo -e "${BLUE}📋 Конфигурация:${NC}"
echo "  IP: $VPS_IP"
echo "  Репозиторий: $GITHUB_REPO"
echo "  Директория: $PROJECT_DIR"
echo ""

# ============================================
# ШАГ 1: Обновление системы
# ============================================
echo -e "${GREEN}[1/10] Обновление системы...${NC}"
apt update && apt upgrade -y

# ============================================
# ШАГ 2: Установка Node.js 20.x
# ============================================
echo -e "${GREEN}[2/10] Установка Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "Node.js версия: $(node --version)"
echo "NPM версия: $(npm --version)"

# ============================================
# ШАГ 3: Установка PM2
# ============================================
echo -e "${GREEN}[3/10] Установка PM2...${NC}"
npm install -g pm2

# ============================================
# ШАГ 4: Установка Nginx
# ============================================
echo -e "${GREEN}[4/10] Установка Nginx...${NC}"
apt install -y nginx

# ============================================
# ШАГ 5: Установка Git
# ============================================
echo -e "${GREEN}[5/10] Установка Git...${NC}"
apt install -y git

# ============================================
# ШАГ 6: Клонирование проекта
# ============================================
echo -e "${GREEN}[6/10] Клонирование проекта...${NC}"

# Удаляем старую директорию если есть
if [ -d "$PROJECT_DIR" ]; then
    echo "Удаляем старую версию..."
    rm -rf "$PROJECT_DIR"
fi

cd /root
git clone "$GITHUB_REPO"
cd "$PROJECT_DIR"

# ============================================
# ШАГ 7: Создание .env файла
# ============================================
echo -e "${GREEN}[7/10] Создание .env файла...${NC}"

# Генерация случайного NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

cat > .env.production << EOF
# Database
DATABASE_URL=$DATABASE_URL

# NextAuth
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://$VPS_IP

# Environment
NODE_ENV=production
EOF

echo "✅ .env.production создан"

# ============================================
# ШАГ 8: Установка зависимостей и сборка
# ============================================
echo -e "${GREEN}[8/10] Установка зависимостей...${NC}"
npm install

echo -e "${GREEN}[8/10] Сборка проекта...${NC}"
npm run build

# ============================================
# ШАГ 9: Настройка PM2
# ============================================
echo -e "${GREEN}[9/10] Настройка PM2...${NC}"

# Останавливаем если уже запущен
pm2 delete "$APP_NAME" 2>/dev/null || true

# Запускаем приложение
pm2 start npm --name "$APP_NAME" -- start

# Автозапуск при перезагрузке
pm2 startup systemd -u root --hp /root
pm2 save

echo "✅ PM2 настроен и приложение запущено"

# ============================================
# ШАГ 10: Настройка Nginx
# ============================================
echo -e "${GREEN}[10/10] Настройка Nginx...${NC}"

cat > /etc/nginx/sites-available/investpro << 'EOF'
server {
    listen 80;
    server_name 130.49.213.197;

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

# Активируем конфигурацию
ln -sf /etc/nginx/sites-available/investpro /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
nginx -t

# Перезапускаем Nginx
systemctl restart nginx
systemctl enable nginx

echo "✅ Nginx настроен"

# ============================================
# ШАГ 11: Настройка файрвола
# ============================================
echo -e "${GREEN}[11/11] Настройка файрвола...${NC}"

apt install -y ufw

# Разрешаем необходимые порты
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Включаем файрвол
echo "y" | ufw enable

echo "✅ Файрвол настроен"

# ============================================
# ЗАВЕРШЕНИЕ
# ============================================
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Информация о приложении:${NC}"
echo ""
echo "  🌐 URL: http://$VPS_IP"
echo "  📁 Директория: $PROJECT_DIR"
echo "  🔧 PM2 процесс: $APP_NAME"
echo ""
echo -e "${BLUE}📝 Полезные команды:${NC}"
echo ""
echo "  Просмотр логов:"
echo "    pm2 logs $APP_NAME"
echo ""
echo "  Перезапуск приложения:"
echo "    pm2 restart $APP_NAME"
echo ""
echo "  Статус приложения:"
echo "    pm2 status"
echo ""
echo "  Обновление из GitHub:"
echo "    cd $PROJECT_DIR && git pull && npm install && npm run build && pm2 restart $APP_NAME"
echo ""
echo -e "${GREEN}🎉 Откройте в браузере: http://$VPS_IP${NC}"
echo ""

# Показываем статус
pm2 status
