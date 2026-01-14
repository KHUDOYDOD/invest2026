# 🌐 Привязка домена к Next.js на VPS

## 📋 Что нужно сделать:

1. ✅ Настроить DNS (указать домен на VPS)
2. ✅ Настроить Nginx (веб-сервер)
3. ✅ Настроить SSL (HTTPS)
4. ✅ Запустить Next.js как сервис

---

## 🚀 ШАГ 1: Настройка DNS

### В панели управления доменом (где купили домен):

Добавьте **A-запись**:

```
Тип: A
Имя: @ (или оставьте пустым)
Значение: IP_АДРЕС_ВАШЕГО_VPS
TTL: 3600
```

Для поддомена `www`:
```
Тип: A
Имя: www
Значение: IP_АДРЕС_ВАШЕГО_VPS
TTL: 3600
```

**Пример:**
- Домен: `yoursite.com`
- IP VPS: `123.45.67.89`

```
@ → 123.45.67.89
www → 123.45.67.89
```

⏰ **Ожидание:** DNS обновляется 5 минут - 24 часа (обычно 15-30 минут)

---

## 🚀 ШАГ 2: Установка на VPS

### Подключитесь к VPS:
```bash
ssh root@ВАШ_IP_VPS
```

### Установите необходимое ПО:

```bash
# Обновите систему
apt update && apt upgrade -y

# Установите Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Установите PM2 (для запуска Next.js)
npm install -g pm2

# Установите Nginx
apt install -y nginx

# Установите Certbot (для SSL)
apt install -y certbot python3-certbot-nginx
```

---

## 🚀 ШАГ 3: Загрузка проекта на VPS

### Вариант A: Через Git (рекомендуется)

```bash
# Перейдите в папку
cd /var/www

# Клонируйте репозиторий
git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026

# Установите зависимости
npm install

# Создайте .env файл
nano .env.production
```

Добавьте в `.env.production`:
```env
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=invest2026-super-secret-jwt-key-change-this-production-12345
NEXTAUTH_SECRET=invest2026-super-secret-nextauth-key-change-production-67890
NEXTAUTH_URL=https://ваш-домен.com
NODE_ENV=production
```

Сохраните: `Ctrl+X`, `Y`, `Enter`

```bash
# Соберите проект
npm run build
```

### Вариант B: Через FTP/SFTP

1. Используйте FileZilla или WinSCP
2. Подключитесь к VPS
3. Загрузите папку проекта в `/var/www/invest2026`
4. Выполните команды выше (npm install, создание .env, npm run build)

---

## 🚀 ШАГ 4: Запуск Next.js с PM2

```bash
# Запустите приложение
pm2 start npm --name "invest2026" -- start

# Настройте автозапуск при перезагрузке
pm2 startup
pm2 save

# Проверьте статус
pm2 status
```

**Полезные команды PM2:**
```bash
pm2 logs invest2026      # Просмотр логов
pm2 restart invest2026   # Перезапуск
pm2 stop invest2026      # Остановка
pm2 delete invest2026    # Удаление
```

---

## 🚀 ШАГ 5: Настройка Nginx

```bash
# Создайте конфигурацию
nano /etc/nginx/sites-available/invest2026
```

Вставьте конфигурацию:

```nginx
server {
    listen 80;
    server_name ваш-домен.com www.ваш-домен.com;

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
```

**Замените `ваш-домен.com` на ваш реальный домен!**

Сохраните: `Ctrl+X`, `Y`, `Enter`

```bash
# Активируйте конфигурацию
ln -s /etc/nginx/sites-available/invest2026 /etc/nginx/sites-enabled/

# Проверьте конфигурацию
nginx -t

# Перезапустите Nginx
systemctl restart nginx
```

---

## 🚀 ШАГ 6: Настройка SSL (HTTPS)

```bash
# Получите SSL сертификат
certbot --nginx -d ваш-домен.com -d www.ваш-домен.com

# Следуйте инструкциям:
# 1. Введите email
# 2. Согласитесь с условиями (Y)
# 3. Выберите опцию 2 (redirect HTTP to HTTPS)
```

**Автообновление сертификата:**
```bash
# Проверьте автообновление
certbot renew --dry-run
```

Сертификат будет обновляться автоматически каждые 90 дней!

---

## ✅ ГОТОВО!

Ваш сайт теперь доступен по адресу:
- `https://ваш-домен.com`
- `https://www.ваш-домен.com`

---

## 🔧 Обновление сайта

Когда нужно обновить код:

```bash
# Подключитесь к VPS
ssh root@ВАШ_IP_VPS

# Перейдите в папку проекта
cd /var/www/invest2026

# Получите обновления
git pull origin main

# Установите новые зависимости (если есть)
npm install

# Пересоберите проект
npm run build

# Перезапустите приложение
pm2 restart invest2026
```

Или создайте скрипт:

```bash
nano /root/update-site.sh
```

Вставьте:
```bash
#!/bin/bash
cd /var/www/invest2026
git pull origin main
npm install
npm run build
pm2 restart invest2026
echo "✅ Сайт обновлен!"
```

Сохраните и сделайте исполняемым:
```bash
chmod +x /root/update-site.sh
```

Теперь для обновления просто запускайте:
```bash
/root/update-site.sh
```

---

## 🔥 Настройка Firewall (безопасность)

```bash
# Установите UFW
apt install -y ufw

# Разрешите SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443

# Включите firewall
ufw enable

# Проверьте статус
ufw status
```

---

## 📊 Мониторинг

```bash
# Просмотр логов Next.js
pm2 logs invest2026

# Просмотр логов Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Использование ресурсов
pm2 monit
```

---

## 🆘 Решение проблем

### Сайт не открывается:

1. **Проверьте DNS:**
   ```bash
   nslookup ваш-домен.com
   ```
   Должен показать IP вашего VPS

2. **Проверьте Nginx:**
   ```bash
   systemctl status nginx
   nginx -t
   ```

3. **Проверьте Next.js:**
   ```bash
   pm2 status
   pm2 logs invest2026
   ```

4. **Проверьте порты:**
   ```bash
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :80
   ```

### Ошибка 502 Bad Gateway:

```bash
# Перезапустите Next.js
pm2 restart invest2026

# Проверьте логи
pm2 logs invest2026
```

### Ошибка подключения к БД:

Проверьте `.env.production`:
```bash
cat /var/www/invest2026/.env.production
```

---

## 📝 Краткая шпаргалка

```bash
# Подключение к VPS
ssh root@IP_VPS

# Перезапуск сайта
pm2 restart invest2026

# Просмотр логов
pm2 logs invest2026

# Обновление сайта
cd /var/www/invest2026
git pull
npm run build
pm2 restart invest2026

# Перезапуск Nginx
systemctl restart nginx

# Обновление SSL
certbot renew
```

---

## 🎉 Готово!

Ваш сайт работает на VPS с вашим доменом и SSL!

**Нужна помощь с настройкой?** Скажите на каком этапе возникли проблемы!
