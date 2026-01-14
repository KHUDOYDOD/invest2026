-- Проверка структуры таблицы users

\echo '========================================='
\echo 'Структура таблицы users:'
\echo '========================================='
\d users

\echo ''
\echo '========================================='
\echo 'Список всех пользователей:'
\echo '========================================='
SELECT 
    id,
    email,
    full_name,
    CASE WHEN password_hash IS NOT NULL THEN 'Есть' ELSE 'НЕТ!' END as password,
    referral_code,
    role,
    status,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

\echo ''
\echo '========================================='
\echo 'Проверка завершена'
\echo '========================================='
