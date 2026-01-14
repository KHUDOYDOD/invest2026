import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from "@/server/db"

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
        message: 'Заявка отклонена (демо-режим)'
      })
    }

    // Обновляем статус заявки на пополнение
    const updateResult = await query(
      `UPDATE deposit_requests 
       SET status = 'rejected', 
           admin_comment = $1, 
           processed_at = NOW(),
           processed_by = $2
       WHERE id = $3`,
      [admin_comment || 'Отклонено', decoded.userId, requestId]
    )

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Заявка на пополнение отклонена'
    })

  } catch (error) {
    console.error('Error rejecting deposit request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}