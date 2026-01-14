const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addSettings() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Добавление настроек внешнего вида и уведомлений...\n');

    // Настройки внешнего вида
    const appearanceSettings = [
      { key: 'primary_color', value: '#3b82f6', type: 'string', category: 'appearance', description: 'Основной цвет сайта' },
      { key: 'secondary_color', value: '#10b981', type: 'string', category: 'appearance', description: 'Вторичный цвет сайта' },
      { key: 'accent_color', value: '#f59e0b', type: 'string', category: 'appearance', description: 'Акцентный цвет' },
      { key: 'dark_mode', value: 'false', type: 'boolean', category: 'appearance', description: 'Темная тема' },
      { key: 'logo_url', value: '/logo.png', type: 'string', category: 'appearance', description: 'URL логотипа' },
      { key: 'favicon_url', value: '/favicon.ico', type: 'string', category: 'appearance', description: 'URL favicon' },
    ];

    // Настройки уведомлений
    const notificationSettings = [
      { key: 'email_notifications', value: 'true', type: 'boolean', category: 'notifications', description: 'Email уведомления' },
      { key: 'sms_notifications', value: 'false', type: 'boolean', category: 'notifications', description: 'SMS уведомления' },
      { key: 'push_notifications', value: 'true', type: 'boolean', category: 'notifications', description: 'Push уведомления' },
      { key: 'deposit_notifications', value: 'true', type: 'boolean', category: 'notifications', description: 'Уведомления о депозитах' },
      { key: 'withdraw_notifications', value: 'true', type: 'boolean', category: 'notifications', description: 'Уведомления о выводах' },
      { key: 'investment_notifications', value: 'true', type: 'boolean', category: 'notifications', description: 'Уведомления об инвестициях' },
    ];

    const allSettings = [...appearanceSettings, ...notificationSettings];

    for (const setting of allSettings) {
      await client.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         ON CONFLICT (setting_key) 
         DO UPDATE SET 
           setting_value = $2,
           setting_type = $3,
           category = $4,
           description = $5,
           updated_at = CURRENT_TIMESTAMP`,
        [setting.key, setting.value, setting.type, setting.category, setting.description]
      );
      console.log(`✅ ${setting.description}: ${setting.value}`);
    }

    console.log('\n✅ Все настройки успешно добавлены!');
    console.log('\n📋 Добавлено настроек:');
    console.log(`   - Внешний вид: ${appearanceSettings.length}`);
    console.log(`   - Уведомления: ${notificationSettings.length}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addSettings();
