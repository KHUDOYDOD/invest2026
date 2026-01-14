const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?([^"]+)"?$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const SUPABASE_URL = envVars.SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔌 Создание таблиц через Supabase REST API...');
console.log('📍 URL:', SUPABASE_URL);
console.log('');

// Split into individual table creation statements
const tables = [
  {
    name: 'platform_statistics',
    sql: `
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
INSERT INTO platform_statistics (users_count, users_change, investments_amount, investments_change, payouts_amount, payouts_change, profitability_rate, profitability_change) 
VALUES (15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2) ON CONFLICT DO NOTHING;
CREATE INDEX IF NOT EXISTS idx_platform_statistics_updated_at ON platform_statistics(updated_at DESC);
    `
  },
  {
    name: 'site_settings',
    sql: `
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(50) DEFAULT 'general',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'InvestPro', 'string', 'general', 'Название сайта'),
('site_description', 'Профессиональная инвестиционная платформа', 'string', 'general', 'Описание сайта'),
('contact_email', 'X453925x@gmail.com', 'string', 'general', 'Контактный email'),
('registration_enabled', 'true', 'boolean', 'general', 'Регистрация включена'),
('maintenance_mode', 'false', 'boolean', 'general', 'Режим обслуживания')
ON CONFLICT (setting_key) DO NOTHING;
    `
  },
  {
    name: 'appearance_settings',
    sql: `
CREATE TABLE IF NOT EXISTS appearance_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
INSERT INTO appearance_settings (setting_key, setting_value, setting_type, description) VALUES
('primary_color', '#3b82f6', 'color', 'Основной цвет'),
('secondary_color', '#10b981', 'color', 'Вторичный цвет'),
('dark_mode', 'false', 'boolean', 'Темная тема')
ON CONFLICT (setting_key) DO NOTHING;
    `
  },
  {
    name: 'notification_settings',
    sql: `
CREATE TABLE IF NOT EXISTS notification_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'boolean',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
INSERT INTO notification_settings (setting_key, setting_value, setting_type, description) VALUES
('email_notifications', 'true', 'boolean', 'Email уведомления'),
('push_notifications', 'true', 'boolean', 'Push уведомления')
ON CONFLICT (setting_key) DO NOTHING;
    `
  }
];

async function createTable(table) {
  try {
    // Try to insert data directly using REST API
    console.log(`📝 Создание таблицы ${table.name}...`);
    
    // For now, just show that we need manual execution
    console.log(`   ⚠️  Требуется ручное выполнение SQL`);
    return false;
    
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('⚠️  ВАЖНО: Supabase не поддерживает автоматическое выполнение DDL через REST API\n');
  console.log('📋 Необходимо выполнить SQL вручную:\n');
  console.log('1. Откройте: https://supabase.com/dashboard/project/kdfxytlaxrcrtsxvqilg/sql/new');
  console.log('2. Скопируйте весь SQL из файла: EXECUTE_THIS_IN_SUPABASE.md');
  console.log('3. Вставьте в SQL Editor');
  console.log('4. Нажмите "Run" (Ctrl+Enter)\n');
  console.log('✅ После выполнения все API эндпоинты заработают!\n');
  
  // Check if we can at least verify the connection
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Соединение с Supabase установлено');
      console.log('📊 API доступен и готов к работе\n');
    }
  } catch (error) {
    console.log('❌ Не удалось подключиться к Supabase:', error.message);
  }
}

main();
