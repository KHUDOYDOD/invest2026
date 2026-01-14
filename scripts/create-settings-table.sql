-- Создание таблицы настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных настроек
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) VALUES
-- Общие настройки
('site_name', 'InvestPro', 'string', 'general', 'Название сайта'),
('site_description', 'Инвестиционная платформа', 'string', 'general', 'Описание сайта'),
('contact_email', 'X453925x@gmail.com', 'string', 'general', 'Контактный email'),
('registration_enabled', 'true', 'boolean', 'general', 'Разрешить регистрацию'),
('maintenance_mode', 'false', 'boolean', 'general', 'Режим обслуживания'),
('min_deposit', '50', 'number', 'general', 'Минимальный депозит'),
('max_deposit', '50000', 'number', 'general', 'Максимальный депозит'),
('min_withdraw', '10', 'number', 'general', 'Минимальный вывод'),
('withdraw_fee', '2', 'number', 'general', 'Комиссия за вывод (%)'),
('referral_bonus', '5', 'number', 'general', 'Реферальный бонус (%)'),
('welcome_bonus', '25', 'number', 'general', 'Приветственный бонус'),

-- Настройки внешнего вида
('primary_color', '#3b82f6', 'string', 'appearance', 'Основной цвет'),
('secondary_color', '#10b981', 'string', 'appearance', 'Вторичный цвет'),
('accent_color', '#f59e0b', 'string', 'appearance', 'Акцентный цвет'),
('dark_mode', 'false', 'boolean', 'appearance', 'Темная тема по умолчанию'),
('logo_url', '/logo.png', 'string', 'appearance', 'URL логотипа'),
('favicon_url', '/favicon.ico', 'string', 'appearance', 'URL favicon'),

-- Настройки уведомлений
('email_notifications', 'true', 'boolean', 'notifications', 'Email уведомления'),
('sms_notifications', 'false', 'boolean', 'notifications', 'SMS уведомления'),
('push_notifications', 'true', 'boolean', 'notifications', 'Push уведомления'),
('deposit_notifications', 'true', 'boolean', 'notifications', 'Уведомления о депозитах'),
('withdraw_notifications', 'true', 'boolean', 'notifications', 'Уведомления о выводах'),
('investment_notifications', 'true', 'boolean', 'notifications', 'Уведомления об инвестициях')
ON CONFLICT (setting_key) DO NOTHING;

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings(setting_key);
