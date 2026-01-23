-- Создание таблицы для управления проектными запусками
CREATE TABLE IF NOT EXISTS project_launches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
    countdown_end TIMESTAMP WITH TIME ZONE,
    is_launched BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    show_on_site BOOLEAN DEFAULT TRUE,
    show_countdown BOOLEAN DEFAULT TRUE,
    position INTEGER DEFAULT 1,
    icon_type VARCHAR(50) DEFAULT 'rocket',
    background_type VARCHAR(50) DEFAULT 'gradient',
    color_scheme VARCHAR(50) DEFAULT 'blue',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_project_launches_active ON project_launches(is_active, show_on_site);
CREATE INDEX IF NOT EXISTS idx_project_launches_position ON project_launches(position);
CREATE INDEX IF NOT EXISTS idx_project_launches_launch_date ON project_launches(launch_date);

-- Вставляем демо-данные
INSERT INTO project_launches (
    name, 
    title, 
    description, 
    launch_date, 
    countdown_end,
    is_launched, 
    show_countdown,
    icon_type, 
    color_scheme
) VALUES 
(
    'investpro-v2-launch',
    'Запуск InvestPro 2.0',
    'Новая версия нашей инвестиционной платформы с улучшенными функциями и повышенной доходностью!',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days',
    FALSE,
    TRUE,
    'rocket',
    'purple'
),
(
    'new-investment-plans',
    'Новые тарифные планы',
    'Представляем эксклюзивные инвестиционные планы с доходностью до 15% в месяц!',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days',
    FALSE,
    TRUE,
    'trending-up',
    'green'
),
(
    'mobile-app-release',
    'Мобильное приложение',
    'Скоро выйдет наше мобильное приложение для iOS и Android!',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days',
    FALSE,
    TRUE,
    'smartphone',
    'blue'
);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_project_launches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS trigger_update_project_launches_updated_at ON project_launches;
CREATE TRIGGER trigger_update_project_launches_updated_at
    BEFORE UPDATE ON project_launches
    FOR EACH ROW
    EXECUTE FUNCTION update_project_launches_updated_at();