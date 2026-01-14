import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import jwt from 'jsonwebtoken'

// Функция для проверки токена
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as any;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATING INVESTMENT ===');
    
    // Проверяем токен
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await request.json()
    console.log('Request body:', body);
    console.log('Request body types:', {
      planId: typeof body.planId,
      amount: typeof body.amount
    });
    
    const { planId, amount } = body
    const userId = user.userId; // Получаем userId из токена

    console.log('Parsed values:', { userId, planId, amount });

    if (!planId || !amount) {
      console.log('Missing fields:', { planId, amount, userId });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: planId and amount' },
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

    console.log('Creating investment:', { userId, planId, amount: amountNum });

    // Проверяем баланс пользователя
    const userResult = await query(
      'SELECT balance FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const userBalance = parseFloat(userResult.rows[0].balance)
    console.log('User balance:', userBalance);
    
    if (userBalance < amountNum) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. Available: $${userBalance}` },
        { status: 400 }
      )
    }

    // Получаем информацию о плане (исправляем названия колонок)
    const planResult = await query(
      'SELECT duration, daily_percent, name FROM investment_plans WHERE id = $1',
      [planId]
    )

    if (planResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      )
    }

    const plan = planResult.rows[0]
    console.log('Investment plan:', plan);
    
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.duration)
    
    // Рассчитываем дневную прибыль
    const dailyProfit = (amountNum * plan.daily_percent) / 100;
    console.log('Calculated daily profit:', dailyProfit);

    // Начинаем транзакцию
    await query('BEGIN');

    try {
      // Создаем инвестицию
      const investmentResult = await query(
        `INSERT INTO investments (id, user_id, plan_id, amount, daily_profit, status, start_date, end_date, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), $6, NOW())
         RETURNING id`,
        [userId, planId, amountNum, dailyProfit, 'active', endDate]
      )

      // Обновляем баланс пользователя
      await query(
        'UPDATE users SET balance = balance - $1, total_invested = COALESCE(total_invested, 0) + $1 WHERE id = $2',
        [amountNum, userId]
      )

      // Создаем транзакцию
      await query(
        `INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
        [userId, 'investment', amountNum, 'completed', `Инвестиция в план "${plan.name}"`]
      )

      await query('COMMIT');
      
      console.log('✅ Investment created successfully');

      return NextResponse.json({
        success: true,
        message: 'Инвестиция создана успешно',
        investment: {
          id: investmentResult.rows[0].id,
          amount: amountNum,
          daily_profit: dailyProfit,
          plan: plan.name,
          duration: plan.duration,
          daily_return: plan.daily_percent
        },
        newBalance: userBalance - amountNum
      })
      
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('❌ Error creating investment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create investment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
