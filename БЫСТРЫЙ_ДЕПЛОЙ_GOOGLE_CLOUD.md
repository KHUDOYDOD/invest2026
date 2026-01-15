# 🚀 Быстрый деплой из Google Cloud Shell

## ✅ Вы уже в Cloud Shell! Отлично!

Теперь выполните команды по порядку:

---

## 📋 Шаг 1: Подготовка проекта

### 1.1 Перейдите в папку проекта:
```bash
cd ~/invest2025
# или
cd ~/Invest2025-main
```

### 1.2 Установите зависимости:
```bash
npm install
```

---

## 🐳 Шаг 2: Создание Dockerfile

### 2.1 Создайте Dockerfile:
```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

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
EOF
```

### 2.2 Создайте .dockerignore:
```bash
cat > .dockerignore << 'EOF'
node_modules
.next
.git
.env.local
*.md
.gitignore
README.md
EOF
```

### 2.3 Обновите next.config.js:
```bash
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
EOF
```

---

## 🗄️ Шаг 3: Создание PostgreSQL базы данных

### 3.1 Включите необходимые API:
```bash
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3.2 Создайте Cloud SQL инстанс:
```bash
gcloud sql instances create invest2025-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=MySecurePassword123!
```

⏳ **Это займет 5-10 минут. Подождите...**

### 3.3 Создайте базу данных:
```bash
gcloud sql databases create invest2025 --instance=invest2025-db
```

### 3.4 Получите connection name:
```bash
gcloud sql instances describe invest2025-db --format="value(connectionName)"
```

📝 **Сохраните этот connection name! Он понадобится.**

---

## 🚀 Шаг 4: Деплой на Cloud Run

### 4.1 Установите ID проекта:
```bash
export PROJECT_ID=$(gcloud config get-value project)
echo "Project ID: $PROJECT_ID"
```

### 4.2 Получите connection name:
```bash
export CONNECTION_NAME=$(gcloud sql instances describe invest2025-db --format="value(connectionName)")
echo "Connection Name: $CONNECTION_NAME"
```

### 4.3 Задеплойте приложение:
```bash
gcloud run deploy invest2025-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://postgres:MySecurePassword123!@/invest2025?host=/cloudsql/$CONNECTION_NAME" \
  --set-env-vars "NEXTAUTH_SECRET=super-secret-key-change-this-in-production-min-32-chars" \
  --set-env-vars "NODE_ENV=production" \
  --add-cloudsql-instances $CONNECTION_NAME \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10
```

⏳ **Это займет 5-10 минут. Cloud Build соберет Docker образ и задеплоит.**

---

## 🗄️ Шаг 5: Настройка базы данных

### 5.1 Подключитесь к базе данных:
```bash
gcloud sql connect invest2025-db --user=postgres --database=invest2025
```

Введите пароль: `MySecurePassword123!`

### 5.2 Создайте таблицы (скопируйте SQL из ваших файлов):

```sql
-- Таблица пользователей
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  city VARCHAR(100),
  balance DECIMAL(10, 2) DEFAULT 0,
  role VARCHAR(50) DEFAULT 'user',
  referral_code VARCHAR(50) UNIQUE,
  referred_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заявок на пополнение
CREATE TABLE deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(100),
  payment_details JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

-- Таблица заявок на вывод
CREATE TABLE withdrawal_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(100),
  wallet_address TEXT,
  fee DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

-- Таблица инвестиционных планов
CREATE TABLE investment_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  min_amount DECIMAL(10, 2) NOT NULL,
  max_amount DECIMAL(10, 2) NOT NULL,
  daily_profit DECIMAL(5, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  description TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица активных инвестиций
CREATE TABLE active_investments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  plan_id INTEGER REFERENCES investment_plans(id),
  amount DECIMAL(10, 2) NOT NULL,
  daily_profit DECIMAL(10, 2),
  total_profit DECIMAL(10, 2) DEFAULT 0,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица транзакций
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subject VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица уведомлений
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица настроек статистики
CREATE TABLE statistics_settings (
  id SERIAL PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  active_investments INTEGER DEFAULT 0,
  total_withdrawn DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставьте начальные данные
INSERT INTO statistics_settings (total_users, active_investments, total_withdrawn)
VALUES (1250, 850, 2500000.00);

-- Выйдите из psql
\q
```

---

## 🎉 Шаг 6: Получите URL приложения

```bash
gcloud run services describe invest2025-app \
  --region us-central1 \
  --format="value(status.url)"
```

📝 **Это URL вашего приложения!**

---

## 🔧 Обновление переменных окружения

Если нужно обновить NEXTAUTH_URL после получения URL:

```bash
# Получите URL
export APP_URL=$(gcloud run services describe invest2025-app --region us-central1 --format="value(status.url)")

# Обновите переменные
gcloud run services update invest2025-app \
  --region us-central1 \
  --set-env-vars "NEXTAUTH_URL=$APP_URL"
```

---

## 📊 Полезные команды

### Просмотр логов:
```bash
gcloud run services logs read invest2025-app --region us-central1
```

### Обновление приложения:
```bash
gcloud run deploy invest2025-app \
  --source . \
  --region us-central1
```

### Удаление (если нужно):
```bash
gcloud run services delete invest2025-app --region us-central1
gcloud sql instances delete invest2025-db
```

---

## 💰 Стоимость

- **Cloud Run:** ~$0 (бесплатный уровень покрывает малую нагрузку)
- **Cloud SQL (db-f1-micro):** ~$7-10/месяц
- **Итого:** ~$7-10/месяц

---

## ⚠️ Важно!

1. **Смените пароль БД** на более безопасный
2. **Смените NEXTAUTH_SECRET** на случайную строку минимум 32 символа
3. **Настройте домен** (опционально)
4. **Включите мониторинг** в Cloud Console

---

## 🆘 Если что-то пошло не так:

### Проверьте логи:
```bash
gcloud run services logs read invest2025-app --region us-central1 --limit 50
```

### Проверьте статус:
```bash
gcloud run services describe invest2025-app --region us-central1
```

### Проверьте БД:
```bash
gcloud sql instances describe invest2025-db
```

---

## ✅ Готово!

Ваше приложение должно быть доступно по URL из Cloud Run!

Если возникнут проблемы - пишите, помогу разобраться! 🚀
