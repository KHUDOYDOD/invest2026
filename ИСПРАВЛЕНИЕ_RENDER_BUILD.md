# ✅ ИСПРАВЛЕНИЕ ОШИБКИ СБОРКИ RENDER

## Проблема
Render не мог найти UI компоненты (`@/components/ui/card`, `@/components/ui/button` и т.д.), хотя они существуют в репозитории.

## Причина
В `tsconfig.json` использовалась настройка `"moduleResolution": "bundler"`, которая не полностью совместима с Next.js 14.2.16 на серверах Render.

## Что исправлено

### 1. tsconfig.json
Изменено:
- `"moduleResolution": "bundler"` → `"moduleResolution": "node"`
- Добавлено: `"baseUrl": "."`

Это стандартная конфигурация для Next.js, которая гарантированно работает на всех платформах.

### 2. render.yaml
Обновлена команда сборки:
```yaml
buildCommand: rm -rf .next node_modules && npm install && npm run build
```

Это гарантирует чистую сборку без кэша.

## Что делать дальше

### Шаг 1: Обновить деплой в Render
Render автоматически обнаружит изменения в GitHub и начнёт новую сборку.

Или вручную:
1. Откройте ваш сервис в Render Dashboard
2. Нажмите **"Manual Deploy"** → **"Clear build cache & deploy"**

### Шаг 2: Дождаться успешной сборки
Теперь сборка должна пройти успешно. Вы увидите:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### Шаг 3: Настроить переменные окружения
После успешной сборки добавьте переменные окружения в Render:

1. **DATABASE_URL** - строка подключения из Neon
2. **POSTGRES_URL** - та же строка
3. **POSTGRES_URL_NON_POOLING** - та же строка
4. **JWT_SECRET** - `your-super-secret-jwt-key-change-this-12345`
5. **NEXTAUTH_SECRET** - `your-super-secret-nextauth-key-change-67890`
6. **NEXTAUTH_URL** - `https://invest2026.onrender.com`
7. **NODE_ENV** - `production`

### Шаг 4: Создать базу данных в Neon
1. Откройте https://console.neon.tech
2. Создайте новый проект: **invest2026**
3. Регион: **Europe (Frankfurt)**
4. Скопируйте Connection String
5. Откройте SQL Editor
6. Выполните SQL из файла `neon-database-setup.sql`

## Проверка
После деплоя откройте:
- https://invest2026.onrender.com - главная страница
- https://invest2026.onrender.com/login - вход
- https://invest2026.onrender.com/admin - админ панель

**Данные для входа:**
- Логин: `admin`
- Пароль: `X12345x`

## Статус
✅ Код исправлен и загружен в GitHub
✅ Render автоматически начнёт новую сборку
⏳ Ожидается успешная сборка
⏳ Нужно настроить переменные окружения
⏳ Нужно создать базу данных в Neon

---

**Изменённые файлы:**
- `tsconfig.json` - исправлена конфигурация TypeScript
- `render.yaml` - улучшена команда сборки

**Коммит:** `Fix module resolution for Render deployment`
