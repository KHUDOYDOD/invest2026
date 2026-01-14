-- Создание таблицы для заявок на пополнение
CREATE TABLE IF NOT EXISTS deposit_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  payment_details JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  CONSTRAINT deposit_requests_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Создание таблицы для заявок на вывод
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  wallet_address TEXT NOT NULL,
  fee DECIMAL(15,2) DEFAULT 0,
  final_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  CONSTRAINT withdrawal_requests_status_check CHECK (status IN ('pending', 'completed', 'rejected'))
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_created_at ON deposit_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- Комментарии к таблицам
COMMENT ON TABLE deposit_requests IS 'Заявки пользователей на пополнение баланса';
COMMENT ON TABLE withdrawal_requests IS 'Заявки пользователей на вывод средств';
