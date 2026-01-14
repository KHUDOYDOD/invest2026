-- =====================================================
-- ТАБЛИЦЫ ДЛЯ СООБЩЕНИЙ И УВЕДОМЛЕНИЙ
-- =====================================================

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', -- new, replied, pending, closed
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    from_user VARCHAR(255),
    from_email VARCHAR(255),
    admin_reply TEXT,
    replied_by UUID REFERENCES users(id),
    replied_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица уведомлений
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- success, info, warning, error, referral, bonus, transaction, system
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Таблица настроек уведомлений пользователей
CREATE TABLE IF NOT EXISTS notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    deposit_notifications BOOLEAN DEFAULT true,
    withdrawal_notifications BOOLEAN DEFAULT true,
    referral_notifications BOOLEAN DEFAULT true,
    system_notifications BOOLEAN DEFAULT true,
    marketing_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных (опционально, можно удалить в продакшене)
-- Эти данные будут созданы только если таблицы пустые
DO $$
BEGIN
    -- Проверяем, есть ли уже данные
    IF NOT EXISTS (SELECT 1 FROM messages LIMIT 1) THEN
        -- Вставляем примеры сообщений для первого пользователя
        INSERT INTO messages (user_id, subject, message, status, priority, from_user, from_email)
        SELECT 
            id,
            'Добро пожаловать на платформу!',
            'Здравствуйте! Спасибо за регистрацию. Мы рады приветствовать вас на нашей инвестиционной платформе. Если у вас есть вопросы, не стесняйтесь обращаться в службу поддержки.',
            'new',
            'medium',
            'Служба поддержки',
            'support@investpro.com'
        FROM users
        WHERE role_id = 5
        LIMIT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM notifications LIMIT 1) THEN
        -- Вставляем примеры уведомлений для первого пользователя
        INSERT INTO notifications (user_id, type, title, message, icon, color)
        SELECT 
            id,
            'success',
            'Добро пожаловать!',
            'Ваш аккаунт успешно создан. Начните инвестировать прямо сейчас!',
            'CheckCircle2',
            'from-green-500 to-emerald-600'
        FROM users
        WHERE role_id = 5
        LIMIT 1;
    END IF;
END $$;

COMMENT ON TABLE messages IS 'Таблица для хранения сообщений пользователей в службу поддержки';
COMMENT ON TABLE notifications IS 'Таблица для хранения уведомлений пользователей';
COMMENT ON TABLE notification_preferences IS 'Таблица для хранения настроек уведомлений пользователей';
