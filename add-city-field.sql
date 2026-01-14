-- Добавление поля city в таблицу users, если его нет

DO $$ 
BEGIN
    -- Проверяем, существует ли колонка city
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'city'
    ) THEN
        -- Добавляем колонку city
        ALTER TABLE users ADD COLUMN city VARCHAR(100);
        RAISE NOTICE 'Колонка city успешно добавлена в таблицу users';
    ELSE
        RAISE NOTICE 'Колонка city уже существует в таблице users';
    END IF;
END $$;

-- Проверяем результат
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('phone', 'country', 'city')
ORDER BY column_name;
