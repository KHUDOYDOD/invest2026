import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from "@/server/db"
import { updateStatistics } from '@/lib/update-statistics'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { admin_comment } = await request.json()
    const requestId = params.id

    // Для демо-данных просто возвращаем успех
    if (requestId === '3' || requestId === '4') {
      return NextResponse.json({
        success: true,
        message: 'Заявка одобрена (демо-режим)'
      })
    }

    // Получаем информацию о заявке для проверки баланса
    const requestInfo = await query(
      'SELECT user_id, amount FROM withdrawal_requests WHERE id = $1',
      [requestId]
    )

    if (!requestInfo.rows[0]) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
    }

    const { user_id, amount } = requestInfo.rows[0]

    // Проверяем баланс пользователя
    const userBalance = await query(
      'SELECT balance FROM users WHERE id = $1',
      [user_id]
    )

    if (!userBalance.rows[0] || parseFloat(userBalance.rows[0].balance) < parseFloat(amount)) {
      return NextResponse.json({ 
        error: 'Недостаточно средств на балансе пользователя' 
      }, { status: 400 })
    }

    // Обновляем статус заявки на вывод
    const updateResult = await query(
      `UPDATE withdrawal_requests 
       SET status = 'approved', 
           admin_comment = $1, 
           processed_at = NOW(),
           processed_by = $2
       WHERE id = $3`,
      [admin_comment || 'Одобрено', decoded.userId, requestId]
    )

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
    }

    // Списываем средства с баланса пользователя
    await query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [amount, user_id]
    )

    // Обновляем статистику после одобрения вывода
    await updateStatistics()

    return NextResponse.json({
      success: true,
      message: 'Заявка на вывод одобрена'
    })

  } catch (error) {
    console.error('Error approving withdrawal request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}