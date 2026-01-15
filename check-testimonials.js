const { Pool } = require('pg');

async function checkTestimonials() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  });

  try {
    console.log('🔄 Проверка отзывов...\n');
    
    const result = await pool.query(`
      SELECT 
        t.id,
        t.rating,
        t.title,
        t.status,
        u.full_name
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    
    console.log(`📊 Всего отзывов: ${result.rows.length}\n`);
    
    result.rows.forEach(row => {
      const statusEmoji = row.status === 'approved' ? '✅' : '⏳';
      console.log(`${statusEmoji} ${row.title}`);
      console.log(`   От: ${row.full_name}`);
      console.log(`   Рейтинг: ${'⭐'.repeat(row.rating)}`);
      console.log(`   Статус: ${row.status}`);
      console.log('');
    });
    
    const approvedCount = result.rows.filter(r => r.status === 'approved').length;
    console.log(`✅ Одобренных отзывов: ${approvedCount}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

checkTestimonials();
