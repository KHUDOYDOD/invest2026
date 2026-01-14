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

    // Получаем детальную информацию о заявках на пополнение
    const depositRequestsResult = await query(`
      SELECT 
        dr.id,
        dr.user_id,
        dr.amount,
        dr.method,
        dr.payment_details,
        dr.status,
        dr.admin_comment,
        dr.created_at,
        dr.processed_at,
        
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
        
      FROM deposit_requests dr
      JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 50
    `)

    const detailedRequests = await Promise.all(
      depositRequestsResult.rows.map(async (request) => {
        // Вычисляем факторы риска
        const registrationDate = new Date(request.registration_date)
        const now = new Date()
        const daysSinceRegistration = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))
        
        const isNewUser = daysSinceRegistration < 30
        const isLargeAmount = request.amount > 5000
        const hasMultipleRequests = await query(
          'SELECT COUNT(*) as count FROM deposit_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'24 hours\'',
          [request.user_id]
        )
        const multipleRequests = parseInt(hasMultipleRequests.rows[0].count) > 3
        
        // Проверяем разные способы оплаты
        const paymentMethodsResult = await query(
          'SELECT DISTINCT method FROM deposit_requests WHERE user_id = $1',
          [request.user_id]
        )
        const differentPaymentMethods = paymentMethodsResult.rows.length > 3
        
        // Подозрительные паттерны
        const recentRequestsResult = await query(
          'SELECT COUNT(*) as count FROM deposit_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'7 days\'',
          [request.user_id]
        )
        const suspiciousPattern = parseInt(recentRequestsResult.rows[0].count) > 10
        
        // Вычисляем общий риск-скор для пополнений (обычно ниже чем для выводов)
        let riskScore = 0
        if (isNewUser) riskScore += 15
        if (isLargeAmount) riskScore += 25
        if (multipleRequests) riskScore += 20
        if (differentPaymentMethods) riskScore += 10
        if (suspiciousPattern) riskScore += 30
        if (!request.is_verified) riskScore += 15
        
        // Получаем похожие заявки
        const similarRequestsResult = await query(`
          SELECT id, amount, method, status, created_at
          FROM deposit_requests 
          WHERE user_id = $1 AND id != $2
          ORDER BY created_at DESC
          LIMIT 5
        `, [request.user_id, request.id])

        return {
          id: request.id,
          user_id: request.user_id,
          amount: parseFloat(request.amount),
          method: request.method,
          payment_details: request.payment_details,
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

    console.log(`✅ Loaded ${detailedRequests.length} detailed deposit requests`)

    return NextResponse.json({
      success: true,
      requests: detailedRequests
    })

  } catch (error) {
    console.error("Error loading detailed deposit requests:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load detailed requests" },
      { status: 500 }
    )
  }
}