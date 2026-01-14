-- Добавляем дополнительные поля для реквизитов вывода средств

-- Добавляем поле для номера карты
ALTER TABLE withdrawal_requests 
ADD COLUMN IF NOT EXISTS card_number VARCHAR(19);

-- Добавляем поле для ФИО владельца карты
ALTER TABLE withdrawal_requests 
ADD COLUMN IF NOT EXISTS card_holder_name VARCHAR(255);

-- Добавляем поле для номера телефона (СБП)
ALTER TABLE withdrawal_requests 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Добавляем поле для ФИО владельца (СБП)
ALTER TABLE withdrawal_requests 
ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(255);

-- Добавляем поле для сети криптовалюты
ALTER TABLE withdrawal_requests 
ADD COLUMN IF NOT EXISTS crypto_network VARCHAR(50);

-- Делаем wallet_address необязательным (может быть NULL для карт и СБП)
ALTER TABLE withdrawal_requests 
ALTER COLUMN wallet_address DROP NOT NULL;

COMMENT ON COLUMN withdrawal_requests.card_number IS 'Номер банковской карты';
COMMENT ON COLUMN withdrawal_requests.card_holder_name IS 'ФИО владельца карты';
COMMENT ON COLUMN withdrawal_requests.phone_number IS 'Номер телефона для СБП';
COMMENT ON COLUMN withdrawal_requests.account_holder_name IS 'ФИО владельца счета (СБП)';
COMMENT ON COLUMN withdrawal_requests.crypto_network IS 'Сеть криптовалюты (trc20, ton и т.д.)';
