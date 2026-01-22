# 🚀 ДЕПЛОЙ НА НОВЫЙ VPS - ПОШАГОВАЯ ИНСТРУКЦИЯ

## 📋 Данные VPS:
- **IP:** 45.155.205.43
- **Логин:** root11  
- **Пароль:** $X11021997x$

---

## 🔧 ШАГ 1: Подготовка проекта

Выполните в папке проекта:

```bash
cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main
npm run build
```

---

## 🌐 ШАГ 2: Подключение к VPS

```bash
ssh root11@45.155.205.43
# Введите пароль: $X11021997x$
```

---

## ⚙️ ШАГ 3: Установка зависимостей на VPS

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Установка PM2
npm install -g pm2

# Установка Nginx
apt-get install -y nginx

# Установка Git
apt-get install -y git
```

---

## 📁 ШАГ 4: Клонирование проекта

```bash
cd /root
git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026
```

---

## 🔧 ШАГ 5: Настройка проекта

```bash
# Установка зависимостей
npm install --production

# Создание .env.production
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
EOF

# Сборка проекта
npm run build
```

---

## 🌐 ШАГ 6: Настройка Nginx

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
    }
}
EOF

# Перезапуск Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## 🚀 ШАГ 7: Запуск приложения

```bash
cd /root/invest2026

# Запуск через PM2
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Проверка статуса
pm2 status
```

---

## ✅ ШАГ 8: Проверка работы

1. **Сайт:** http://45.155.205.43
2. **Админ панель:** http://45.155.205.43/admin/dashboard

**Данные для входа в админку:**
- Логин: `admin`
- Пароль: `X11021997x`

---

## 🔧 Полезные команды:

```bash
# Статус приложения
pm2 status

# Логи приложения
pm2 logs investpro

# Перезапуск приложения
pm2 restart investpro

# Статус Nginx
systemctl status nginx

# Перезапуск Nginx
systemctl restart nginx
```

---

## 🆘 Если что-то не работает:

1. **Проверьте логи PM2:**
   ```bash
   pm2 logs investpro --lines 50
   ```

2. **Проверьте статус Nginx:**
   ```bash
   systemctl status nginx
   ```

3. **Перезапустите все:**
   ```bash
   pm2 restart investpro
   systemctl restart nginx
   ```

---

## 🎯 После успешного деплоя:

Сайт будет работать с исправленной ошибкой создания инвестиций!

База данных уже настроена (Neon PostgreSQL), админ создан, все готово к работе.