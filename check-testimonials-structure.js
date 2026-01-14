const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'investpro',
  password: 'postgres123',
  port: 5432,
});

async function checkTestimonialsTable() {
  try {
    console.log('🔍 Проверяем структуру таблицы testimonials...');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'testimonials'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Структура таблицы testimonials:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Проверим также конкретный отзыв с ID 8
    const testimonialResult = await pool.query('SELECT id, status, user_id FROM testimonials WHERE id = $1', [8]);
    console.log('\n📝 Отзыв с ID 8:', testimonialResult.rows[0] || 'Не найден');
    
    // Проверим все отзывы
    const allTestimonials = await pool.query('SELECT id, status, title FROM testimonials ORDER BY id');
    console.log('\n📋 Все отзывы:');
    allTestimonials.rows.forEach(row => {
      console.log(`  - ID: ${row.id}, Status: ${row.status}, Title: ${row.title}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkTestimonialsTable();