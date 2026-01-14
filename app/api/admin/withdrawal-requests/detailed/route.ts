import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authorization required" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    // Проверяем права администратора
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    // Получаем детальную информацию о заявках на вывод
    const withdrawalRequestsResult = await query(`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.wallet_address,
        wr.fee,
        wr.final_amount,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        
        -- Информация о пользователе
        u.full_name,
        u.email,
        u.balance,
        u.total_invested,
        u.total_earned,
        u.created_at as registration_date,
        u.last_login,
        u.country,
        u.city,
        u.is_verified,
        u.phone,
        
        -- Статистика пользователя
        (SELECT COUNT(*) FROM deposit_requests WHERE user_id = u.id AND status = 'approved') as total_deposits,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE user_id = u.id AND status = 'approved') as total_withdrawals,
        (SELECT COUNT(*) FROM transactions WHERE user_id = u.id AND status = 'completed') as successful_transactions,
        (SELECT COUNT(*) FROM transactions WHERE user_id = u.id AND status = 'failed') as failed_transactions,
        (SELECT AVG(amount) FROM transactions WHERE user_id = u.id) as average_transaction,
        (SELECT MIN(created_at) FROM transactions WHERE user_id = u.id) as first_transaction_date,
        (SELECT MAX(created_at) FROM transactions WHERE user_id = u.id) as last_transaction_date
        
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 50
    `)

    const detailedRequests = await Promise.all(
      withdrawalRequestsResult.rows.map(async (request) => {
        // Вычисляем факторы риска
        const registrationDate = new Date(request.registration_date)
        const now = new Date()
        const daysSinceRegistration = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))
        
        const isNewUser = daysSinceRegistration < 30
        const isLargeAmount = request.amount > 1000
        const hasMultipleRequests = await query(
          'SELECT COUNT(*) as count FROM withdrawal_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'24 hours\'',
          [request.user_id]
        )
        const multipleRequests = parseInt(hasMultipleRequests.rows[0].count) > 1
        
        // Проверяем разные способы оплаты
        const paymentMethodsResult = await query(
          'SELECT DISTINCT method FROM withdrawal_requests WHERE user_id = $1',
          [request.user_id]
        )
        const differentPaymentMethods = paymentMethodsResult.rows.length > 2
        
        // Подозрительные паттерны (например, много заявок подряд)
        const recentRequestsResult = await query(
          'SELECT COUNT(*) as count FROM withdrawal_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'7 days\'',
          [request.user_id]
        )
        const suspiciousPattern = parseInt(recentRequestsResult.rows[0].count) > 5
        
        // Вычисляем общий риск-скор
        let riskScore = 0
        if (isNewUser) riskScore += 20
        if (isLargeAmount) riskScore += 30
        if (multipleRequests) riskScore += 15
        if (differentPaymentMethods) riskScore += 10
        if (suspiciousPattern) riskScore += 25
        if (!request.is_verified) riskScore += 20
        if (request.total_withdrawals > request.total_deposits) riskScore += 20
        
        // Получаем похожие заявки
        const similarRequestsResult = await query(`
          SELECT id, amount, method, status, created_at
          FROM withdrawal_requests 
          WHERE user_id = $1 AND id != $2
          ORDER BY created_at DESC
          LIMIT 5
        `, [request.user_id, request.id])

        return {
          id: request.id,
          user_id: request.user_id,
          amount: parseFloat(request.amount),
          method: request.method,
          wallet_address: request.wallet_address,
          fee: parseFloat(request.fee || 0),
          final_amount: parseFloat(request.final_amount || request.amount),
          status: request.status,
          admin_comment: request.admin_comment,
          created_at: request.created_at,
          processed_at: request.processed_at,
          
          user: {
            id: request.user_id,
            full_name: request.full_name,
            email: request.email,
            balance: parseFloat(request.balance || 0),
            total_invested: parseFloat(request.total_invested || 0),
            total_earned: parseFloat(request.total_earned || 0),
            registration_date: request.registration_date,
            last_login: request.last_login,
            country: request.country,
            city: request.city,
            ip_address: '192.168.1.1', // Заглушка, в реальности нужно сохранять IP
            is_verified: request.is_verified,
            kyc_status: request.is_verified ? 'verified' : 'pending',
            phone: request.phone
          },
          
          user_stats: {
            total_deposits: parseInt(request.total_deposits || 0),
            total_withdrawals: parseInt(request.total_withdrawals || 0),
            successful_transactions: parseInt(request.successful_transactions || 0),
            failed_transactions: parseInt(request.failed_transactions || 0),
            average_transaction: parseFloat(request.average_transaction || 0),
            first_transaction_date: request.first_transaction_date,
            last_transaction_date: request.last_transaction_date
          },
          
          risk_factors: {
            new_user: isNewUser,
            large_amount: isLargeAmount,
            suspicious_pattern: suspiciousPattern,
            multiple_requests: multipleRequests,
            different_payment_methods: differentPaymentMethods,
            risk_score: Math.min(100, riskScore)
          },
          
          similar_requests: similarRequestsResult.rows.map(row => ({
            id: row.id,
            amount: parseFloat(row.amount),
            method: row.method,
            status: row.status,
            created_at: row.created_at
          }))
        }
      })
    )

    console.log(`✅ Loaded ${detailedRequests.length} detailed withdrawal requests`)

    return NextResponse.json({
      success: true,
      requests: detailedRequests
    })

  } catch (error) {
    console.error("Error loading detailed withdrawal requests:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load detailed requests" },
      { status: 500 }
    )
  }
}