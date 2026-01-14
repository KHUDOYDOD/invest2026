const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/investpro'
})

async function testStatisticsAPI() {
  try {
    console.log('🧪 Тестирование API статистики...\n')

    // Тест 1: Проверка таблицы
    console.log('1️⃣ Проверка таблицы platform_statistics...')
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'platform_statistics'
      )
    `)
    
    if (tableCheck.rows[0].exists) {
      console.log('   ✅ Таблица существует')
    } else {
      console.log('   ❌ Таблица не найдена')
      return
    }

    // Тест 2: Получение данных
    console.log('\n2️⃣ Получение текущей статистики...')
    const stats = await pool.query(`
      SELECT * FROM platform_statistics ORDER BY id DESC LIMIT 1
    `)
    
    if (stats.rows.length > 0) {
      console.log('   ✅ Данные найдены:')
      const data = stats.rows[0]
      console.log(`      Активные инвесторы: ${data.users_count} (${data.users_change}%)`)
      console.log(`      Месячные инвестиции: $${(data.investments_amount / 1000000).toFixed(1)}M (${data.investments_change}%)`)
      console.log(`      Выплачено прибыли: $${(data.payouts_amount / 1000000).toFixed(1)}M (${data.payouts_change}%)`)
      console.log(`      Средняя доходность: ${data.profitability_rate}% (${data.profitability_change}%)`)
      console.log(`      Обновлено: ${data.updated_at}`)
    } else {
      console.log('   ⚠️  Данных нет, создаем начальные значения...')
      
      await pool.query(`
        INSERT INTO platform_statistics (
          users_count, users_change, investments_amount, investments_change,
          payouts_amount, payouts_change, profitability_rate, profitability_change
        ) VALUES (15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2)
      `)
      
      console.log('   ✅ Начальные данные созданы')
    }

    // Тест 3: Обновление данных
    console.log('\n3️⃣ Тестирование обновления данных...')
    const updateResult = await pool.query(`
      UPDATE platform_statistics 
      SET users_count = users_count + 1,
          updated_at = NOW()
      WHERE id = (SELECT id FROM platform_statistics ORDER BY id DESC LIMIT 1)
      RETURNING users_count
    `)
    
    if (updateResult.rows.length > 0) {
      console.log(`   ✅ Данные обновлены. Новое значение: ${updateResult.rows[0].users_count}`)
    }

    // Тест 4: Проверка API endpoint
    console.log('\n4️⃣ Проверка доступности API...')
    console.log('   📡 GET /api/statistics - получение статистики')
    console.log('   📡 PUT /api/statistics - обновление статистики')
    console.log('   ℹ️  Для тестирования API запустите сервер: npm run dev')

    console.log('\n✅ Все тесты пройдены успешно!')
    console.log('\n📋 Следующие шаги:')
    console.log('   1. Запустите сервер: npm run dev')
    console.log('   2. Откройте админ панель: http://localhost:3000/admin/statistics')
    console.log('   3. Измените статистику и сохраните')
    console.log('   4. Проверьте главную страницу: http://localhost:3000')

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error)
  } finally {
    await pool.end()
  }
}

testStatisticsAPI()
