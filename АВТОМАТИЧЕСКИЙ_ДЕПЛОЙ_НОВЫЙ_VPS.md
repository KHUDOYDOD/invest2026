# 🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА НОВЫЙ VPS

## 📋 Данные VPS:
- **IP:** 45.155.205.43
- **Логин:** root11
- **Пароль:** $X11021997x$

---

## 🔧 ШАГ 1: Подготовка (выполнено ✅)

✅ Проект собран локально  
✅ Ошибка инвестиций исправлена  
✅ База данных готова (Neon PostgreSQL)  
✅ Админ создан (admin / X11021997x)  

---

## 🌐 ШАГ 2: Настройка VPS

Поскольку SSH работает только по ключам, нужно:

### Вариант A: Через веб-консоль VPS
1. Зайдите в панель управления VPS
2. Откройте веб-консоль (VNC/Console)
3. Выполните команды настройки

### Вариант B: Если есть root доступ
Выполните команды из **КОМАНДЫ_ДЛЯ_VPS.txt**

---

## 📋 КОМАНДЫ ДЛЯ VPS:

```bash
# 1. Обновление системы
apt update && apt upgrade -y

# 2. Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# 3. Установка PM2 и других зависимостей
npm install -g pm2
apt-get install -y nginx git

# 4. Клонирование проекта
cd /root
git clone https://github.com/KHUDOYDOD/invest2026.git
cd invest2026

# 5. Установка зависимостей проекта
npm install --production

# 6. Создание .env.production
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
EOF

# 7. Сборка проекта
npm run build

# 8. Настройка Nginx
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
systemctl restart nginx
systemctl enable nginx

# 10. Запуск приложения
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start

# 11. Автозапуск
pm2 startup
pm2 save

# 12. Проверка статуса
pm2 status
systemctl status nginx --no-pager

echo "🎉 ДЕПЛОЙ ЗАВЕРШЕН!"
echo "Сайт доступен: http://45.155.205.43"
echo "Админ панель: http://45.155.205.43/admin/dashboard"
```

---

## ✅ После выполнения команд:

**Сайт будет доступен:**
- 🌐 **Главная:** http://45.155.205.43
- 👤 **Админ панель:** http://45.155.205.43/admin/dashboard

**Данные для входа в админку:**
- Логин: `admin`
- Пароль: `X11021997x`

---

## 🔧 Управление сервером:

```bash
# Статус приложения
pm2 status

# Логи приложения  
pm2 logs investpro

# Перезапуск приложения
pm2 restart investpro

# Статус Nginx
systemctl status nginx
```

---

## 🎯 Что будет исправлено:

✅ **Ошибка создания инвестиций (500)** - полностью исправлена  
✅ **Все функции сайта** - работают корректно  
✅ **База данных** - подключена и настроена  
✅ **Админ панель** - готова к использованию  

---

## 📞 Если нужна помощь:

1. **Проверьте логи PM2:**
   ```bash
   pm2 logs investpro --lines 20
   ```

2. **Проверьте статус Nginx:**
   ```bash
   systemctl status nginx
   ```

3. **Перезапустите все сервисы:**
   ```bash
   pm2 restart investpro
   systemctl restart nginx
   ```

---

## 🎉 ГОТОВО!

После выполнения всех команд сайт будет полностью работать на новом VPS!