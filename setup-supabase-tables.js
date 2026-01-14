const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Читаем .env.local файл
const envPath = path.join(__dirname, '.env.local');
let connectionString = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
      connectionString = line.split('=')[1].trim().replace(/"/g, '');
      break;
    } else if (line.startsWith('DATABASE_URL=')) {
      connectionString = line.split('=')[1].trim().replace(/"/g, '');
    } else if (line.startsWith('POSTGRES_URL=')) {
      if (!connectionString) {
        connectionString = line.split('=')[1].trim().replace(/"/g, '');
      }
    }
  }
}

if (!connectionString) {
  console.error('❌ Ошибка: Не найдена переменная окружения для подключения к БД');
  console.error('Проверьте файл .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function setupTables() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Начинаем создание таблиц в Supabase...\n');

    // 1. Таблица статистики платформы
    console.log('📊 Создание таблицы platform_statistics...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_statistics (
        id SERIAL PRIMARY KEY,
        users_count INTEGER NOT NULL DEFAULT 15420,
        users_change DECIMAL(5,2) NOT NULL DEFAULT 12.5,
        investments_amount BIGINT NOT NULL DEFAULT 2850000,
        investments_change DECIMAL(5,2) NOT NULL DEFAULT 8.3,
        payouts_amount BIGINT NOT NULL DEFAULT 1920000,
        payouts_change DECIMAL(5,2) NOT NULL DEFAULT 15.7,
        profitability_rate DECIMAL(5,2) NOT NULL DEFAULT 24.8,
        profitability_change DECIMAL(5,2) NOT NULL DEFAULT 3.2,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await client.query(`
      INSERT INTO platform_statistics (
        users_count, users_change, investments_amount, investments_change,
        payouts_amount, payouts_change, profitability_rate, profitability_change
      ) VALUES (
        15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2
      )
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Таблица platform_statistics создана\n');

    // 2. Таблица настроек сайта
    console.log('⚙️  Создание таблицы site_settings...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        setting_type VARCHAR(50) DEFAULT 'string',
        category VARCHAR(50) DEFAULT 'general',
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    const siteSettings = [
      ['site_name', 'InvestPro', 'string', 'general', 'Название сайта'],
      ['site_description', 'Профессиональная инвестиционная платформа', 'string', 'general', 'Описание сайта'],
      ['contact_email', 'X453925x@gmail.com', 'string', 'general', 'Контактный email'],
      ['registration_enabled', 'true', 'boolean', 'general', 'Регистрация включена'],
      ['maintenance_mode', 'false', 'boolean', 'general', 'Режим обслуживания'],
      ['min_deposit', '50', 'number', 'general', 'Минимальная сумма депозита'],
      ['max_deposit', '50000', 'number', 'general', 'Максимальная сумма депозита'],
      ['min_withdraw', '10', 'number', 'general', 'Минимальная сумма вывода'],
      ['withdraw_fee', '2', 'number', 'general', 'Комиссия за вывод (%)'],
      ['referral_bonus', '5', 'number', 'general', 'Реферальный бонус (%)'],
      ['welcome_bonus', '25', 'number', 'general', 'Приветственный бонус']
    ];
    
    for (const [key, value, type, category, description] of siteSettings) {
      await client.query(`
        INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (setting_key) DO NOTHING;
      `, [key, value, type, category, description]);
    }
    console.log('✅ Таблица site_settings создана\n');

    // 3. Таблица настроек внешнего вида
    console.log('🎨 Создание таблицы appearance_settings...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS appearance_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        setting_type VARCHAR(50) DEFAULT 'string',
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    const appearanceSettings = [
      ['primary_color', '#3b82f6', 'color', 'Основной цвет'],
      ['secondary_color', '#10b981', 'color', 'Вторичный цвет'],
      ['accent_color', '#f59e0b', 'color', 'Акцентный цвет'],
      ['dark_mode', 'false', 'boolean', 'Темная тема'],
      ['logo_url', '/logo.png', 'string', 'URL логотипа'],
      ['favicon_url', '/favicon.ico', 'string', 'URL favicon']
    ];
    
    for (const [key, value, type, description] of appearanceSettings) {
      await client.query(`
        INSERT INTO appearance_settings (setting_key, setting_value, setting_type, description) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (setting_key) DO NOTHING;
      `, [key, value, type, description]);
    }
    console.log('✅ Таблица appearance_settings создана\n');

    // 4. Таблица настроек уведомлений
    console.log('🔔 Создание таблицы notification_settings...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        setting_type VARCHAR(50) DEFAULT 'boolean',
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    const notificationSettings = [
      ['email_notifications', 'true', 'boolean', 'Email уведомления'],
      ['sms_notifications', 'false', 'boolean', 'SMS уведомления'],
      ['push_notifications', 'true', 'boolean', 'Push уведомления'],
      ['deposit_notifications', 'true', 'boolean', 'Уведомления о депозитах'],
      ['withdraw_notifications', 'true', 'boolean', 'Уведомления о выводах'],
      ['investment_notifications', 'true', 'boolean', 'Уведомления об инвестициях']
    ];
    
    for (const [key, value, type, description] of notificationSettings) {
      await client.query(`
        INSERT INTO notification_settings (setting_key, setting_value, setting_type, description) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (setting_key) DO NOTHING;
      `, [key, value, type, description]);
    }
    console.log('✅ Таблица notification_settings создана\n');

    // 5. Таблица отзывов
    console.log('💬 Создание таблицы testimonials...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        admin_comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        approved_at TIMESTAMP WITH TIME ZONE,
        approved_by UUID REFERENCES users(id)
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);
      CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
      CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
    `);
    console.log('✅ Таблица testimonials создана\n');

    // 6. Таблица сообщений
    console.log('📧 Создание таблицы messages...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
        admin_reply TEXT,
        replied_at TIMESTAMP WITH TIME ZONE,
        replied_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
    `);
    console.log('✅ Таблица messages создана\n');

    // 7. Таблица уведомлений пользователей
    console.log('🔔 Создание таблицы user_notifications...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
        is_read BOOLEAN DEFAULT false,
        link VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
      CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at DESC);
    `);
    console.log('✅ Таблица user_notifications создана\n');

    // 8. Таблица настроек уведомлений пользователей
    console.log('⚙️  Создание таблицы user_notification_preferences...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_notification_preferences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        email_notifications BOOLEAN DEFAULT true,
        sms_notifications BOOLEAN DEFAULT false,
        push_notifications BOOLEAN DEFAULT true,
        deposit_notifications BOOLEAN DEFAULT true,
        withdraw_notifications BOOLEAN DEFAULT true,
        investment_notifications BOOLEAN DEFAULT true,
        news_notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
    `);
    console.log('✅ Таблица user_notification_preferences создана\n');

    // Создание функции и триггеров для updated_at
    console.log('🔧 Создание функций и триггеров...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $ language 'plpgsql';
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
      CREATE TRIGGER update_testimonials_updated_at
          BEFORE UPDATE ON testimonials
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
      CREATE TRIGGER update_messages_updated_at
          BEFORE UPDATE ON messages
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_user_notification_preferences_updated_at ON user_notification_preferences;
      CREATE TRIGGER update_user_notification_preferences_updated_at
          BEFORE UPDATE ON user_notification_preferences
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Функции и триггеры созданы\n');

    // Проверка созданных таблиц
    console.log('🔍 Проверка созданных таблиц...');
    const result = await client.query(`
      SELECT 
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name IN (
              'platform_statistics',
              'site_settings',
              'appearance_settings',
              'notification_settings',
              'testimonials',
              'messages',
              'user_notifications',
              'user_notification_preferences'
          )
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Созданные таблицы:');
    console.table(result.rows);

    console.log('\n🎉 Все таблицы успешно созданы!');
    console.log('\n✅ Теперь можно проверить API эндпоинты:');
    console.log('   - https://invest2025-main.vercel.app/api/statistics');
    console.log('   - https://invest2025-main.vercel.app/api/settings/site');
    console.log('   - https://invest2025-main.vercel.app/api/testimonials');
    
  } catch (error) {
    console.error('\n❌ Ошибка при создании таблиц:', error.message);
    console.error('\nПодробности:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Запуск скрипта
setupTables().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});
