# 🚀 Настройка VPS для Next.js проекта

## ✅ Ваш VPS подходит!

```
✅ 1 ядро CPU - достаточно
✅ 1 GB RAM - минимум для Next.js
✅ 5 GB NVMe SSD - хватит для проекта
✅ 50 Mbit/s - отлично
```

---

## 📋 Пошаговая инструкция

### Шаг 1: Подключитесь к VPS по SSH

```bash
ssh root@ВАШ_IP_АДРЕС
# Введите пароль
```

---

### Шаг 2: Обновите систему

```bash
# Обновите пакеты
apt update && apt upgrade -y

# Установите необходимые утилиты
apt install -y curl wget git nano
```

---

### Шаг 3: Установите Node.js 18

```bash
# Добавьте репозиторий Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Установите Node.js
apt install -y nodejs

# Проверьте версию
node -v  # должно быть v18.x.x
npm -v   # должно быть 9.x.x
```

---

### Шаг 4: Установите PostgreSQL

```bash
# Установите PostgreSQL
apt install -y postgresql postgresql-contrib

# Запустите PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Создайте базу данных и пользователя
sudo -u postgres psql << EOF
CREATE DATABASE invest2026;
CREATE USER invest2026user WITH PASSWORD 'ВАШ_ПАРОЛЬ';
GRANT ALL PRIVILEGES ON DATABASE invest2026 TO invest2026user;
\q
EOF
```

---

### Шаг 5: Установите PM2 (менеджер процессов)

```bash
npm install -g pm2
```

---

### Шаг 6: Загрузите проект на VPS

**Вариант 1: Через Git (рекомендую)**

```bash
# Создайте папку для проекта
mkdir -p /var/www
cd /var/www

# Клонируйте проект из GitHub
git clone https://github.com/ВАШ_РЕПОЗИТОРИЙ/invest2026.git
cd invest2026
```

**Вариант 2: Через SCP (с вашего компьютера)**

```bash
# На вашем компьютере:
scp -r C:\Users\x4539\Downloads\Invest2025-main root@ВАШ_IP:/var/www/invest2026
```

---

### Шаг 7: Настройте проект

```bash
cd /var/www/invest2026

# Установите зависимости
npm install

# Создайте .env.local
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://invest2026user:ВАШ_ПАРОЛЬ@localhost:5432/invest2026
NEXTAUTH_SECRET=super-secret-key-change-this-min-32-characters-long
NEXTAUTH_URL=http://ВАШ_IP:3000
NODE_ENV=production
EOF

# Соберите проект
npm run build
```

---

### Шаг 8: Создайте таблицы в базе данных

```bash
# Подключитесь к PostgreSQL
sudo -u postgres psql -d invest2026

# Скопируйте и выполните SQL из ваших файлов:
# create-requests-tables.sql
# create-messages-notifications-tables.sql
# create-statistics-settings-table.sql
# и т.д.

# Или загрузите SQL файлы и выполните:
psql -U invest2026user -d invest2026 -f /var/www/invest2026/create-requests-tables.sql
```

---

### Шаг 9: Запустите приложение с PM2

```bash
cd /var/www/invest2026

# Запустите через PM2
pm2 start npm --name "invest2026" -- start

# Сохраните конфигурацию PM2
pm2 save

# Настройте автозапуск при перезагрузке
pm2 startup
# Выполните команду, которую покажет PM2
```

---

### Шаг 10: Установите Nginx (обратный прокси)

```bash
# Установите Nginx
apt install -y nginx

# Создайте конфигурацию
cat > /etc/nginx/sites-available/invest2026 << 'EOF'
server {
    listen 80;
    server_name ВАШ_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Активируйте конфигурацию
ln -s /etc/nginx/sites-available/invest2026 /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
nginx -t

# Перезапустите Nginx
systemctl restart nginx
systemctl enable nginx
```

---

### Шаг 11: Настройте файрвол

```bash
# Установите UFW
apt install -y ufw

# Разрешите SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Включите файрвол
ufw --force enable

# Проверьте статус
ufw status
```

---

### Шаг 12: Установите SSL (опционально, но рекомендуется)

```bash
# Установите Certbot
apt install -y certbot python3-certbot-nginx

# Получите SSL сертификат (если есть домен)
certbot --nginx -d ваш-домен.com

# Или используйте самоподписанный сертификат для IP
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt
```

---

## ✅ Готово! Проверьте работу

Откройте в браузере:
```
http://ВАШ_IP
```

---

## 🔧 Полезные команды

### Управление PM2:
```bash
pm2 status              # Статус приложений
pm2 logs invest2026     # Логи приложения
pm2 restart invest2026  # Перезапуск
pm2 stop invest2026     # Остановка
pm2 delete invest2026   # Удаление
```

### Управление Nginx:
```bash
systemctl status nginx   # Статус
systemctl restart nginx  # Перезапуск
nginx -t                 # Проверка конфигурации
```

### Управление PostgreSQL:
```bash
systemctl status postgresql  # Статус
sudo -u postgres psql       # Подключение
```

### Просмотр логов:
```bash
pm2 logs invest2026          # Логи приложения
tail -f /var/log/nginx/error.log  # Логи Nginx
journalctl -u postgresql     # Логи PostgreSQL
```

---

## 🔄 Обновление проекта

```bash
cd /var/www/invest2026

# Получите изменения из Git
git pull

# Установите новые зависимости
npm install

# Пересоберите проект
npm run build

# Перезапустите приложение
pm2 restart invest2026
```

---

## 📊 Мониторинг ресурсов

```bash
# Использование памяти
free -h

# Использование диска
df -h

# Загрузка CPU
top

# PM2 мониторинг
pm2 monit
```

---

## ⚠️ Важные замечания

1. **Замените пароли** на безопасные
2. **Настройте регулярные бэкапы** базы данных
3. **Обновляйте систему** регулярно
4. **Мониторьте ресурсы** - 1 GB RAM это минимум
5. **Настройте домен** вместо IP (опционально)

---

## 💰 Оптимизация для 1 GB RAM

Если памяти не хватает:

```bash
# Создайте swap файл (виртуальная память)
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Проверьте
free -h
```

---

## 🆘 Если что-то не работает

1. Проверьте логи PM2: `pm2 logs invest2026`
2. Проверьте логи Nginx: `tail -f /var/log/nginx/error.log`
3. Проверьте статус: `pm2 status`
4. Проверьте порты: `netstat -tulpn | grep :3000`
5. Проверьте файрвол: `ufw status`

---

## ✅ Итого

После настройки у вас будет:
- ✅ Next.js приложение на порту 3000
- ✅ Nginx как обратный прокси на порту 80
- ✅ PostgreSQL база данных
- ✅ PM2 для управления процессом
- ✅ Автозапуск при перезагрузке
- ✅ Файрвол для безопасности

Готово к работе! 🚀
