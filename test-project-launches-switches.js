const { Pool } = require('pg')

// Используем Neon DATABASE_URL напрямую
const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
})

async function testSwitches() {
  try {
    console.log('🧪 Тестируем переключатели project launches...')
    
    // 1. Получаем текущие данные
    console.log('\n1️⃣ Получаем текущие данные:')
    const currentData = await pool.query('SELECT id, title, disable_registration, disable_investments, disable_deposits, disable_withdrawals FROM project_launches LIMIT 1')
    
    if (currentData.rows.length === 0) {
      console.log('❌ Нет записей в таблице project_launches')
      return
    }
    
    const record = currentData.rows[0]
    console.log('ID:', record.id)
    console.log('Title:', record.title)
    console.log('disable_registration:', record.disable_registration)
    console.log('disable_investments:', record.disable_investments)
    console.log('disable_deposits:', record.disable_deposits)
    console.log('disable_withdrawals:', record.disable_withdrawals)
    
    // 2. Обновляем переключатели
    console.log('\n2️⃣ Обновляем переключатели (включаем все отключения):')
    const updateResult = await pool.query(`
      UPDATE project_launches 
      SET 
        disable_registration = true,
        disable_investments = true,
        disable_deposits = true,
        disable_withdrawals = true,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, title, disable_registration, disable_investments, disable_deposits, disable_withdrawals
    `, [record.id])
    
    const updatedRecord = updateResult.rows[0]
    console.log('✅ Обновлено:')
    console.log('disable_registration:', updatedRecord.disable_registration)
    console.log('disable_investments:', updatedRecord.disable_investments)
    console.log('disable_deposits:', updatedRecord.disable_deposits)
    console.log('disable_withdrawals:', updatedRecord.disable_withdrawals)
    
    // 3. Проверяем через API
    console.log('\n3️⃣ Тестируем API endpoint:')
    
    // Имитируем PUT запрос
    const apiUpdateData = {
      id: record.id,
      name: 'test-project',
      title: updatedRecord.title,
      description: 'Test description',
      launch_date: new Date().toISOString(),
      countdown_end: new Date(Date.now() + 24*60*60*1000).toISOString(),
      is_launched: false,
      show_countdown: true,
      icon_type: 'rocket',
      color_scheme: 'blue',
      position: 1,
      disable_registration: false, // Выключаем обратно
      disable_investments: false,
      disable_deposits: false,
      disable_withdrawals: false
    }
    
    const apiResult = await pool.query(`
      UPDATE project_launches 
      SET 
        name = $2,
        title = $3,
        description = $4,
        launch_date = $5,
        countdown_end = $6,
        is_launched = $7,
        show_countdown = $8,
        icon_type = $9,
        color_scheme = $10,
        position = $11,
        disable_registration = $12,
        disable_investments = $13,
        disable_deposits = $14,
        disable_withdrawals = $15,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      apiUpdateData.id,
      apiUpdateData.name,
      apiUpdateData.title,
      apiUpdateData.description,
      apiUpdateData.launch_date,
      apiUpdateData.countdown_end,
      apiUpdateData.is_launched,
      apiUpdateData.show_countdown,
      apiUpdateData.icon_type,
      apiUpdateData.color_scheme,
      apiUpdateData.position,
      apiUpdateData.disable_registration,
      apiUpdateData.disable_investments,
      apiUpdateData.disable_deposits,
      apiUpdateData.disable_withdrawals
    ])
    
    const finalRecord = apiResult.rows[0]
    console.log('✅ Результат API обновления:')
    console.log('disable_registration:', finalRecord.disable_registration)
    console.log('disable_investments:', finalRecord.disable_investments)
    console.log('disable_deposits:', finalRecord.disable_deposits)
    console.log('disable_withdrawals:', finalRecord.disable_withdrawals)
    
    // 4. Финальная проверка
    console.log('\n4️⃣ Финальная проверка через GET:')
    const finalCheck = await pool.query(`
      SELECT 
        id, name, title, description, 
        launch_date, countdown_end, is_launched, 
        is_active, show_on_site, show_countdown,
        position, icon_type, background_type, color_scheme,
        disable_registration, disable_investments, 
        disable_deposits, disable_withdrawals,
        created_at, updated_at
      FROM project_launches 
      WHERE id = $1
    `, [record.id])
    
    const finalData = finalCheck.rows[0]
    console.log('✅ Финальные данные:')
    console.log(JSON.stringify({
      id: finalData.id,
      title: finalData.title,
      disable_registration: finalData.disable_registration,
      disable_investments: finalData.disable_investments,
      disable_deposits: finalData.disable_deposits,
      disable_withdrawals: finalData.disable_withdrawals
    }, null, 2))
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

testSwitches()