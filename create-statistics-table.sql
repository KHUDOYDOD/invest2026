-- Создание таблицы для статистики платформы
CREATE TABLE IF NOT EXISTS platform_statistics (
  id SERIAL PRIMARY KEY,
  users_count INTEGER NOT NULL DEFAULT 15420,
  users_change DECIMAL(5,2) NOT NULL DEFAULT 12.5,
  investments_amount BIGINT NOT NULL DEFAULT 2850000,
  investments_change DECIMAL(5,2) NOT NULL DEFAULT 8.3,
  payouts_amount BIGINT NOT NULL DEFAULT 1920000,
  payouts_change DECIMAL(5,2) NOT NULL DEFAULT 15.7,
  profitability_rate DECIMAL(5,2) NOT NULL DEFAULT 24.8,
  profitability_change DECIMAL(5,2) NOT NULL DEFAULT 3.2,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Вставляем начальные данные
INSERT INTO platform_statistics (
  users_count, 
  users_change, 
  investments_amount, 
  investments_change, 
  payouts_amount, 
  payouts_change, 
  profitability_rate, 
  profitability_change
) VALUES (
  15420,  -- Активные инвесторы
  12.5,   -- Изменение инвесторов %
  2850000, -- Месячные инвестиции ($2.9M)
  8.3,    -- Изменение инвестиций %
  1920000, -- Выплачено прибыли ($1.9M)
  15.7,   -- Изменение выплат %
  24.8,   -- Средняя доходность %
  3.2     -- Изменение доходности %
)
ON CONFLICT DO NOTHING;

-- Создаем индекс для быстрого доступа
CREATE INDEX IF NOT EXISTS idx_statistics_updated_at ON platform_statistics(updated_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE platform_statistics IS 'Статистика платформы для отображения на главной странице';
COMMENT ON COLUMN platform_statistics.users_count IS 'Количество активных инвесторов';
COMMENT ON COLUMN platform_statistics.users_change IS 'Процент изменения количества инвесторов';
COMMENT ON COLUMN platform_statistics.investments_amount IS 'Сумма месячных инвестиций в долларах';
COMMENT ON COLUMN platform_statistics.investments_change IS 'Процент изменения инвестиций';
COMMENT ON COLUMN platform_statistics.payouts_amount IS 'Сумма выплаченной прибыли в долларах';
COMMENT ON COLUMN platform_statistics.payouts_change IS 'Процент изменения выплат';
COMMENT ON COLUMN platform_statistics.profitability_rate IS 'Средняя доходность в процентах';
COMMENT ON COLUMN platform_statistics.profitability_change IS 'Изменение доходности в процентах';
