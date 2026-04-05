-- Таблица для команды
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image_emoji VARCHAR(10) DEFAULT '👤',
  bio TEXT,
  email VARCHAR(255),
  linkedin VARCHAR(500),
  twitter VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для вакансий
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- full-time, part-time, contract
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  salary_range VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для контактов
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- email, phone, address, social
  title VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для статических страниц (terms, privacy, about, blog)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL, -- terms, privacy, about, blog
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для постов блога
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255),
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[], -- массив тегов
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем начальные данные для команды
INSERT INTO team_members (name, role, image_emoji, bio, email, linkedin, twitter, display_order) VALUES
('Александр Петров', 'CEO & Основатель', '👨‍💼', '15+ лет опыта в финансовых технологиях и инвестициях', 'a.petrov@invest2026.com', '#', '#', 1),
('Елена Смирнова', 'CFO', '👩‍💼', 'Эксперт в области финансового планирования и анализа', 'e.smirnova@invest2026.com', '#', '#', 2),
('Дмитрий Иванов', 'CTO', '👨‍💻', 'Специалист по блокчейн и криптовалютным технологиям', 'd.ivanov@invest2026.com', '#', '#', 3),
('Мария Козлова', 'Head of Operations', '👩‍💼', 'Управление операциями и клиентским сервисом', 'm.kozlova@invest2026.com', '#', '#', 4),
('Сергей Волков', 'Head of Security', '🛡️', 'Обеспечение безопасности платформы и данных клиентов', 's.volkov@invest2026.com', '#', '#', 5),
('Анна Морозова', 'Head of Marketing', '📊', 'Развитие бренда и привлечение инвесторов', 'a.morozova@invest2026.com', '#', '#', 6);

-- Вставляем начальные данные для вакансий
INSERT INTO careers (title, department, location, type, description, requirements, responsibilities, salary_range) VALUES
('Senior Backend Developer', 'Технологии', 'Удаленно / Москва', 'full-time', 
'Мы ищем опытного Backend разработчика для работы над нашей инвестиционной платформой.',
'- 5+ лет опыта с Node.js/Python
- Опыт работы с PostgreSQL
- Знание Docker и CI/CD
- Опыт работы с финансовыми системами',
'- Разработка и поддержка API
- Оптимизация производительности
- Работа с базами данных
- Code review и менторинг',
'$80,000 - $120,000'),

('Frontend Developer', 'Технологии', 'Удаленно', 'full-time',
'Ищем талантливого Frontend разработчика для создания современного UI.',
'- 3+ года опыта с React/Next.js
- Знание TypeScript
- Опыт работы с Tailwind CSS
- Понимание UX/UI принципов',
'- Разработка пользовательских интерфейсов
- Оптимизация производительности
- Работа с дизайнерами
- Тестирование компонентов',
'$60,000 - $90,000'),

('Customer Support Manager', 'Поддержка', 'Москва', 'full-time',
'Требуется менеджер по работе с клиентами для нашей растущей команды.',
'- Опыт работы в поддержке 2+ года
- Отличные коммуникативные навыки
- Знание английского языка
- Стрессоустойчивость',
'- Обработка запросов клиентов
- Решение проблем пользователей
- Улучшение процессов поддержки
- Обучение новых сотрудников',
'$40,000 - $60,000');

-- Вставляем контакты
INSERT INTO contacts (type, title, value, icon, display_order) VALUES
('email', 'Email поддержки', 'support@invest2026.com', 'Mail', 1),
('email', 'Email для партнеров', 'partners@invest2026.com', 'Mail', 2),
('phone', 'Телефон', '+7 (495) 123-45-67', 'Phone', 3),
('address', 'Офис', 'Москва, ул. Тверская, д. 1', 'MapPin', 4),
('social', 'Telegram', 'https://t.me/invest2026', 'MessageCircle', 5),
('social', 'WhatsApp', 'https://wa.me/74951234567', 'MessageCircle', 6);

-- Вставляем статические страницы
INSERT INTO pages (slug, title, content, meta_description) VALUES
('terms', 'Условия использования', 
'<h2>1. Общие положения</h2>
<p>Настоящие Условия использования регулируют отношения между пользователями и платформой Invest2026.</p>

<h2>2. Регистрация и аккаунт</h2>
<p>Для использования платформы необходимо создать аккаунт и предоставить достоверную информацию.</p>

<h2>3. Инвестиции и риски</h2>
<p>Все инвестиции связаны с рисками. Пользователь несет полную ответственность за свои инвестиционные решения.</p>

<h2>4. Выплаты и комиссии</h2>
<p>Платформа взимает комиссию согласно тарифному плану. Выплаты производятся в соответствии с условиями выбранного плана.</p>

<h2>5. Ответственность</h2>
<p>Платформа не несет ответственности за убытки, возникшие в результате инвестиционной деятельности.</p>',
'Условия использования платформы Invest2026'),

('privacy', 'Политика конфиденциальности',
'<h2>1. Сбор информации</h2>
<p>Мы собираем информацию, которую вы предоставляете при регистрации и использовании платформы.</p>

<h2>2. Использование данных</h2>
<p>Ваши данные используются для предоставления услуг, улучшения платформы и связи с вами.</p>

<h2>3. Защита данных</h2>
<p>Мы используем современные технологии шифрования для защиты ваших данных.</p>

<h2>4. Передача данных третьим лицам</h2>
<p>Мы не передаем ваши данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом.</p>

<h2>5. Cookies</h2>
<p>Мы используем cookies для улучшения работы сайта и анализа трафика.</p>',
'Политика конфиденциальности Invest2026'),

('about', 'О нас',
'<h2>Наша миссия</h2>
<p>Invest2026 - это современная инвестиционная платформа, созданная для того, чтобы сделать инвестиции доступными каждому.</p>

<h2>Наша история</h2>
<p>Основанная в 2025 году командой профессионалов с многолетним опытом в финансах и технологиях, наша платформа быстро стала одной из ведущих в отрасли.</p>

<h2>Наши ценности</h2>
<ul>
<li><strong>Прозрачность</strong> - мы открыты в наших операциях</li>
<li><strong>Безопасность</strong> - защита средств клиентов - наш приоритет</li>
<li><strong>Инновации</strong> - мы используем передовые технологии</li>
<li><strong>Клиентоориентированность</strong> - успех наших клиентов - наш успех</li>
</ul>

<h2>Наши достижения</h2>
<p>За время работы мы помогли тысячам инвесторов достичь их финансовых целей, выплатив более $2.8M в виде прибыли.</p>',
'О платформе Invest2026 - наша миссия и ценности');

-- Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_active ON contacts(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
