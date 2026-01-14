-- Создание супер-администратора (создателя) с ID=1
-- Этот пользователь имеет полный контроль над всей системой

-- Сначала очищаем таблицу пользователей (опционально)
-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Создаем супер-администратора
-- Пароль: SuperAdmin2025! (хешированный с bcrypt)
INSERT INTO users (
    id,
    email,
    password,
    full_name,
    role,
    balance,
    total_invested,
    total_earned,
    referral_code,
    country,
    phone,
    is_verified,
    is_active,
    created_at,
    updated_at
) VALUES (
    1,
    'creator@investpro.com',
    '$2b$10$YourHashedPasswordHere', -- Будет заменен скриптом
    'Создатель Системы',
    'super_admin',
    0.00,
    0.00,
    0.00,
    'CREATOR001',
    'RU',
    '+7 (999) 999-99-99',
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin',
    full_name = 'Создатель Системы',
    is_verified = true,
    is_active = true;

-- Сбрасываем последовательность, чтобы следующий пользователь получил ID=2
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Выводим информацию
SELECT 
    id,
    email,
    full_name,
    role,
    is_verified,
    is_active,
    created_at
FROM users 
WHERE id = 1;

-- Информация о созданном аккаунте
SELECT '✅ Супер-администратор создан!' as status;
SELECT '📧 Email: creator@investpro.com' as email;
SELECT '🔑 Пароль: SuperAdmin2025!' as password;
SELECT '👑 Роль: super_admin (полный контроль)' as role;
SELECT '🆔 ID: 1 (первый пользователь)' as user_id;
