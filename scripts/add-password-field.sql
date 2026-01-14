-- Добавляем поле password_hash если его нет
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Устанавливаем временный пароль для существующих пользователей без пароля
-- Хеш для пароля "123456" (bcrypt)
UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE password_hash IS NULL OR password_hash = '';

COMMIT;
