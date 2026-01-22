-- Добавляем поле bank_name в таблицу withdrawal_requests
ALTER TABLE withdrawal_requests ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);

-- Проверяем структуру таблицы
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'withdrawal_requests' 
ORDER BY ordinal_position;