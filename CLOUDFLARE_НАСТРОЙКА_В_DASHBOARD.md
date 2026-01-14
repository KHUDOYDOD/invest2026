# 🔧 CLOUDFLARE - НАСТРОЙКА В DASHBOARD

## Проблема
Cloudflare игнорирует `wrangler.toml` и использует `pnpm` вместо `npm`, что приводит к ошибкам сборки.

## Решение
Нужно настроить Build settings вручную в Cloudflare Dashboard.

---

## 📋 ШАГ 1: Откройте настройки проекта

1. Откройте https://dash.cloudflare.com
2. Pages → **invest2026**
3. Settings → **Builds & deployments**

---

## 📋 ШАГ 2: Измените Build settings

Нажмите **"Edit configuration"** и установите:

### Build command:
```
npm install && npm run build
```

### Build output directory:
```
.next
```

### Root directory:
```
(оставьте пустым)
```

### Environment variables (Production):
Добавьте эти переменные (или используйте bat-файл):

```
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=your-super-secret-jwt-key-change-this-12345

NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-67890

NEXTAUTH_URL=https://invest2026.pages.dev

NODE_ENV=production
```

Нажмите **"Save"**

---

## 📋 ШАГ 3: Retry deployment

1. Перейдите в **Deployments**
2. Найдите последний failed deployment
3. Нажмите **"Retry deployment"**

Или просто нажмите **"Create deployment"** для нового деплоя.

---

## ✅ Что должно произойти

Теперь сборка пройдёт успешно:

```
✓ Cloning repository
✓ Installing dependencies: npm install
✓ Building: npm run build
✓ Compiled successfully
✓ Build successful!
✓ Deploying to Cloudflare
✓ Deployment complete!
```

---

## 🌐 После успешного деплоя

### https://invest2026.pages.dev

Сайт будет полностью работать!

### Проверьте:
- ✅ Главная: https://invest2026.pages.dev
- ✅ Вход: https://invest2026.pages.dev/login
- ✅ Админ: https://invest2026.pages.dev/admin

### Данные для входа:
```
Логин: admin
Пароль: X12345x
```

---

## 🔧 Быстрые команды

| Команда | Описание |
|---------|----------|
| `скопировать-переменные-cloudflare.bat` | Копирует переменные |
| `открыть-cloudflare.bat` | Открывает Cloudflare Dashboard |

---

## 📊 Статус

✅ Код готов
✅ Конфигурация добавлена
⏳ Нужно настроить Build settings в Dashboard
⏳ Нужно добавить переменные окружения
⏳ Нужно запустить Retry deployment

**Время настройки:** ~3 минуты ⏱️
**Время сборки:** ~3-5 минут ⏱️

---

## ❓ Альтернатива: Vercel

Если Cloudflare продолжает вызывать проблемы, рекомендую использовать **Vercel** - он создан специально для Next.js и работает из коробки без настройки.

Хотите переключиться на Vercel? Это займёт 2 минуты и точно сработает!

---

Удачи! 🚀
