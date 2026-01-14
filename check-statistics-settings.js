const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/invest_platform'
})

async function checkStatisticsSettings() {
  try {
    console.log('📊 Проверка настроек статистики...\n')
    
    const result = await pool.query('SELECT * FROM statistics_settings ORDER BY id DESC LIMIT 1')
    
    if (result.rows.length === 0) {
      console.log('❌ Настройки не найдены!')
      return
    }
    
    const settings = result.rows[0]
    
    console.log('✅ Текущие настройки:')
    console.log('═'.repeat(70))
    console.log(`👥 Активных инвесторов: ${settings.total_users.toLocaleString()} (${settings.users_change > 0 ? '+' : ''}${settings.users_change}%)`)
    console.log(`💰 Общие инвестиции: $${parseFloat(settings.total_invested).toLocaleString()} (${settings.investments_change > 0 ? '+' : ''}${settings.investments_change}%)`)
    console.log(`📈 Выплачено прибыли: $${parseFloat(settings.total_paid).toLocaleString()} (${settings.payouts_change > 0 ? '+' : ''}${settings.payouts_change}%)`)
    console.log(`🏆 Средняя доходность: ${settings.average_return}% (${settings.profitability_change > 0 ? '+' : ''}${settings.profitability_change}%)`)
    console.log('═'.repeat(70))
    console.log(`\n🔧 Режим: ${settings.use_real_data ? '📊 РЕАЛЬНЫЕ ДАННЫЕ из БД' : '⚙️  НАСТРАИВАЕМЫЕ ЗНАЧЕНИЯ'}`)
    console.log(`📅 Обновлено: ${new Date(settings.updated_at).toLocaleString('ru-RU')}`)
    
    if (settings.updated_by) {
      const user = await pool.query('SELECT email FROM users WHERE id = $1', [settings.updated_by])
      if (user.rows.length > 0) {
        console.log(`👤 Кем: ${user.rows[0].email}`)
      }
    }
    
    console.log('\n💡 Для редактирования откройте: http://localhost:3000/admin/statistics')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkStatisticsSettings()
