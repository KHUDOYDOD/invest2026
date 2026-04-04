const { Pool } = require('pg')

const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
})

async function checkCurrentSettings() {
  try {
    console.log('🔍 Проверяем текущие настройки project launches...')
    
    const result = await pool.query(`
      SELECT 
        id, title, is_launched,
        disable_registration, disable_investments, 
        disable_deposits, disable_withdrawals
      FROM project_launches 
      WHERE is_active = true
      ORDER BY position ASC
    `)
    
    console.log('\n📋 Активные проекты и их настройки:')
    result.rows.forEach(project => {
      console.log(`\n🚀 Проект: ${project.title}`)
      console.log(`   ID: ${project.id}`)
      console.log(`   Запущен: ${project.is_launched}`)
      console.log(`   🚫 Регистрация отключена: ${project.disable_registration}`)
      console.log(`   📈 Инвестиции отключены: ${project.disable_investments}`)
      console.log(`   💰 Пополнение отключено: ${project.disable_deposits}`)
      console.log(`   💸 Вывод отключен: ${project.disable_withdrawals}`)
    })
    
    // Проверим логику: если есть незапущенные проекты с отключенными функциями
    const activeRestrictions = result.rows.filter(p => !p.is_launched)
    
    if (activeRestrictions.length > 0) {
      console.log('\n⚠️ АКТИВНЫЕ ОГРАНИЧЕНИЯ (незапущенные проекты):')
      
      const shouldDisableRegistration = activeRestrictions.some(p => p.disable_registration)
      const shouldDisableInvestments = activeRestrictions.some(p => p.disable_investments)
      const shouldDisableDeposits = activeRestrictions.some(p => p.disable_deposits)
      const shouldDisableWithdrawals = activeRestrictions.some(p => p.disable_withdrawals)
      
      console.log(`   🚫 Регистрация должна быть отключена: ${shouldDisableRegistration}`)
      console.log(`   📈 Инвестиции должны быть отключены: ${shouldDisableInvestments}`)
      console.log(`   💰 Пополнение должно быть отключено: ${shouldDisableDeposits}`)
      console.log(`   💸 Вывод должен быть отключен: ${shouldDisableWithdrawals}`)
    } else {
      console.log('\n✅ Все проекты запущены - ограничения не действуют')
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkCurrentSettings()