-- Проверка и создание тестового пользователя для проверки регистрации

-- Сначала проверим структуру таблицы
\d users

-- Удаляем тестового пользователя если он существует
DELETE FROM users WHERE email = 'test@example.com';

-- Создаем тестового пользователя с хешированным паролем "123456"
INSERT INTO users (
    email,
    password_hash,
    full_name,
    country,
    referral_code,
    balance,
    total_invested,
    total_earned,
    role,
    status,
    created_at
) VALUES (
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Тестовый Пользователь',
    'Россия',
    'REFTEST123',
    0,
    0,
    0,
    'user',
    'active',
    NOW()
);

-- Проверяем что пользователь создан
SELECT id, email, full_name, referral_code, role, status, created_at 
FROM users 
WHERE email = 'test@example.com';

COMMIT;
