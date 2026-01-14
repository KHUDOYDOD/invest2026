
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization')
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 })
    }

    // Верифицируем токен
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
    }

    console.log('Fetching transactions for user:', decoded.userId)

    // Получаем транзакции пользователя
    const transactionsResult = await query(
      `SELECT 
        id,
        type,
        amount,
        status,
        created_at,
        description,
        payment_method as method
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50`,
      [decoded.userId]
    )

    // Получаем заявки на пополнение
    const depositRequestsResult = await query(
      `SELECT 
        id,
        'deposit_request' as type,
        amount,
        status,
        created_at,
        CASE 
          WHEN status = 'pending' THEN 'На проверке'
          WHEN status = 'approved' THEN 'Одобрено'
          WHEN status = 'rejected' THEN CONCAT('Отклонено: ', COALESCE(admin_comment, 'Не указана причина'))
        END as description,
        method as payment_method
      FROM deposit_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20`,
      [decoded.userId]
    )

    // Получаем заявки на вывод
    const withdrawalRequestsResult = await query(
      `SELECT 
        id,
        'withdrawal_request' as type,
        amount,
        status,
        created_at,
        CASE 
          WHEN status = 'pending' THEN 'На проверке'
          WHEN status = 'completed' THEN 'Выполнено'
          WHEN status = 'rejected' THEN CONCAT('Отклонено: ', COALESCE(admin_comment, 'Не указана причина'))
        END as description,
        method as payment_method
      FROM withdrawal_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20`,
      [decoded.userId]
    )

    // Объединяем все транзакции и заявки
    const allTransactions = [
      ...transactionsResult.rows,
      ...depositRequestsResult.rows.map(row => ({
        ...row,
        type: 'deposit',
        status: row.status === 'approved' ? 'completed' : row.status
      })),
      ...withdrawalRequestsResult.rows.map(row => ({
        ...row,
        type: 'withdrawal',
        status: row.status === 'completed' ? 'completed' : row.status
      }))
    ]

    // Сортируем по дате
    allTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Ограничиваем до 50 записей
    const limitedTransactions = allTransactions.slice(0, 50)

    console.log(`Found ${limitedTransactions.length} total transactions for user ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      transactions: limitedTransactions
    })

  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ 
      error: 'Ошибка получения транзакций',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
