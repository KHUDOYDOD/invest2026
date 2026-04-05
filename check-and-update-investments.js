const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function checkAndUpdateInvestments() {
  try {
    console.log('🔍 Проверка структуры таблицы investments...\n');
    
    // Проверяем структуру таблицы
    const structureResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'investments'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Колонки таблицы investments:');
    structureResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n🔍 Проверка всех инвестиций...\n');
    
    // Получаем все инвестиции с деталями
    const investmentsResult = await pool.query(`
      SELECT 
        i.id,
        i.user_id,
        i.amount,
        i.status,
        i.created_at,
        i.start_date,
        i.end_date,
        ip.name as plan_name,
        ip.duration as duration_days,
        CASE 
          WHEN i.end_date IS NOT NULL THEN i.end_date
          WHEN i.start_date IS NOT NULL THEN i.start_date + INTERVAL '1 day' * ip.duration
          ELSE i.created_at + INTERVAL '1 day' * ip.duration
        END as calculated_end_date,
        CASE 
          WHEN i.end_date IS NOT NULL THEN (i.end_date <= NOW())
          WHEN i.start_date IS NOT NULL THEN (i.start_date + INTERVAL '1 day' * ip.duration <= NOW())
          ELSE (i.created_at + INTERVAL '1 day' * ip.duration <= NOW())
        END as should_be_completed
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      ORDER BY i.created_at DESC
    `);
    
    console.log(`📊 Найдено инвестиций: ${investmentsResult.rows.length}\n`);
    
    investmentsResult.rows.forEach((inv, index) => {
      const endDate = inv.end_date || inv.calculated_end_date;
      const daysLeft = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
      
      console.log(`${index + 1}. ID: ${inv.id}`);
      console.log(`   План: ${inv.plan_name}`);
      console.log(`   Сумма: $${inv.amount}`);
      console.log(`   Статус: ${inv.status}`);
      console.log(`   Создано: ${new Date(inv.created_at).toLocaleString('ru-RU')}`);
      console.log(`   Дата начала: ${inv.start_date ? new Date(inv.start_date).toLocaleString('ru-RU') : 'не указана'}`);
      console.log(`   Дата окончания: ${inv.end_date ? new Date(inv.end_date).toLocaleString('ru-RU') : 'не указана'}`);
      console.log(`   Расчетная дата окончания: ${new Date(endDate).toLocaleString('ru-RU')}`);
      console.log(`   Срок (дней): ${inv.duration_days}`);
      console.log(`   Осталось дней: ${daysLeft}`);
      console.log(`   Должна быть завершена: ${inv.should_be_completed ? '✅ ДА' : '❌ НЕТ'}`);
      
      if (inv.status === 'active' && inv.should_be_completed) {
        console.log(`   ⚠️  ТРЕБУЕТСЯ ОБНОВЛЕНИЕ СТАТУСА!`);
      }
      
      console.log('');
    });
    
    // Подсчитываем инвестиции, требующие обновления
    const needUpdate = investmentsResult.rows.filter(inv => 
      inv.status === 'active' && inv.should_be_completed
    );
    
    if (needUpdate.length > 0) {
      console.log(`\n⚠️  Найдено ${needUpdate.length} инвестиций, требующих обновления статуса\n`);
      
      console.log('🔄 Обновляем статусы...\n');
      
      // Обновляем статусы
      const updateResult = await pool.query(`
        UPDATE investments i
        SET status = 'completed'
        FROM investment_plans ip
        WHERE i.plan_id = ip.id
        AND i.status = 'active'
        AND (
          (i.end_date IS NOT NULL AND i.end_date <= NOW())
          OR (i.start_date IS NOT NULL AND i.start_date + INTERVAL '1 day' * ip.duration <= NOW())
          OR (i.end_date IS NULL AND i.start_date IS NULL AND i.created_at + INTERVAL '1 day' * ip.duration <= NOW())
        )
        RETURNING i.id, i.status
      `);
      
      console.log(`✅ Обновлено инвестиций: ${updateResult.rowCount}`);
      
      if (updateResult.rowCount > 0) {
        console.log('\nОбновленные инвестиции:');
        updateResult.rows.forEach(row => {
          console.log(`  - ID: ${row.id}, новый статус: ${row.status}`);
        });
      }
    } else {
      console.log('✅ Все инвестиции имеют корректный статус\n');
    }
    
    // Показываем итоговую статистику
    console.log('\n📊 Итоговая статистика:');
    const statsResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM investments
      GROUP BY status
      ORDER BY status
    `);
    
    statsResult.rows.forEach(stat => {
      console.log(`  ${stat.status}: ${stat.count} инвестиций, $${parseFloat(stat.total_amount).toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

checkAndUpdateInvestments();
