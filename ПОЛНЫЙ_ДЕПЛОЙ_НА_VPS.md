# 🚀 ПОЛНЫЙ ДЕПЛОЙ NEXT.JS ПРОЕКТА НА VPS

## 📋 Что нужно:

- **VPS сервер** (Ubuntu 20.04+)
- **Домен** (опционально)
- **База данных** (PostgreSQL/MySQL)
- **SSH доступ** к серверу

---

## 🔧 ШАГ 1: Подготовка VPS

### Подключение к серверу:
```bash
ssh root@YOUR_VPS_IP
```

### Обновление системы:
```bash
apt update && apt upgrade -y
```

### Установка Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs
```

### Установка PM2:
```bash
npm install -g pm2
```

### Установка Nginx:
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### Установка Git:
```bash
apt install git -y
```

---

## 📁 ШАГ 2: Загрузка проекта

### Клонирование репозитория:
```bash
cd /root
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### Установка зависимостей:
```bash
npm install
```

### Создание .env файла:
```bash
nano .env.production
```

Добавьте переменные:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://YOUR_VPS_IP
NODE_ENV=production
```

---

## 🏗️ ШАГ 3: Сборка проекта

### Сборка Next.js:
```bash
npm run build
```

### Проверка сборки:
```bash
ls -la .next/
```

---

## 🔄 ШАГ 4: Настройка PM2

### Запуск приложения:
```bash
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name "your-app" --max-memory-restart 800M -- start
```

### Сохранение конфигурации PM2:
```bash
pm2 save
pm2 startup
```

### Проверка статуса:
```bash
pm2 status
pm2 logs your-app
```

---

## 🌐 ШАГ 5: Настройка Nginx

### Создание конфигурации:
```bash
nano /etc/nginx/sites-available/your-app
```

### Конфигурация Nginx:
```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP your-domain.com;

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
```

### Активация конфигурации:
```bash
ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔒 ШАГ 6: SSL сертификат (опционально)

### Установка Certbot:
```bash
apt install certbot python3-certbot-nginx -y
```

### Получение SSL:
```bash
certbot --nginx -d your-domain.com
```

---

## 🗄️ ШАГ 7: База данных

### Для PostgreSQL:
```bash
apt install postgresql postgresql-contrib -y
sudo -u postgres createuser --interactive
sudo -u postgres createdb your_database
```

### Для внешней БД (Neon, Supabase):
Просто добавьте CONNECTION_STRING в .env.production

---

## 🔄 ШАГ 8: Автоматический деплой

### Создание скрипта деплоя:
```bash
nano /root/deploy.sh
```

### Содержимое скрипта:
```bash
#!/bin/bash
cd /root/your-repo
git pull origin main
npm install
npm run build
pm2 restart your-app
echo "Деплой завершен!"
```

### Права на выполнение:
```bash
chmod +x /root/deploy.sh
```

---

## 🛠️ ШАГ 9: Полезные команды

### Управление PM2:
```bash
pm2 restart your-app    # Перезапуск
pm2 stop your-app       # Остановка
pm2 delete your-app     # Удаление
pm2 logs your-app       # Логи
pm2 monit              # Мониторинг
```

### Управление Nginx:
```bash
systemctl status nginx   # Статус
systemctl restart nginx  # Перезапуск
nginx -t                 # Проверка конфигурации
```

### Просмотр логов:
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
pm2 logs your-app --lines 100
```

---

## 🚨 ШАГ 10: Решение проблем

### 502 Bad Gateway:
```bash
pm2 status              # Проверить PM2
pm2 restart your-app    # Перезапустить
systemctl restart nginx # Перезапустить Nginx
```

### Нехватка памяти:
```bash
pm2 restart your-app --max-memory-restart 500M
```

### Проблемы с портами:
```bash
netstat -tulpn | grep :3000  # Проверить порт 3000
netstat -tulpn | grep :80    # Проверить порт 80
```

---

## 📊 ШАГ 11: Мониторинг

### Установка htop:
```bash
apt install htop -y
htop
```

### Мониторинг дискового пространства:
```bash
df -h
du -sh /root/your-repo
```

### Мониторинг памяти:
```bash
free -h
```

---

## 🔄 ШАГ 12: Обновление проекта

### Простое обновление:
```bash
cd /root/your-repo
git pull origin main
npm run build
pm2 restart your-app
```

### С проверкой зависимостей:
```bash
cd /root/your-repo
git pull origin main
npm install
npm run build
pm2 restart your-app
```

---

## ✅ Проверка работы

1. **Откройте браузер:** `http://YOUR_VPS_IP`
2. **Проверьте PM2:** `pm2 status`
3. **Проверьте Nginx:** `systemctl status nginx`
4. **Проверьте логи:** `pm2 logs your-app`

---

## 🎯 Итоговая структура:

```
/root/
├── your-repo/           # Ваш проект
│   ├── .next/          # Собранное приложение
│   ├── .env.production # Переменные окружения
│   └── package.json    # Зависимости
├── deploy.sh           # Скрипт деплоя
└── /etc/nginx/sites-available/your-app  # Конфиг Nginx
```

---

## 🚀 Готово!

Ваш Next.js проект теперь работает на VPS с:
- ✅ PM2 для управления процессами
- ✅ Nginx как reverse proxy
- ✅ Автоматическим перезапуском
- ✅ SSL сертификатом (опционально)
- ✅ Мониторингом и логами