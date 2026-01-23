import { query } from '@/lib/database'

export async function updateStatistics() {
  try {
    console.log('🔄 Обновляем статистику...')
    
    // Получаем реальные данные из базы
    const [usersResult, investmentsResult, payoutsResult] = await Promise.all([
      // Количество пользователей
      query('SELECT COUNT(*) as count FROM users'),
      
      // Сумма инвестиций
      query(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'investment' AND status = 'completed'
      `),
      
      // Сумма выплат
      query(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'withdrawal' AND status = 'completed'
      `)
    ])

    const usersCount = parseInt(usersResult.rows[0].count)
    const investmentsAmount = parseFloat(investmentsResult.rows[0].total_amount)
    const payoutsAmount = parseFloat(payoutsResult.rows[0].total_amount)
    
    // Рассчитываем доходность (выплаты / инвестиции * 100)
    const profitabilityRate = investmentsAmount > 0 ? 
      ((payoutsAmount / investmentsAmount) * 100) : 0

    // Получаем предыдущие значения для расчета изменений
    const prevStatsResult = await query(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `)

    let usersChange = 0
    let investmentsChange = 0
    let payoutsChange = 0
    let profitabilityChange = 0

    if (prevStatsResult.rows.length > 0) {
      const prev = prevStatsResult.rows[0]
      
      // Рассчитываем процентные изменения
      usersChange = prev.users_count > 0 ? 
        ((usersCount - prev.users_count) / prev.users_count * 100) : 0
      
      investmentsChange = prev.investments_amount > 0 ? 
        ((investmentsAmount - prev.investments_amount) / prev.investments_amount * 100) : 0
      
      payoutsChange = prev.payouts_amount > 0 ? 
        ((payoutsAmount - prev.payouts_amount) / prev.payouts_amount * 100) : 0
      
      profitabilityChange = prev.profitability_rate > 0 ? 
        ((profitabilityRate - prev.profitability_rate) / prev.profitability_rate * 100) : 0
    }

    // Обновляем или создаем запись статистики
    const checkResult = await query('SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1')
    
    if (checkResult.rows.length > 0) {
      // Обновляем существующую запись
      await query(`
        UPDATE platform_statistics SET
          users_count = $1,
          users_change = $2,
          investments_amount = $3,
          investments_change = $4,
          payouts_amount = $5,
          payouts_change = $6,
          profitability_rate = $7,
          profitability_change = $8,
          updated_at = NOW()
        WHERE id = $9
      `, [
        usersCount,
        Math.round(usersChange * 100) / 100,
        Math.round(investmentsAmount),
        Math.round(investmentsChange * 100) / 100,
        Math.round(payoutsAmount),
        Math.round(payoutsChange * 100) / 100,
        Math.round(profitabilityRate * 100) / 100,
        Math.round(profitabilityChange * 100) / 100,
        checkResult.rows[0].id
      ])
    } else {
      // Создаем новую запись
      await query(`
        INSERT INTO platform_statistics (
          users_count,
          users_change,
          investments_amount,
          investments_change,
          payouts_amount,
          payouts_change,
          profitability_rate,
          profitability_change,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [
        usersCount,
        Math.round(usersChange * 100) / 100,
        Math.round(investmentsAmount),
        Math.round(investmentsChange * 100) / 100,
        Math.round(payoutsAmount),
        Math.round(payoutsChange * 100) / 100,
        Math.round(profitabilityRate * 100) / 100,
        Math.round(profitabilityChange * 100) / 100
      ])
    }

    console.log('✅ Статистика обновлена:', {
      users: usersCount,
      investments: investmentsAmount,
      payouts: payoutsAmount,
      profitability: profitabilityRate
    })

    return {
      success: true,
      data: {
        users_count: usersCount,
        users_change: Math.round(usersChange * 100) / 100,
        investments_amount: Math.round(investmentsAmount),
        investments_change: Math.round(investmentsChange * 100) / 100,
        payouts_amount: Math.round(payoutsAmount),
        payouts_change: Math.round(payoutsChange * 100) / 100,
        profitability_rate: Math.round(profitabilityRate * 100) / 100,
        profitability_change: Math.round(profitabilityChange * 100) / 100
      }
    }
  } catch (error) {
    console.error('❌ Ошибка обновления статистики:', error)
    return { success: false, error: error.message }
  }
}