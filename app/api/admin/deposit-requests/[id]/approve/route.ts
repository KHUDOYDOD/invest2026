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
    if (requestId === '1' || requestId === '2') {
      return NextResponse.json({
        success: true,
        message: 'Заявка одобрена (демо-режим)'
      })
    }

    // Обновляем статус заявки на пополнение
    const updateResult = await query(
      `UPDATE deposit_requests 
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

    // Получаем информацию о заявке для обновления баланса
    const requestInfo = await query(
      'SELECT user_id, amount FROM deposit_requests WHERE id = $1',
      [requestId]
    )

    if (requestInfo.rows[0]) {
      // Обновляем баланс пользователя
      await query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [requestInfo.rows[0].amount, requestInfo.rows[0].user_id]
      )

      // Обрабатываем реферальную комиссию
      const userInfoResult = await query(
        'SELECT referred_by FROM users WHERE id = $1',
        [requestInfo.rows[0].user_id]
      )

      if (userInfoResult.rows.length > 0 && userInfoResult.rows[0].referred_by) {
        const referralCode = userInfoResult.rows[0].referred_by
        const commission = parseFloat(requestInfo.rows[0].amount) * 0.05 // 5% комиссия

        console.log(`💰 Processing referral commission: ${commission} for code ${referralCode}`)

        // Находим реферера по коду
        const referrerResult = await query(
          'SELECT id FROM users WHERE referral_code = $1',
          [referralCode]
        )

        if (referrerResult.rows.length > 0) {
          const referrerId = referrerResult.rows[0].id

          // Начисляем комиссию рефереру
          await query(
            'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
            [commission, referrerId]
          )

          // Создаем запись о транзакции для реферера
          await query(
            `INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
             VALUES (gen_random_uuid(), $1, 'referral_bonus', $2, 'completed', 'Реферальная комиссия (5% от депозита)', NOW())`,
            [referrerId, commission]
          )

          console.log(`✅ Referral commission ${commission} credited to user ${referrerId}`)
        }
      }
    }

    // Обновляем статистику после одобрения пополнения
    await updateStatistics()

    return NextResponse.json({
      success: true,
      message: 'Заявка на пополнение одобрена'
    })

  } catch (error) {
    console.error('Error approving deposit request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}