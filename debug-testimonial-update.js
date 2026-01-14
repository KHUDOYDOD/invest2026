const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

async function debugTestimonialUpdate() {
  try {
    console.log('🔍 Отладка обновления отзыва...');
    
    // Проверим тип поля approved_by
    const columnResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'testimonials' AND column_name = 'approved_by'
    `);
    
    console.log('📊 Поле approved_by:', columnResult.rows[0]);
    
    // Проверим ID админа
    const adminResult = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    console.log('👤 ID админа:', adminResult.rows[0]);
    
    // Попробуем обновить отзыв напрямую
    console.log('\n🔧 Пробуем обновить отзыв напрямую...');
    
    const updateResult = await pool.query(`
      UPDATE testimonials 
      SET 
        status = $1,
        admin_comment = $2,
        approved_by = $3,
        approved_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE NULL END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, status, updated_at
    `, [
      'approved',
      'Тестовый комментарий',
      adminResult.rows[0].id,
      8
    ]);
    
    console.log('✅ Результат обновления:', updateResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    console.error('📋 Детали ошибки:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      position: error.position
    });
  } finally {
    await pool.end();
  }
}

debugTestimonialUpdate();