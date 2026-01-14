const { Pool } = require('pg');
const fs = require('fs');

// Читаем DATABASE_URL из .env.local
function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    return match ? match[1].trim() : null;
  } catch (error) {
    console.error('❌ Не удалось прочитать .env.local');
    return null;
  }
}

async function setupTables() {
  const databaseUrl = getDatabaseUrl();
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('🔄 Подключение к базе данных...\n');
    
    // Создаем таблицу messages
    console.log('📝 Создание таблицы messages...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        priority VARCHAR(20) DEFAULT 'medium',
        from_user VARCHAR(255),
        from_email VARCHAR(255),
        admin_reply TEXT,
        replied_by INTEGER REFERENCES users(id),
        replied_at TIMESTAMP WITH TIME ZONE,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Таблица messages создана');
    
    // Создаем таблицу notifications
    console.log('📝 Создание таблицы notifications...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(100),
        is_read BOOLEAN DEFAULT false,
        action_url VARCHAR(255),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        read_at TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✅ Таблица notifications создана');
    
    // Создаем таблицу notification_preferences
    console.log('📝 Создание таблицы notification_preferences...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
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
      )
    `);
    console.log('✅ Таблица notification_preferences создана');
    
    // Создаем индексы
    console.log('📝 Создание индексов...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
      
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
    `);
    console.log('✅ Индексы созданы');
    
    // Создаем функцию для автоматического обновления updated_at
    console.log('📝 Создание триггеров...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    await pool.query(`
      DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
      CREATE TRIGGER update_messages_updated_at 
      BEFORE UPDATE ON messages
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
      CREATE TRIGGER update_notification_preferences_updated_at 
      BEFORE UPDATE ON notification_preferences
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Триггеры созданы');
    
    // Проверяем созданные таблицы
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('messages', 'notifications', 'notification_preferences')
      ORDER BY table_name
    `);
    
    console.log('\n📊 Созданные таблицы:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    console.log('\n✅ Все таблицы успешно созданы!');
    console.log('\n🎉 Теперь вы можете использовать:');
    console.log('   - /dashboard/messages - Сообщения');
    console.log('   - /dashboard/notifications - Уведомления');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupTables();
