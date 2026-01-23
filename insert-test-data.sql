-- Создание тестовых заявок с реквизитами для проверки админ панели

-- 1. СБП заявка с банком
INSERT INTO withdrawal_requests (
  user_id, amount, method, phone_number, account_holder_name, bank_name,
  fee, final_amount, status, created_at
) VALUES (
  1, 200.00, 'sbp', '+79123456789', 'Иван Петров', 'Сбербанк',
  4.00, 196.00, 'pending', NOW()
);

-- 2. Карта заявка с банком
INSERT INTO withdrawal_requests (
  user_id, amount, method, card_number, card_holder_name, bank_name,
  fee, final_amount, status, created_at
) VALUES (
  1, 150.00, 'card', '1234567890123456', 'Петр Иванов', 'ВТБ',
  3.00, 147.00, 'pending', NOW()
);

-- 3. Крипто заявка
INSERT INTO withdrawal_requests (
  user_id, amount, method, wallet_address, crypto_network,
  fee, final_amount, status, created_at
) VALUES (
  1, 300.00, 'crypto', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'bitcoin',
  6.00, 294.00, 'pending', NOW()
);

-- 4. Заявка на пополнение с реквизитами
INSERT INTO deposit_requests (
  user_id, amount, method, payment_details, status, created_at
) VALUES (
  1, 100.00, 'card', 
  '{"card_number": "9876543210987654", "phone_number": "+79987654321", "transaction_hash": "abc123def456ghi789", "bank_name": "Альфа-Банк"}',
  'pending', NOW()
);

-- 5. Еще одна СБП заявка с другим банком
INSERT INTO withdrawal_requests (
  user_id, amount, method, phone_number, account_holder_name, bank_name,
  fee, final_amount, status, created_at
) VALUES (
  1, 250.00, 'sbp', '+79876543210', 'Анна Сидорова', 'Тинькофф',
  5.00, 245.00, 'pending', NOW()
);

-- Проверяем созданные данные
SELECT 'ЗАЯВКИ НА ВЫВОД:' as info;
SELECT id, method, amount, card_number, phone_number, bank_name, wallet_address, status
FROM withdrawal_requests 
WHERE user_id = 1 
ORDER BY created_at DESC;

SELECT 'ЗАЯВКИ НА ПОПОЛНЕНИЕ:' as info;
SELECT id, method, amount, payment_details, status
FROM deposit_requests 
WHERE user_id = 1 
ORDER BY created_at DESC;