-- Скрипт для очистки демо-данных и подготовки базы данных к продакшену
-- Выполните этот скрипт перед запуском в продакшене

-- Удаляем все демо-данные из таблиц (сохраняем структуру)
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE investments CASCADE;
TRUNCATE TABLE deposit_requests CASCADE;
TRUNCATE TABLE withdrawal_requests CASCADE;
TRUNCATE TABLE referrals CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE support_messages CASCADE;
TRUNCATE TABLE user_activity CASCADE;
TRUNCATE TABLE testimonials CASCADE;
TRUNCATE TABLE news CASCADE;

-- Удаляем всех демо-пользователей (оставляем только админа если нужно)
-- ВНИМАНИЕ: Раскомментируйте следующую строку, если хотите удалить ВСЕХ пользователей
-- DELETE FROM users WHERE email != 'admin@investpro.com';

-- Или удалите всех пользователей кроме вашего админа
-- DELETE FROM users WHERE role != 'admin';

-- Сбрасываем счетчики автоинкремента
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE investments_id_seq RESTART WITH 1;
ALTER SEQUENCE deposit_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE withdrawal_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE notifications_id_seq RESTART WITH 1;
ALTER SEQUENCE support_messages_id_seq RESTART WITH 1;
ALTER SEQUENCE testimonials_id_seq RESTART WITH 1;
ALTER SEQUENCE news_id_seq RESTART WITH 1;

-- Обновляем статистику
VACUUM ANALYZE;

-- Выводим информацию о результатах
SELECT 'База данных очищена от демо-данных!' as status;
SELECT 'Пользователей в системе: ' || COUNT(*) as users_count FROM users;
SELECT 'Транзакций в системе: ' || COUNT(*) as transactions_count FROM transactions;
SELECT 'Инвестиций в системе: ' || COUNT(*) as investments_count FROM investments;
