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
      decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback_secret')
    } catch (error) {
      return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
    }

    // Проверяем, демо-режим ли это
    if (decoded.isDemoMode) {
      console.log('📊 Dashboard API: DEMO mode for user:', decoded.email)
      
      // Возвращаем демо-данные
      return NextResponse.json({
        success: true,
        isDemoMode: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.role === 'super_admin' ? 'Создатель Системы' : 
                decoded.role === 'admin' ? 'Администратор Демо' : 'Пользователь Демо',
          full_name: decoded.role === 'super_admin' ? 'Создатель Системы' : 
                     decoded.role === 'admin' ? 'Администратор Демо' : 'Пользователь Демо',
          balance: decoded.role === 'admin' ? 50000.00 : decoded.role === 'user' ? 10000.00 : 0.00,
          totalInvested: decoded.role === 'admin' ? 25000.00 : decoded.role === 'user' ? 5000.00 : 0.00,
          total_invested: decoded.role === 'admin' ? 25000.00 : decoded.role === 'user' ? 5000.00 : 0.00,
          totalProfit: decoded.role === 'admin' ? 5000.00 : decoded.role === 'user' ? 1000.00 : 0.00,
          total_earned: decoded.role === 'admin' ? 5000.00 : decoded.role === 'user' ? 1000.00 : 0.00,
          activeInvestments: decoded.role === 'admin' ? 3 : decoded.role === 'user' ? 2 : 0,
          referralCount: decoded.role === 'admin' ? 10 : decoded.role === 'user' ? 2 : 0,
          role: decoded.role,
          isAdmin: decoded.role === 'super_admin' || decoded.role === 'admin',
          created_at: new Date().toISOString()
        }
      })
    }

    // Получаем все данные пользователя одним запросом
    const userDataQuery = `
      SELECT 
        u.id, 
        u.email, 
        u.full_name, 
        COALESCE(u.balance, 0) as balance, 
        COALESCE(u.total_invested, 0) as total_invested, 
        COALESCE(u.total_earned, 0) as total_earned, 
        u.role_id,
        u.created_at,
        COALESCE(inv_stats.active_investments, 0) as active_investments,
        COALESCE(inv_stats.total_profit, 0) as total_profit,
        COALESCE(ref_stats.referral_count, 0) as referral_count
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as active_investments,
          COALESCE(SUM(total_profit), 0) as total_profit
        FROM investments 
        WHERE status = 'active'
        GROUP BY user_id
      ) inv_stats ON u.id = inv_stats.user_id
      LEFT JOIN (
        SELECT 
          referrer_id,
          COUNT(*) as referral_count
        FROM users 
        WHERE referrer_id IS NOT NULL
        GROUP BY referrer_id
      ) ref_stats ON u.id = ref_stats.referrer_id
      WHERE u.id = $1 AND u.is_active = true
    `

    let userResult
    try {
      userResult = await query(userDataQuery, [decoded.userId])
    } catch (dbError: any) {
      console.log('⚠️  Database unavailable in dashboard API, using DEMO mode')
      
      // Возвращаем демо-данные если БД недоступна
      return NextResponse.json({
        success: true,
        isDemoMode: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.role === 'super_admin' ? 'Создатель Системы' : 
                decoded.role === 'admin' ? 'Администратор Демо' : 'Пользователь Демо',
          full_name: decoded.role === 'super_admin' ? 'Создатель Системы' : 
                     decoded.role === 'admin' ? 'Администратор Демо' : 'Пользователь Демо',
          balance: decoded.role === 'admin' ? 50000.00 : decoded.role === 'user' ? 10000.00 : 0.00,
          totalInvested: decoded.role === 'admin' ? 25000.00 : decoded.role === 'user' ? 5000.00 : 0.00,
          total_invested: decoded.role === 'admin' ? 25000.00 : decoded.role === 'user' ? 5000.00 : 0.00,
          totalProfit: decoded.role === 'admin' ? 5000.00 : decoded.role === 'user' ? 1000.00 : 0.00,
          total_earned: decoded.role === 'admin' ? 5000.00 : decoded.role === 'user' ? 1000.00 : 0.00,
          activeInvestments: decoded.role === 'admin' ? 3 : decoded.role === 'user' ? 2 : 0,
          referralCount: decoded.role === 'admin' ? 10 : decoded.role === 'user' ? 2 : 0,
          role: decoded.role,
          isAdmin: decoded.role === 'super_admin' || decoded.role === 'admin',
          created_at: new Date().toISOString()
        }
      })
    }

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    const user = userResult.rows[0]
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        totalInvested: parseFloat(user.total_invested),
        total_invested: parseFloat(user.total_invested),
        totalProfit: parseFloat(user.total_profit),
        total_earned: parseFloat(user.total_earned),
        activeInvestments: parseInt(user.active_investments),
        referralCount: parseInt(user.referral_count),
        role: user.role_id === 1 ? 'admin' : 'user',
        isAdmin: user.role_id === 1,
        created_at: user.created_at
      }
    })

  } catch (error) {
    console.error('Dashboard user API error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}