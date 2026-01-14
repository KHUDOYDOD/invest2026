# 🚀 Деплой на Cloudflare Pages

## ✅ Что уже готово:

1. ✅ GitHub репозиторий: https://github.com/KHUDOYDOD/invest2026
2. ✅ База данных Neon создана
3. ✅ SQL схема готова: `neon-database-setup.sql`
4. ✅ package-lock.json обновлен
5. ✅ Конфигурация Next.js настроена

## 📋 Шаги для деплоя:

### Шаг 1: Выполнить SQL в Neon

1. Откройте Neon Dashboard: https://console.neon.tech
2. Выберите вашу базу данных
3. Откройте SQL Editor
4. Скопируйте содержимое файла `neon-database-setup.sql`
5. Вставьте и выполните SQL

**Или через командную строку:**
```bash
psql "postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require" -f neon-database-setup.sql
```

### Шаг 2: Настроить Cloudflare Pages

1. Откройте Cloudflare Dashboard: https://dash.cloudflare.com
2. Перейдите в **Workers & Pages** → **Create application** → **Pages**
3. Выберите **Connect to Git**
4. Подключите GitHub аккаунт (если еще не подключен)
5. Выберите репозиторий: **invest2026**

### Шаг 3: Настройки сборки

В настройках проекта укажите:

**Framework preset:** Next.js

**Build command:**
```
npm install && npm run build
```

**Build output directory:**
```
.next
```

**Root directory:** (оставьте пустым)

**Node version:** 18

### Шаг 4: Переменные окружения

В разделе **Environment variables** добавьте:

```
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=invest2026-super-secret-jwt-key-change-this-production-12345

NEXTAUTH_SECRET=invest2026-super-secret-nextauth-key-change-production-67890

NEXTAUTH_URL=https://invest2026.pages.dev

NODE_ENV=production
```

**ВАЖНО:** Добавьте эти переменные для **Production** и **Preview** окружений!

### Шаг 5: Запустить деплой

1. Нажмите **Save and Deploy**
2. Cloudflare автоматически начнет сборку
3. Дождитесь завершения (обычно 2-5 минут)

## 🎯 После деплоя:

### Проверка работы:

1. Откройте ваш сайт: `https://invest2026.pages.dev`
2. Попробуйте зарегистрироваться
3. Войдите с админ аккаунтом:
   - **Логин:** admin
   - **Пароль:** X12345x

### Настройка домена (опционально):

1. В Cloudflare Pages → **Custom domains**
2. Добавьте свой домен
3. Следуйте инструкциям для настройки DNS

## ⚠️ Важные замечания:

### Ограничения Cloudflare Pages:

- ❌ **API Routes могут не работать** - Cloudflare Pages не полностью поддерживает Next.js API routes
- ✅ **Решение:** Используйте Cloudflare Workers для API или переходите на Vercel

### Если API routes не работают:

**Вариант 1: Использовать @cloudflare/next-on-pages**
```bash
npm install --save-dev @cloudflare/next-on-pages
```

Обновите `package.json`:
```json
"scripts": {
  "pages:build": "npx @cloudflare/next-on-pages"
}
```

**Вариант 2: Перейти на Vercel (рекомендуется)**
- Vercel создан специально для Next.js
- Полная поддержка API routes
- Автоматический деплой из GitHub
- Бесплатный план для hobby проектов

## 🔧 Автоматический деплой:

После первой настройки, каждый push в GitHub будет автоматически деплоить сайт!

```bash
git add .
git commit -m "Update"
git push origin main
```

## 📞 Поддержка:

Если возникли проблемы:
1. Проверьте логи сборки в Cloudflare Dashboard
2. Убедитесь, что все переменные окружения добавлены
3. Проверьте, что SQL выполнен в Neon
4. Проверьте подключение к базе данных

## 🎉 Готово!

Ваш сайт должен быть доступен по адресу: https://invest2026.pages.dev
