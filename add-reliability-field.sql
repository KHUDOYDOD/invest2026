-- Добавляем поле надежности в таблицу статистики
ALTER TABLE platform_statistics 
ADD COLUMN IF NOT EXISTS reliability DECIMAL(5,2) DEFAULT 99.9;

-- Обновляем существующие записи
UPDATE platform_statistics 
SET reliability = 99.9 
WHERE reliability IS NULL;

COMMENT ON COLUMN platform_statistics.reliability IS 'Надежность платформы в процентах';
