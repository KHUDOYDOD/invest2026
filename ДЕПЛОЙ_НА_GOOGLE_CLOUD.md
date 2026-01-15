# 🚀 Деплой Next.js проекта на Google Cloud Platform

## 📋 Что нужно:

1. ✅ Аккаунт Google Cloud (бесплатные $300 кредитов на 90 дней)
2. ✅ Установленный Google Cloud SDK (gcloud CLI)
3. ✅ Проект готов к деплою

---

## 🎯 Варианты деплоя на GCP:

### Вариант 1: Cloud Run (Рекомендую!) ⭐
**Плюсы:**
- Автоматическое масштабирование
- Платите только за использование
- Простой деплой
- HTTPS из коробки

### Вариант 2: App Engine
**Плюсы:**
- Полностью управляемый
- Автоматическое масштабирование
- Встроенный мониторинг

### Вариант 3: Compute Engine (VM)
**Плюсы:**
- Полный контроль
- Можно настроить все вручную

---

## 🚀 ВАРИАНТ 1: Cloud Run (Самый простой)

### Шаг 1: Установка Google Cloud SDK

**Windows:**
```powershell
# Скачайте установщик:
# https://cloud.google.com/sdk/docs/install

# Или через PowerShell:
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

### Шаг 2: Инициализация gcloud

```bash
# Войдите в аккаунт
gcloud auth login

# Создайте новый проект или выберите существующий
gcloud projects create invest2025-app --name="Invest2025"

# Установите проект по умолчанию
gcloud config set project invest2025-app

# Включите необходимые API
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

### Шаг 3: Создание Dockerfile

Создайте файл `Dockerfile` в корне проекта:

```dockerfile
# Используем Node.js 18
FROM node:18-alpine AS base

# Устанавливаем зависимости
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Шаг 4: Обновление next.config.js

Добавьте в `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

### Шаг 5: Создание .dockerignore

```
node_modules
.next
.git
.env.local
*.md
```

### Шаг 6: Создание Cloud SQL (PostgreSQL)

```bash
# Создайте PostgreSQL инстанс
gcloud sql instances create invest2025-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Установите пароль root
gcloud sql users set-password postgres \
  --instance=invest2025-db \
  --password=ВАШ_ПАРОЛЬ

# Создайте базу данных
gcloud sql databases create invest2025 \
  --instance=invest2025-db
```

### Шаг 7: Деплой на Cloud Run

```bash
# Соберите и задеплойте
gcloud run deploy invest2025-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@/invest2025?host=/cloudsql/invest2025-app:us-central1:invest2025-db" \
  --set-env-vars "NEXTAUTH_SECRET=ваш_секретный_ключ_минимум_32_символа" \
  --set-env-vars "NEXTAUTH_URL=https://ваш-домен.run.app" \
  --add-cloudsql-instances invest2025-app:us-central1:invest2025-db
```

---

## 🚀 ВАРИАНТ 2: App Engine

### Шаг 1: Создание app.yaml

```yaml
runtime: nodejs18

env_variables:
  DATABASE_URL: "postgresql://postgres:PASSWORD@/invest2025?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME"
  NEXTAUTH_SECRET: "ваш_секретный_ключ"
  NEXTAUTH_URL: "https://PROJECT_ID.appspot.com"

vpc_access_connector:
  name: "projects/PROJECT_ID/locations/REGION/connectors/CONNECTOR_NAME"

automatic_scaling:
  min_instances: 0
  max_instances: 10
```

### Шаг 2: Деплой

```bash
gcloud app deploy
```

---

## 🗄️ Настройка базы данных

### После деплоя выполните миграции:

```bash
# Подключитесь к Cloud SQL
gcloud sql connect invest2025-db --user=postgres

# Выполните SQL скрипты
\c invest2025

# Скопируйте содержимое ваших .sql файлов
```

Или используйте Cloud SQL Proxy локально:

```bash
# Скачайте Cloud SQL Proxy
# https://cloud.google.com/sql/docs/postgres/sql-proxy

# Запустите прокси
./cloud-sql-proxy invest2025-app:us-central1:invest2025-db

# В другом терминале подключитесь
psql "host=127.0.0.1 port=5432 dbname=invest2025 user=postgres"
```

---

## 🔐 Переменные окружения

Создайте файл `.env.production`:

```env
DATABASE_URL=postgresql://postgres:PASSWORD@/invest2025?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
NEXTAUTH_SECRET=ваш_очень_длинный_секретный_ключ_минимум_32_символа
NEXTAUTH_URL=https://ваш-домен.run.app
NODE_ENV=production
```

---

## 💰 Примерная стоимость (месяц):

### Cloud Run:
- **Бесплатный уровень:** 2 млн запросов/месяц
- **После:** ~$0.40 за 1 млн запросов
- **Память:** ~$0.0000025 за ГБ-секунду

### Cloud SQL (db-f1-micro):
- **~$7-10/месяц** (самый дешевый)
- Или используйте внешнюю БД (Supabase бесплатно)

### Итого: 
- С бесплатными кредитами: **$0** (первые 90 дней)
- После: **~$10-15/месяц** (при малой нагрузке)

---

## 🎯 Альтернатива: Vercel (Проще и дешевле!)

Если хотите еще проще:

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой одной командой
vercel

# Production деплой
vercel --prod
```

**Плюсы Vercel:**
- ✅ Бесплатный план
- ✅ Автоматический HTTPS
- ✅ Глобальный CDN
- ✅ Интеграция с GitHub
- ✅ Встроенная PostgreSQL (Vercel Postgres)

---

## 📝 Что выбрать?

| Платформа | Сложность | Стоимость | Рекомендация |
|-----------|-----------|-----------|--------------|
| **Vercel** | ⭐ Легко | Бесплатно | ✅ Лучший выбор |
| **Cloud Run** | ⭐⭐ Средне | ~$10/мес | Хорошо для масштабирования |
| **App Engine** | ⭐⭐ Средне | ~$15/мес | Полностью управляемый |
| **Compute Engine** | ⭐⭐⭐ Сложно | ~$20/мес | Полный контроль |

---

## 🚀 Мой совет:

1. **Для начала:** Используйте **Vercel** (бесплатно, просто)
2. **Для масштабирования:** Переходите на **Google Cloud Run**
3. **Для enterprise:** Используйте **App Engine** или **Compute Engine**

Хотите, я помогу настроить деплой на Vercel? Это займет 5 минут! 😊
