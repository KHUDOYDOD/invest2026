-- Добавляем недостающие поля в таблицу users для профиля

-- Добавляем поля если их нет
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earned DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Генерируем реферальные коды для существующих пользователей
UPDATE users 
SET referral_code = 'REF' || LPAD(id::TEXT, 6, '0')
WHERE referral_code IS NULL;

-- Создаем индекс для реферального кода
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);

-- Обновляем поле role на основе role_id если оно существует
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role_id') THEN
        UPDATE users SET role = CASE 
            WHEN role_id = 1 THEN 'admin'
            WHEN role_id = 2 THEN 'user'
            ELSE 'user'
        END
        WHERE role IS NULL OR role = 'user';
    END IF;
END $$;

-- Копируем total_profit в total_earned если total_earned пустой
UPDATE users 
SET total_earned = COALESCE(total_profit, 0)
WHERE total_earned = 0 AND total_profit IS NOT NULL;

COMMIT;
