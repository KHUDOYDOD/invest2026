# 🔧 Обновление переменных окружения на Vercel

## Проблема
Приложение на Vercel использует старые переменные окружения для проекта `kdfxytlaxrcrtsxvqilg`, а нужно использовать `hndoefvarvhfickrvlbf`.

## Решение

### Вариант 1: Через Dashboard (рекомендуется)

1. **Откройте настройки Vercel:**
   https://vercel.com/xx453925xx-1555s-projects/invest2025-main/settings/environment-variables

2. **Удалите старые переменные** (или обновите их):
   - POSTGRES_URL
   - POSTGRES_URL_NON_POOLING
   - POSTGRES_HOST
   - POSTGRES_PASSWORD
   - SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_ANON_KEY
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

3. **Добавьте новые значения:**

```
POSTGRES_URL=postgres://postgres.hndoefvarvhfickrvlbf:_$X11021997x$_@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x

POSTGRES_URL_NON_POOLING=postgres://postgres.hndoefvarvhfickrvlbf:_$X11021997x$_@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

POSTGRES_HOST=db.hndoefvarvhfickrvlbf.supabase.co

POSTGRES_PASSWORD=_$X11021997x$_

SUPABASE_URL=https://hndoefvarvhfickrvlbf.supabase.co

NEXT_PUBLIC_SUPABASE_URL=https://hndoefvarvhfickrvlbf.supabase.co

SUPABASE_ANON_KEY=sb_publishable_WQZ32E6Y4Mk41os57uoq1Q_8LfypBtS

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WQZ32E6Y4Mk41os57uoq1Q_8LfypBtS

SUPABASE_SERVICE_ROLE_KEY=sb_secret_qe8iJqGUVrWqh6rlJS4OkA_52AQY3SI
```

4. **Сохраните** и **Redeploy**

### Вариант 2: Через CLI

```bash
# Запустите этот скрипт:
update-vercel-env.bat
```

## После обновления

1. Сделайте redeploy:
   ```bash
   vercel --prod --yes
   ```

2. Проверьте API:
   ```bash
   node check-api-endpoints.js
   ```

3. Все эндпоинты должны вернуть статус 200! ✅

## Важно

- Используйте **Production** environment для всех переменных
- Отметьте **SUPABASE_SERVICE_ROLE_KEY** и **POSTGRES_PASSWORD** как sensitive
- После обновления переменных обязательно сделайте redeploy
