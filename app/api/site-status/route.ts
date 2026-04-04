import { NextResponse } from 'next/server'
import { pool } from '@/server/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Получаем активные проекты которые еще не запущены
    const result = await pool.query(`
      SELECT 
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND (is_launched = false OR is_launched IS NULL)
      ORDER BY position ASC
      LIMIT 1
    `)

    // Если нет активных проектов, все функции включены
    if (result.rows.length === 0) {
      return NextResponse.json({
        registration_enabled: true,
        investments_enabled: true,
        deposits_enabled: true,
        withdrawals_enabled: true,
        message: 'Все функции доступны'
      })
    }

    const project = result.rows[0]
    
    return NextResponse.json({
      registration_enabled: !project.disable_registration,
      investments_enabled: !project.disable_investments,
      deposits_enabled: !project.disable_deposits,
      withdrawals_enabled: !project.disable_withdrawals,
      message: 'Статус функций определен активным проектом'
    })

  } catch (error) {
    console.error('Error checking site status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}