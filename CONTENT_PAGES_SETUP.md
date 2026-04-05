# 📄 Настройка страниц контента

## Что создано

Полная система управления контентом с админ-панелью:

### Страницы:
- `/team` - Команда
- `/careers` - Вакансии
- `/contacts` - Контакты
- `/terms` - Условия использования
- `/privacy` - Политика конфиденциальности
- `/about` - О нас
- `/blog` - Блог

### Админ-панель:
- `/admin/content-management` - Управление всем контентом

## Установка

### 1. Создайте таблицы в базе данных

```bash
node scripts/create-pages-tables.js
```

Или запустите:
```bash
setup-content-pages.bat
```

### 2. Таблицы, которые будут созданы:

- `team_members` - Члены команды
- `careers` - Вакансии
- `contacts` - Контакты
- `pages` - Статические страницы (terms, privacy, about)
- `blog_posts` - Посты блога

## Использование

### Управление через админ-панель

1. Откройте `/admin/content-management`
2. Выберите нужную вкладку:
   - **Команда** - добавляйте/редактируйте членов команды
   - **Вакансии** - управляйте вакансиями
   - **Страницы** - редактируйте содержимое статических страниц

### API Endpoints

#### Команда
- `GET /api/admin/team` - получить всех
- `POST /api/admin/team` - создать
- `PUT /api/admin/team` - обновить
- `DELETE /api/admin/team?id=xxx` - удалить

#### Вакансии
- `GET /api/admin/careers` - получить все
- `POST /api/admin/careers` - создать
- `PUT /api/admin/careers` - обновить
- `DELETE /api/admin/careers?id=xxx` - удалить

#### Страницы
- `GET /api/admin/pages` - получить все
- `GET /api/admin/pages?slug=terms` - получить по slug
- `POST /api/admin/pages` - создать
- `PUT /api/admin/pages` - обновить
- `DELETE /api/admin/pages?id=xxx` - удалить

#### Блог
- `GET /api/blog` - получить все посты
- `GET /api/blog?slug=post-slug` - получить пост

## Начальные данные

При создании таблиц автоматически добавляются:

- 6 членов команды
- 3 вакансии
- 6 контактов
- 3 статические страницы (terms, privacy, about)

## Структура данных

### Team Member
```typescript
{
  id: UUID
  name: string
  role: string
  image_emoji: string
  bio: string
  email: string
  linkedin: string
  twitter: string
  display_order: number
  is_active: boolean
}
```

### Career
```typescript
{
  id: UUID
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string
  responsibilities: string
  salary_range: string
  is_active: boolean
}
```

### Page
```typescript
{
  id: UUID
  slug: string
  title: string
  content: string (HTML)
  meta_description: string
  is_published: boolean
}
```

### Blog Post
```typescript
{
  id: UUID
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  image_url: string
  category: string
  tags: string[]
  views: number
  is_published: boolean
  published_at: timestamp
}
```

## Деплой

После создания таблиц и настройки контента:

```bash
git add .
git commit -m "Добавлены страницы контента и админ-панель"
git push origin main
```

Затем на VPS:
```bash
cd /home/root11/invest2026
git pull origin main
rm -rf .next
npm run build
pm2 restart invest2026
```

## Примечания

- Все страницы адаптивны и работают на мобильных устройствах
- Контент редактируется через админ-панель без перезапуска сервера
- Статические страницы поддерживают HTML для форматирования
- Блог автоматически считает просмотры
