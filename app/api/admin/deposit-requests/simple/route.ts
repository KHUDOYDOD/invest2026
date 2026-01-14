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

    // Получаем заявки на пополнение с простой информацией
    const sqlQuery = `
      SELECT 
        dr.id,
        dr.user_id,
        dr.amount::text as amount,
        dr.method,
        dr.payment_details,
        dr.status,
        dr.admin_comment,
        dr.created_at,
        dr.processed_at,
        u.full_name,
        u.email,
        u.balance::text as balance
      FROM deposit_requests dr
      JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 50
    `

    const result = await query(sqlQuery)
    
    const requests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      method: row.method,
      payment_details: row.payment_details,
      wallet_address: null, // deposit_requests не имеет wallet_address
      card_number: row.payment_details?.card_number || null,
      phone_number: row.payment_details?.phone_number || null,
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
    console.error('Error fetching deposit requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}