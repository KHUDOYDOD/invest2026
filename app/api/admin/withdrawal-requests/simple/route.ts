import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from "@/server/db"

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    // Проверяем права админа
    const userResult = await query(
      'SELECT role_id FROM users WHERE id = $1',
      [decoded.userId]
    )
    
    if (!userResult.rows[0] || userResult.rows[0].role_id !== 1) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Получаем заявки на вывод с простой информацией
    const query = `
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount::text as amount,
        wr.method,
        wr.wallet_address,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        u.full_name,
        u.email,
        u.balance::text as balance
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 50
    `

    const result = await query(query)
    
    const requests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      method: row.method,
      payment_details: null, // withdrawal_requests не имеет payment_details
      wallet_address: row.wallet_address,
      card_number: null,
      phone_number: null,
      status: row.status,
      admin_comment: row.admin_comment,
      created_at: row.created_at,
      processed_at: row.processed_at,
      user: {
        id: row.user_id,
        full_name: row.full_name,
        email: row.email,
        balance: parseFloat(row.balance),
        previous_balance: null // Упрощаем - не вычисляем предыдущий баланс
      }
    }))

    return NextResponse.json({
      success: true,
      requests
    })

  } catch (error) {
    console.error('Error fetching withdrawal requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}