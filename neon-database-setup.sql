-- =====================================================
-- БАЗА ДАННЫХ ДЛЯ NEON POSTGRESQL
-- =====================================================
-- Скопируйте этот файл целиком и выполните в Neon SQL Editor
-- https://console.neon.tech → SQL Editor → Paste → Run

-- Удаляем существующие таблицы если они есть
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS user_notifications CASCADE;
DROP TABLE IF EXISTS user_notification_preferences CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS platform_statistics CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS appearance_settings CASCADE;
DROP TABLE IF EXISTS notification_settings CASCADE;

-- =====================================================
-- СОЗДАНИЕ ТАБЛИЦ
-- =====================================================

-- Таблица ролей
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_earned DECIMAL(15,2) DEFAULT 0.00,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    referral_count INTEGER DEFAULT 0,
    role_id INTEGER REFERENCES user_roles(id) DEFAULT 5,
    login VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица инвестиционных планов
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL,
    total_return DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    features TEXT[] DEFAULT '{}',
    description TEXT,
    risk_level VARCHAR(50),
    recommended_for TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица инвестиций
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES investment_plans(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица транзакций
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Таблица запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Таблица статистики платформы
CREATE TABLE platform_statistics (
  id SERIAL PRIMARY KEY,
  users_count INTEGER NOT NULL DEFAULT 15420,
  users_change DECIMAL(5,2) NOT NULL DEFAULT 12.5,
  investments_amount BIGINT NOT NULL DEFAULT 2850000,
  investments_change DECIMAL(5,2) NOT NULL DEFAULT 8.3,
  payouts_amount BIGINT NOT NULL DEFAULT 1920000,
  payouts_change DECIMAL(5,2) NOT NULL DEFAULT 15.7,
  profitability_rate DECIMAL(5,2) NOT NULL DEFAULT 24.8,
  profitability_change DECIMAL(5,2) NOT NULL DEFAULT 3.2,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек сайта
CREATE TABLE site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(50) DEFAULT 'general',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек внешнего вида
CREATE TABLE appearance_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек уведомлений
CREATE TABLE notification_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'boolean',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица отзывов
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id)
);

-- Таблица сообщений
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    admin_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица уведомлений пользователей
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек уведомлений пользователей
CREATE TABLE user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    deposit_notifications BOOLEAN DEFAULT true,
    withdraw_notifications BOOLEAN DEFAULT true,
    investment_notifications BOOLEAN DEFAULT true,
    news_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- СОЗДАНИЕ ИНДЕКСОВ
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);

-- =====================================================
-- ВСТАВКА НАЧАЛЬНЫХ ДАННЫХ
-- =====================================================

-- Роли
INSERT INTO user_roles (name, display_name, description, permissions) VALUES
('super_admin', 'Супер Администратор', 'Полный доступ', '{"admin": true, "users": true, "finance": true}'),
('admin', 'Администратор', 'Доступ к админ панели', '{"admin": true, "users": true}'),
('moderator', 'Модератор', 'Модерация контента', '{"admin": false, "users": true}'),
('vip', 'VIP Пользователь', 'Премиум функции', '{"admin": false}'),
('user', 'Пользователь', 'Стандартный пользователь', '{"admin": false}');

-- Администратор (пароль: X12345x)
INSERT INTO users (
  id, login, email, full_name, password_hash, phone, country, 
  is_verified, is_active, balance, referral_code, role_id, status
) VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'admin', 
  'admin@example.com', 
  'Главный Администратор', 
  '$2b$10$YourHashedPasswordHere', 
  '+7900000001', 
  'Russia', 
  true, 
  true, 
  100000.00, 
  'ADMIN001', 
  1, 
  'active'
);

-- Инвестиционные планы
INSERT INTO investment_plans (
    name, min_amount, max_amount, daily_percent, duration, total_return, 
    is_active, features, description, risk_level, recommended_for
) VALUES
(
    'Стартер', 100, 499, 3.0, 30, 90,
    true, 
    ARRAY['Ежедневные выплаты 3%', 'Поддержка 24/7', 'Мобильное приложение'],
    'Идеальный план для начинающих инвесторов', 
    'Низкий', 
    'Новички в инвестировании'
),
(
    'Профессионал', 500, 999, 5.0, 30, 150,
    true, 
    ARRAY['Ежедневные выплаты 5%', 'Персональный менеджер', 'Приоритетная поддержка'],
    'Сбалансированный план для опытных инвесторов', 
    'Средний', 
    'Опытные инвесторы'
),
(
    'Премиум', 1000, 10000, 8.0, 30, 240,
    true, 
    ARRAY['Ежедневные выплаты 8%', 'VIP поддержка', 'Эксклюзивные сигналы'],
    'Высокодоходный план для серьезных инвесторов', 
    'Высокий', 
    'Профессиональные инвесторы'
),
(
    'VIP', 10000, 50000, 12.0, 30, 360,
    true, 
    ARRAY['Максимальная доходность 12%', 'Индивидуальный подход'],
    'Эксклюзивный план для крупных инвесторов', 
    'Очень высокий', 
    'Крупные инвесторы'
);

-- Статистика
INSERT INTO platform_statistics (
  users_count, users_change, investments_amount, investments_change,
  payouts_amount, payouts_change, profitability_rate, profitability_change
) VALUES (
  15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2
);

-- Настройки сайта
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'InvestPro', 'string', 'general', 'Название сайта'),
('site_description', 'Профессиональная инвестиционная платформа', 'string', 'general', 'Описание'),
('contact_email', 'X453925x@gmail.com', 'string', 'general', 'Контактный email'),
('registration_enabled', 'true', 'boolean', 'general', 'Регистрация включена'),
('min_deposit', '50', 'number', 'general', 'Минимальная сумма депозита'),
('max_deposit', '50000', 'number', 'general', 'Максимальная сумма депозита'),
('min_withdraw', '10', 'number', 'general', 'Минимальная сумма вывода'),
('withdraw_fee', '2', 'number', 'general', 'Комиссия за вывод (%)'),
('referral_bonus', '5', 'number', 'general', 'Реферальный бонус (%)');

-- Настройки внешнего вида
INSERT INTO appearance_settings (setting_key, setting_value, setting_type, description) VALUES
('primary_color', '#3b82f6', 'color', 'Основной цвет'),
('secondary_color', '#10b981', 'color', 'Вторичный цвет'),
('dark_mode', 'false', 'boolean', 'Темная тема');

-- Настройки уведомлений
INSERT INTO notification_settings (setting_key, setting_value, setting_type, description) VALUES
('email_notifications', 'true', 'boolean', 'Email уведомления'),
('push_notifications', 'true', 'boolean', 'Push уведомления'),
('deposit_notifications', 'true', 'boolean', 'Уведомления о депозитах');

-- =====================================================
-- ГОТОВО! ✅
-- =====================================================
-- Все таблицы созданы и заполнены начальными данными
-- Теперь можно деплоить на Render!
