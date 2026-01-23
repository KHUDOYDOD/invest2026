import { NextResponse } from 'next/server'
import { query } from '@/server/db'

export async function GET() {
  try {
    console.log('📊 Statistics API called at:', new Date().toISOString());
    
    // Получаем статистику из таблицы platform_statistics
    const result = await query(`
      SELECT 
        users_count,
        users_change,
        investments_amount,
        investments_change,
        payouts_amount,
        payouts_change,
        profitability_rate,
        profitability_change,
        updated_at
      FROM platform_statistics 
      ORDER BY id DESC 
      LIMIT 1
    `)

    console.log('📊 Database query result:', result.rows.length > 0 ? result.rows[0] : 'No data');

    if (result.rows.length === 0) {
      console.log('⚠️ No statistics data found, returning defaults');
      // Если данных нет, возвращаем значения по умолчанию
      return NextResponse.json({
        users_count: 15420,
        users_change: 12.5,
        investments_amount: 2850000,
        investments_change: 8.3,
        payouts_amount: 1920000,
        payouts_change: 15.7,
        profitability_rate: 24.8,
        profitability_change: 3.2
      })
    }

    const stats = result.rows[0]

    const responseData = {
      users_count: parseInt(stats.users_count),
      users_change: parseFloat(stats.users_change),
      investments_amount: parseInt(stats.investments_amount),
      investments_change: parseFloat(stats.investments_change),
      payouts_amount: parseInt(stats.payouts_amount),
      payouts_change: parseFloat(stats.payouts_change),
      profitability_rate: parseFloat(stats.profitability_rate),
      profitability_change: parseFloat(stats.profitability_change),
      updated_at: stats.updated_at
    };

    console.log('📊 Returning statistics:', responseData);

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('❌ Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      users_count,
      users_change,
      investments_amount,
      investments_change,
      payouts_amount,
      payouts_change,
      profitability_rate,
      profitability_change
    } = body

    // Проверяем, есть ли уже запись
    const checkResult = await query('SELECT id FROM platform_statistics LIMIT 1')
    
    let result
    if (checkResult.rows.length > 0) {
      // Обновляем существующую запись
      result = await query(`
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
        RETURNING *
      `, [
        users_count,
        users_change,
        investments_amount,
        investments_change,
        payouts_amount,
        payouts_change,
        profitability_rate,
        profitability_change,
        checkResult.rows[0].id
      ])
    } else {
      // Создаем новую запись
      result = await query(`
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
        RETURNING *
      `, [
        users_count,
        users_change,
        investments_amount,
        investments_change,
        payouts_amount,
        payouts_change,
        profitability_rate,
        profitability_change
      ])
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating statistics:', error)
    return NextResponse.json(
      { error: 'Failed to update statistics' },
      { status: 500 }
    )
  }
}
