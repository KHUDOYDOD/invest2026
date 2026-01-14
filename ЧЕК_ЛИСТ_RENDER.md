# ✅ ЧЕК-ЛИСТ ДЛЯ RENDER

## 🎯 ЧТО ДЕЛАТЬ В RENDER:

### Шаг 1: Вход
- [ ] Нажмите **"Get Started"** или **"Sign In"**
- [ ] Выберите **"Sign in with GitHub"**
- [ ] Разрешите доступ к репозиториям

---

### Шаг 2: Создание Web Service
- [ ] Нажмите **"New +"** (в правом верхнем углу)
- [ ] Выберите **"Web Service"**
- [ ] Найдите репозиторий **"invest2026"**
- [ ] Нажмите **"Connect"**

---

### Шаг 3: Настройка параметров

#### Основные настройки:
```
Name: invest2026
Region: Frankfurt (EU Central)
Branch: main
Root Directory: (оставьте пустым)
Runtime: Node
```

#### Build & Deploy:
```
Build Command: npm install && npm run build
Start Command: npm start
```

#### Instance Type:
```
Instance Type: Free
```

---

### Шаг 4: Environment Variables

Прокрутите вниз до раздела **"Environment Variables"**

Нажмите **"Add Environment Variable"** и добавьте:

#### 1. DATABASE_URL
```
Key: DATABASE_URL
Value: [Ваша строка подключения из Neon]
```

#### 2. POSTGRES_URL
```
Key: POSTGRES_URL
Value: [Ваша строка подключения из Neon]
```

#### 3. POSTGRES_URL_NON_POOLING
```
Key: POSTGRES_URL_NON_POOLING
Value: [Ваша строка подключения из Neon]
```

#### 4. JWT_SECRET
```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-12345
```

#### 5. NEXTAUTH_SECRET
```
Key: NEXTAUTH_SECRET
Value: your-super-secret-nextauth-key-change-67890
```

#### 6. NEXTAUTH_URL
```
Key: NEXTAUTH_URL
Value: https://invest2026.onrender.com
```

#### 7. NODE_ENV
```
Key: NODE_ENV
Value: production
```

---

### Шаг 5: Запуск деплоя
- [ ] Проверьте, что все 7 переменных добавлены
- [ ] Нажмите **"Create Web Service"**
- [ ] Дождитесь завершения деплоя (5-7 минут)

---

## 📊 ЧТО БУДЕТ ПРОИСХОДИТЬ:

1. **Installing dependencies** - установка пакетов (2-3 минуты)
2. **Building** - сборка проекта (2-3 минуты)
3. **Starting** - запуск сервера (30 секунд)
4. **Live** - сайт работает! ✅

---

## 🎉 ПОСЛЕ ДЕПЛОЯ:

### Проверка:
1. Вверху страницы будет ссылка: `https://invest2026.onrender.com`
2. Нажмите на неё
3. Перейдите на `/login`
4. Войдите:
   - Логин: `admin`
   - Пароль: `X12345x`

---

## ⚠️ ВАЖНО:

### Если у вас ещё нет базы данных в Neon:

1. Откройте https://console.neon.tech
2. Создайте проект `invest2026`
3. Скопируйте Connection String
4. Выполните SQL из файла `neon-database-setup.sql`
5. Используйте эту строку в Environment Variables

### Формат строки подключения:
```
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## 🆘 ПРОБЛЕМЫ?

### Build failed
- Проверьте логи в Render
- Убедитесь, что все Environment Variables добавлены

### Deploy failed
- Проверьте, что Connection String правильный
- Убедитесь, что SQL скрипт выполнен в Neon

### Сайт не открывается
- Подождите 5-10 минут после деплоя
- Проверьте статус в Render Dashboard

---

## 📖 ДОПОЛНИТЕЛЬНО:

- **Логи:** Render Dashboard → Logs
- **Метрики:** Render Dashboard → Metrics
- **Настройки:** Render Dashboard → Settings

---

**Удачи! 🚀**
