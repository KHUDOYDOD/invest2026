-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id)
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Добавление тестовых отзывов
INSERT INTO testimonials (user_id, rating, title, content, status, approved_at) VALUES
('04e834cc-95aa-48f3-890c-8f14a9f99c22', 5, 'Отличная платформа для инвестиций', 'Я начал с небольшой суммы и был приятно удивлен стабильностью выплат. Сейчас инвестирую по премиум-плану и полностью доволен результатами.', 'approved', CURRENT_TIMESTAMP),
('8daccb4b-7063-480e-80fb-a6fb05ff83aa', 5, 'Быстрые выплаты и удобный интерфейс', 'Очень удобный личный кабинет и быстрые выплаты. Техподдержка всегда оперативно отвечает на вопросы. Рекомендую эту платформу всем своим знакомым.', 'approved', CURRENT_TIMESTAMP),
('843687e3-69ff-432a-9e00-e1cf1d06532e', 5, 'Надежная инвестиционная платформа', 'За три года сотрудничества не было ни одной задержки выплат. Прозрачные условия и понятная система. Планирую увеличить сумму инвестиций в ближайшее время.', 'approved', CURRENT_TIMESTAMP),
('04e834cc-95aa-48f3-890c-8f14a9f99c22', 4, 'Хорошие условия для начинающих', 'Начинал с базового плана, постепенно перешел на стандартный. Все работает как часы. Единственное пожелание - больше обучающих материалов.', 'approved', CURRENT_TIMESTAMP),
('8daccb4b-7063-480e-80fb-a6fb05ff83aa', 5, 'Профессиональный подход к инвестициям', 'Работаю с платформой уже 2 года. Особенно нравится персональный менеджер на премиум плане. Всегда помогает с вопросами и дает полезные советы.', 'approved', CURRENT_TIMESTAMP),
('843687e3-69ff-432a-9e00-e1cf1d06532e', 5, 'Стабильный пассивный доход', 'Получаю стабильный доход каждый день. Очень удобно, что можно реинвестировать прибыль. За год удалось значительно увеличить капитал.', 'approved', CURRENT_TIMESTAMP),
('04e834cc-95aa-48f3-890c-8f14a9f99c22', 4, 'Отличная техподдержка', 'Когда возникли вопросы по выводу средств, техподдержка решила все очень быстро. Профессиональная команда и качественный сервис.', 'approved', CURRENT_TIMESTAMP);

-- Обновление времени изменения при изменении записи
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_testimonials_updated_at();