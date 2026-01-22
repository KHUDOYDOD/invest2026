# 🚀 БЫСТРЫЙ ЗАПУСК ПРОЕКТА НА VPS

## 📋 Данные сервера
- **IP:** 45.155.205.43
- **Пользователь:** root11
- **Пароль:** $X11021997x$
- **Имя хоста:** invest

## ⚡ АВТОМАТИЧЕСКИЙ ЗАПУСК

### Вариант 1: Универсальный деплой
```bash
универсальный-деплой.bat
```

### Вариант 2: Деплой с SSH ключом (если ключ уже настроен)
```bash
автодеплой-с-ключом.bat
```

## 🔧 РУЧНАЯ НАСТРОЙКА (если автоматический деплой не работает)

### 1. Проверка доступности сервера
```bash
ping 45.155.205.43
```

### 2. Подключение к серверу
Если SSH недоступен, используйте веб-консоль вашего VPS провайдера.

### 3. Установка зависимостей на сервере
```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Установка PM2, Nginx, Git
npm install -g pm2
apt-get install -y nginx git
```

### 4. Клонирование и настройка проекта
```bash
# Переход в домашнюю директорию
cd /root

# Клонирование проекта
rm -rf invest2026
git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026

# Установка зависимостей
npm install

# Создание .env.production
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
NODE_ENV=production
EOF

# Сборка проекта
npm run build
```

### 5. Настройка Nginx
```bash
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
        proxy_read_timeout 86400;
    }
}
EOF

# Перезапуск Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 6. Запуск приложения
```bash
# Остановка старых процессов
pm2 delete all

# Запуск приложения
cd /root/invest2026
NODE_OPTIONS='--max-old-space-size=1024' pm2 start npm --name invest2026 --max-memory-restart 1000M -- start

# Настройка автозапуска
pm2 startup
pm2 save
```

## 🌐 ДОСТУП К САЙТУ

После успешного деплоя сайт будет доступен по адресам:
- **Главная страница:** http://45.155.205.43
- **Админ панель:** http://45.155.205.43/admin/dashboard

## 🔑 ДАННЫЕ ДЛЯ ВХОДА В АДМИНКУ
- **Логин:** admin
- **Пароль:** X11021997x

## 🔧 ПОЛЕЗНЫЕ КОМАНДЫ

### Проверка статуса
```bash
pm2 status
systemctl status nginx
```

### Просмотр логов
```bash
pm2 logs invest2026
tail -f /var/log/nginx/error.log
```

### Перезапуск сервисов
```bash
pm2 restart invest2026
systemctl restart nginx
```

### Обновление проекта
```bash
cd /root/invest2026
git pull origin main
npm install
npm run build
pm2 restart invest2026
```

## ❗ РЕШЕНИЕ ПРОБЛЕМ

### Если сервер недоступен
1. Проверьте статус сервера в панели управления VPS
2. Убедитесь, что сервер включен
3. Проверьте правильность IP адреса

### Если SSH не работает
1. Используйте веб-консоль VPS провайдера
2. Добавьте SSH ключ вручную
3. Проверьте настройки файрвола

### Если сайт не открывается
1. Проверьте статус PM2: `pm2 status`
2. Проверьте статус Nginx: `systemctl status nginx`
3. Проверьте логи: `pm2 logs` и `tail -f /var/log/nginx/error.log`

## 📞 ПОДДЕРЖКА

Если возникли проблемы, проверьте:
1. Доступность сервера (ping)
2. Статус сервисов (pm2, nginx)
3. Логи приложения и веб-сервера