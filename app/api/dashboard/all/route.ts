import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let userId = searchParams.get('userId')
  
  try {

    // Если userId не передан в параметрах, попробуем получить из токена
    if (!userId) {
      const authorization = request.headers.get('authorization')
      if (authorization?.startsWith('Bearer ')) {
        const token = authorization.slice(7)
        try {
          const jwt = require('jsonwebtoken')
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any
          userId = decoded.userId
        } catch (err) {
          console.error('JWT decode error:', err)
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    console.log('Fetching dashboard data for user:', userId)

    // Получаем данные пользователя
    const userResult = await query(
      `SELECT 
        id, 
        email, 
        full_name, 
        COALESCE(balance, 0) as balance,
        COALESCE(total_invested, 0) as total_invested,
        COALESCE(total_earned, 0) as total_earned,
        created_at,
        phone,
        country,
        city,
        referral_code,
        role_id,
        status,
        is_verified,
        is_active
      FROM users 
      WHERE id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Получаем активные инвестиции
    const investmentsResult = await query(
      `SELECT 
        i.id,
        i.amount,
        i.created_at,
        i.status,
        ip.name as plan_name,
        ip.daily_percent as daily_return_rate,
        ip.duration as duration_days,
        i.created_at as start_date
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
      LIMIT 10`,
      [userId]
    )

    // Получаем последние транзакции
    const transactionsResult = await query(
      `SELECT 
        id,
        type,
        amount,
        status,
        created_at,
        description
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10`,
      [userId]
    )

    // Получаем планы инвестирования
    const plansResult = await query(
      `SELECT 
        id,
        name,
        COALESCE(min_amount, 0) as min_amount,
        COALESCE(max_amount, 0) as max_amount,
        COALESCE(daily_percent, 0) as daily_return_rate,
        duration as duration_days
      FROM investment_plans
      WHERE is_active = true
      ORDER BY min_amount ASC`
    )

    console.log(`Dashboard data loaded: User ${user.email}, ${investmentsResult.rows.length} investments, ${transactionsResult.rows.length} transactions`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        balance: parseFloat(user.balance),
        total_invested: parseFloat(user.total_invested),
        total_earned: parseFloat(user.total_earned),
        created_at: user.created_at,
        phone: user.phone,
        country: user.country,
        city: user.city,
        referral_code: user.referral_code,
        role: user.role_id === 1 ? 'super_admin' : user.role_id === 2 ? 'admin' : 'user',
        status: user.status || 'active',
        email_verified: user.is_verified || false,
        phone_verified: user.phone ? true : false,
        is_active: user.is_active !== false
      },
      investments: investmentsResult.rows.map(inv => {
        const amount = parseFloat(inv.amount)
        const dailyReturnRate = parseFloat(inv.daily_return_rate || '0')
        const durationDays = inv.duration_days || 30
        const startDate = new Date(inv.start_date)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + durationDays)
        
        const now = new Date()
        const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const daysLeft = Math.max(0, durationDays - daysPassed)
        const progress = Math.min(100, (daysPassed / durationDays) * 100)
        
        const dailyProfit = (amount * dailyReturnRate) / 100
        const totalProfit = dailyProfit * Math.min(daysPassed, durationDays)
        
        return {
          id: inv.id,
          amount: amount,
          plan_name: inv.plan_name,
          daily_return_rate: dailyReturnRate,
          duration_days: durationDays,
          status: inv.status,
          created_at: inv.created_at,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          daily_profit: dailyProfit,
          total_profit: totalProfit,
          days_left: daysLeft,
          progress: progress
        }
      }),
      transactions: transactionsResult.rows.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: parseFloat(tx.amount),
        status: tx.status,
        description: tx.description,
        created_at: tx.created_at
      })),
      investment_plans: plansResult.rows.map(plan => ({
        id: plan.id,
        name: plan.name,
        min_amount: parseFloat(plan.min_amount),
        max_amount: parseFloat(plan.max_amount),
        daily_return: parseFloat(plan.daily_return_rate),
        duration: plan.duration_days,
        description: `План ${plan.name} с доходностью ${plan.daily_return_rate}%`,
        features: [`Доходность ${plan.daily_return_rate}%`, `Срок ${plan.duration_days} дней`],
        is_active: true
      }))
    })

  } catch (error) {
    console.error('Dashboard all API error:', error)
    console.log('⚠️  Database unavailable, using DEMO mode')

    // Возвращаем демо-данные
    return NextResponse.json({
      success: true,
      isDemoMode: true,
      user: {
        id: userId,
        email: 'demo@user.com',
        full_name: 'Демо Пользователь',
        balance: 10000.00,
        total_invested: 5000.00,
        total_earned: 1000.00,
        created_at: new Date().toISOString(),
        phone: '+7 (999) 123-45-67',
        country: 'RU',
        city: 'Москва',
        referral_code: 'DEMO123456',
        role: 'user',
        status: 'active',
        email_verified: true,
        phone_verified: true,
        is_active: true
      },
      investments: [
        {
          id: 'demo-inv-1',
          amount: 2000.00,
          plan_name: 'Стандарт',
          daily_return_rate: 1.5,
          duration_days: 30,
          status: 'active',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          daily_profit: 30.00,
          total_profit: 150.00,
          days_left: 25,
          progress: 16.67
        },
        {
          id: 'demo-inv-2',
          amount: 3000.00,
          plan_name: 'Премиум',
          daily_return_rate: 2.0,
          duration_days: 60,
          status: 'active',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
          daily_profit: 60.00,
          total_profit: 600.00,
          days_left: 50,
          progress: 16.67
        }
      ],
      transactions: [
        {
          id: 'demo-tx-1',
          type: 'deposit',
          amount: 5000.00,
          status: 'completed',
          description: 'Пополнение счета',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-tx-2',
          type: 'investment',
          amount: 2000.00,
          status: 'completed',
          description: 'Инвестиция в план Стандарт',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-tx-3',
          type: 'profit',
          amount: 150.00,
          status: 'completed',
          description: 'Прибыль от инвестиций',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      investment_plans: [
        {
          id: 1,
          name: 'Базовый',
          min_amount: 100,
          max_amount: 999,
          daily_return: 1.2,
          duration: 30,
          description: 'План Базовый с доходностью 1.2%',
          features: ['Доходность 1.2%', 'Срок 30 дней'],
          is_active: true
        },
        {
          id: 2,
          name: 'Стандарт',
          min_amount: 1000,
          max_amount: 4999,
          daily_return: 1.5,
          duration: 30,
          description: 'План Стандарт с доходностью 1.5%',
          features: ['Доходность 1.5%', 'Срок 30 дней'],
          is_active: true
        },
        {
          id: 3,
          name: 'Премиум',
          min_amount: 5000,
          max_amount: 19999,
          daily_return: 2.0,
          duration: 60,
          description: 'План Премиум с доходностью 2.0%',
          features: ['Доходность 2.0%', 'Срок 60 дней'],
          is_active: true
        }
      ]
    })
  }
}