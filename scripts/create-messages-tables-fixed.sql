-- =====================================================
-- ТАБЛИЦЫ ДЛЯ СООБЩЕНИЙ И УВЕДОМЛЕНИЙ
-- Исправленная версия для UUID user_id
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
    replied_at TIMESTAMP DEFAULT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    metadata TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP DEFAULT NULL
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Комментарии
COMMENT ON TABLE messages IS 'Таблица для хранения сообщений пользователей в службу поддержки';
COMMENT ON TABLE notifications IS 'Таблица для хранения уведомлений пользователей';
COMMENT ON TABLE notification_preferences IS 'Таблица для хранения настроек уведомлений пользователей';
