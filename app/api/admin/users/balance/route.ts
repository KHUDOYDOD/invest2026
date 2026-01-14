import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/server/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount } = body

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or amount' },
        { status: 400 }
      )
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Обновляем баланс пользователя
    const result = await query(
      `UPDATE users 
       SET balance = balance + $1 
       WHERE id = $2 
       RETURNING balance`,
      [amountNum, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Создаем запись транзакции
    await query(
      `INSERT INTO transactions (user_id, type, amount, status, description, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userId, 'deposit', amountNum, 'completed', 'Пополнение баланса администратором']
    )

    return NextResponse.json({
      success: true,
      newBalance: parseFloat(result.rows[0].balance)
    })
  } catch (error) {
    console.error('Error updating balance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update balance' },
      { status: 500 }
    )
  }
}
