-- Таблица для настроек статистики на главной странице
CREATE TABLE IF NOT EXISTS statistics_settings (
  id SERIAL PRIMARY KEY,
  total_users INTEGER DEFAULT 15000,
  total_invested NUMERIC(15, 2) DEFAULT 2800000.00,
  total_paid NUMERIC(15, 2) DEFAULT 1500000.00,
  average_return NUMERIC(5, 2) DEFAULT 24.80,
  users_change NUMERIC(5, 2) DEFAULT 12.50,
  investments_change NUMERIC(5, 2) DEFAULT 8.30,
  payouts_change NUMERIC(5, 2) DEFAULT 15.70,
  profitability_change NUMERIC(5, 2) DEFAULT 2.10,
  use_real_data BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);

-- Вставляем начальные данные
INSERT INTO statistics_settings (
  total_users,
  total_invested,
  total_paid,
  average_return,
  use_real_data
) VALUES (
  15000,
  2800000.00,
  1500000.00,
  24.80,
  FALSE
) ON CONFLICT DO NOTHING;

-- Комментарии
COMMENT ON TABLE statistics_settings IS 'Настройки статистики для главной страницы';
COMMENT ON COLUMN statistics_settings.use_real_data IS 'Использовать реальные данные из БД (TRUE) или настраиваемые значения (FALSE)';
