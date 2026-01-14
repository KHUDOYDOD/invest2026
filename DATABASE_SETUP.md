# 🗄️ Настройка базы данных

## Шаг 1: Установка PostgreSQL

### Windows:
1. Скачайте PostgreSQL с официального сайта: https://www.postgresql.org/download/windows/
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя `postgres`
4. По умолчанию PostgreSQL запустится на порту `5432`

### Linux:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

## Шаг 2: Создание базы данных

Откройте терминал PostgreSQL (psql):

```bash
# Windows (через PowerShell или CMD)
psql -U postgres

# Linux/macOS
sudo -u postgres psql
```

Создайте базу данных:

```sql
CREATE DATABASE investpro;
\c investpro
```

## Шаг 3: Настройка переменных окружения

Файл `.env.local` уже создан в корне проекта. Обновите его с вашими данными:

```env
DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/investpro
JWT_SECRET=ваш_секретный_ключ_для_jwt
NEXTAUTH_SECRET=ваш_секретный_ключ_для_nextauth
```

**Важно:** Замените `ВАШ_ПАРОЛЬ` на пароль, который вы установили при установке PostgreSQL.

## Шаг 4: Инициализация структуры базы данных

Выполните SQL скрипт для создания таблиц:

```bash
# Из корня проекта
psql -U postgres -d investpro -f complete-database-setup.sql
```

Или через psql:

```sql
\c investpro
\i complete-database-setup.sql
```

## Шаг 5: Очистка демо-данных

После того как база данных настроена, очистите демо-данные:

### Вариант 1: Через Node.js скрипт (рекомендуется)

```bash
node scripts/clean-demo-data.js
```

### Вариант 2: Через SQL скрипт

```bash
psql -U postgres -d investpro -f scripts/clean-database.sql
```

## Шаг 6: Создание первого администратора

После очистки создайте администратора через регистрацию на сайте, затем обновите его роль в базе данных:

```sql
-- Подключитесь к базе данных
psql -U postgres -d investpro

-- Обновите роль пользователя на admin
UPDATE users SET role = 'admin' WHERE email = 'ваш_email@example.com';
```

## Шаг 7: Запуск приложения

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 🔧 Полезные команды

### Проверка подключения к базе данных:
```bash
psql -U postgres -d investpro -c "SELECT version();"
```

### Просмотр всех таблиц:
```sql
\dt
```

### Просмотр пользователей:
```sql
SELECT id, email, full_name, role, created_at FROM users;
```

### Просмотр статистики:
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM transactions) as transactions_count,
  (SELECT COUNT(*) FROM investments) as investments_count;
```

### Создание бэкапа:
```bash
pg_dump -U postgres investpro > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из бэкапа:
```bash
psql -U postgres -d investpro < backup_file.sql
```

## 🚨 Устранение неполадок

### Ошибка: "password authentication failed"
- Проверьте пароль в `.env.local`
- Убедитесь, что пользователь `postgres` существует
- Попробуйте сбросить пароль: `ALTER USER postgres PASSWORD 'новый_пароль';`

### Ошибка: "database does not exist"
- Создайте базу данных: `CREATE DATABASE investpro;`

### Ошибка: "connection refused"
- Убедитесь, что PostgreSQL запущен: `sudo systemctl status postgresql` (Linux)
- Проверьте порт: по умолчанию 5432

### Ошибка: "relation does not exist"
- Выполните скрипт инициализации: `psql -U postgres -d investpro -f complete-database-setup.sql`

## 🔒 Безопасность для продакшена

Перед развертыванием в продакшене:

1. **Измените все секретные ключи** в `.env.local`
2. **Используйте сильные пароли** для базы данных
3. **Включите SSL** для подключения к базе данных:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
   ```
4. **Ограничьте доступ** к базе данных по IP
5. **Регулярно делайте бэкапы**
6. **Мониторьте логи** базы данных

## 📊 Мониторинг

Для мониторинга производительности базы данных:

```sql
-- Активные подключения
SELECT * FROM pg_stat_activity;

-- Размер базы данных
SELECT pg_size_pretty(pg_database_size('investpro'));

-- Размер таблиц
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## ✅ Готово!

Теперь ваша база данных настроена и готова к работе! 🎉
