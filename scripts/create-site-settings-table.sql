-- Удаляем старую таблицу если существует
DROP TABLE IF EXISTS site_settings CASCADE;

-- Создание таблицы настроек сайта
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(20) DEFAULT 'string',
  category VARCHAR(50) DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Вставка начальных настроек
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) VALUES
  ('site_name', 'InvestPro', 'string', 'general', 'Название сайта'),
  ('site_description', 'Профессиональная инвестиционная платформа', 'string', 'general', 'Описание сайта'),
  ('maintenance_mode', 'false', 'boolean', 'general', 'Режим обслуживания'),
  ('registration_enabled', 'true', 'boolean', 'general', 'Разрешить новые регистрации'),
  ('min_deposit', '50', 'number', 'financial', 'Минимальная сумма депозита'),
  ('min_withdrawal', '10', 'number', 'financial', 'Минимальная сумма вывода'),
  ('withdrawal_fee', '0', 'number', 'financial', 'Комиссия за вывод (%)'),
  ('referral_bonus', '10', 'number', 'referral', 'Реферальный бонус (%)'),
  ('email_notifications', 'true', 'boolean', 'notifications', 'Email уведомления'),
  ('sms_notifications', 'false', 'boolean', 'notifications', 'SMS уведомления');

-- Комментарии к таблице
COMMENT ON TABLE site_settings IS 'Настройки сайта и платформы';
COMMENT ON COLUMN site_settings.setting_key IS 'Уникальный ключ настройки';
COMMENT ON COLUMN site_settings.setting_value IS 'Значение настройки (хранится как текст)';
COMMENT ON COLUMN site_settings.setting_type IS 'Тип данных: string, number, boolean, json';
COMMENT ON COLUMN site_settings.category IS 'Категория настройки: general, financial, notifications, etc.';
