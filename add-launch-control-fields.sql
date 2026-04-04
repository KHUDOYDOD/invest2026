-- Добавляем поля для управления функциями сайта в таблицу project_launches

ALTER TABLE project_launches 
ADD COLUMN IF NOT EXISTS disable_registration BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS disable_investments BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS disable_deposits BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS disable_withdrawals BOOLEAN DEFAULT false;

-- Комментарии для понимания полей
COMMENT ON COLUMN project_launches.disable_registration IS 'Отключить регистрацию до запуска проекта';
COMMENT ON COLUMN project_launches.disable_investments IS 'Отключить создание инвестиций до запуска проекта';
COMMENT ON COLUMN project_launches.disable_deposits IS 'Отключить пополнение до запуска проекта';
COMMENT ON COLUMN project_launches.disable_withdrawals IS 'Отключить вывод средств до запуска проекта';

-- Проверяем структуру таблицы
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'project_launches' 
ORDER BY ordinal_position;