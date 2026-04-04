const { Pool } = require('pg')

const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
})

async function testRestrictions() {
  try {
    console.log('🧪 Тестируем ограничения функций сайта...')
    
    // 1. Включаем все ограничения
    console.log('\n1️⃣ Включаем все ограничения...')
    const updateResult = await pool.query(`
      UPDATE project_launches 
      SET 
        disable_registration = true,
        disable_investments = true,
        disable_deposits = true,
        disable_withdrawals = true,
        is_launched = false,
        updated_at = NOW()
      WHERE is_active = true
      RETURNING id, title, disable_registration, disable_investments, disable_deposits, disable_withdrawals, is_launched
    `)
    
    if (updateResult.rows.length > 0) {
      const project = updateResult.rows[0]
      console.log('✅ Ограничения включены для проекта:', project.title)
      console.log('   🚫 Регистрация отключена:', project.disable_registration)
      console.log('   📈 Инвестиции отключены:', project.disable_investments)
      console.log('   💰 Пополнение отключено:', project.disable_deposits)
      console.log('   💸 Вывод отключен:', project.disable_withdrawals)
      console.log('   🚀 Проект запущен:', project.is_launched)
    }
    
    // 2. Тестируем API статуса
    console.log('\n2️⃣ Тестируем API статуса...')
    const statusResult = await pool.query(`
      SELECT 
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `)
    
    if (statusResult.rows.length > 0) {
      const status = statusResult.rows[0]
      console.log('✅ API статуса вернет:')
      console.log('   registration_enabled:', !status.disable_registration)
      console.log('   investments_enabled:', !status.disable_investments)
      console.log('   deposits_enabled:', !status.disable_deposits)
      console.log('   withdrawals_enabled:', !status.disable_withdrawals)
    } else {
      console.log('⚠️ Нет активных незапущенных проектов - все функции будут включены')
    }
    
    // 3. Тестируем каждое ограничение
    console.log('\n3️⃣ Тестируем ограничения по отдельности...')
    
    // Регистрация
    const regCheck = await pool.query(`
      SELECT disable_registration
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `)
    
    if (regCheck.rows.length > 0 && regCheck.rows[0].disable_registration) {
      console.log('🚫 Регистрация: ОТКЛЮЧЕНА (API вернет 403)')
    } else {
      console.log('✅ Регистрация: ВКЛЮЧЕНА')
    }
    
    // Инвестиции
    const invCheck = await pool.query(`
      SELECT disable_investments
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `)
    
    if (invCheck.rows.length > 0 && invCheck.rows[0].disable_investments) {
      console.log('📈 Инвестиции: ОТКЛЮЧЕНЫ (API вернет 403)')
    } else {
      console.log('✅ Инвестиции: ВКЛЮЧЕНЫ')
    }
    
    // Пополнение
    const depCheck = await pool.query(`
      SELECT disable_deposits
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `)
    
    if (depCheck.rows.length > 0 && depCheck.rows[0].disable_deposits) {
      console.log('💰 Пополнение: ОТКЛЮЧЕНО (API вернет 403)')
    } else {
      console.log('✅ Пополнение: ВКЛЮЧЕНО')
    }
    
    // Вывод
    const withCheck = await pool.query(`
      SELECT disable_withdrawals
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND is_launched = false
      ORDER BY position ASC
      LIMIT 1
    `)
    
    if (withCheck.rows.length > 0 && withCheck.rows[0].disable_withdrawals) {
      console.log('💸 Вывод: ОТКЛЮЧЕН (API вернет 403)')
    } else {
      console.log('✅ Вывод: ВКЛЮЧЕН')
    }
    
    console.log('\n🎯 Теперь попробуйте:')
    console.log('1. Зарегистрировать нового пользователя')
    console.log('2. Создать инвестицию')
    console.log('3. Пополнить баланс')
    console.log('4. Вывести средства')
    console.log('\nВсе эти действия должны быть заблокированы с ошибкой 403!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

testRestrictions()