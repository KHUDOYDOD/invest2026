const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

async function activateAdmin() {
  try {
    console.log('🔍 Поиск администратора...');
    
    // Ищем админа по email
    const adminResult = await pool.query(
      'SELECT id, email, full_name, is_active, status, role_id FROM users WHERE email = $1',
      ['admin@example.com']
    );

    if (adminResult.rows.length === 0) {
      console.log('❌ Администратор не найден. Создаем нового...');
      
      // Создаем нового админа
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const createResult = await pool.query(`
        INSERT INTO users (
          email, full_name, password_hash, role_id, 
          is_active, status, is_verified, balance, 
          total_invested, total_earned, referral_code,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, 1, 
          true, 'active', true, 0, 
          0, 0, 'ADMIN001',
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING id, email, full_name
      `, ['admin@example.com', 'Администратор', hashedPassword]);
      
      console.log('✅ Новый администратор создан:', createResult.rows[0]);
    } else {
      const admin = adminResult.rows[0];
      console.log('👤 Найден администратор:', admin);
      
      if (!admin.is_active || admin.status !== 'active') {
        console.log('🔧 Активируем администратора...');
        
        // Активируем админа
        await pool.query(`
          UPDATE users 
          SET is_active = true, status = 'active', is_verified = true, updated_at = CURRENT_TIMESTAMP
          WHERE email = $1
        `, ['admin@example.com']);
        
        console.log('✅ Администратор активирован!');
      } else {
        console.log('✅ Администратор уже активен!');
      }
    }
    
    // Проверяем финальное состояние
    const finalResult = await pool.query(
      'SELECT id, email, full_name, is_active, status, role_id FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    console.log('📊 Финальное состояние администратора:');
    console.log(finalResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Ошибка при активации администратора:', error);
  } finally {
    await pool.end();
  }
}

activateAdmin();