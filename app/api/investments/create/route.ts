import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/server/db'
import jwt from 'jsonwebtoken'
import { updateStatistics } from '@/lib/update-statistics'

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
    // planId может быть UUID или числом, пробуем оба варианта
    let planResult;
    
    // Сначала пробуем как UUID
    planResult = await query(
      'SELECT duration, daily_percent, name FROM investment_plans WHERE id::text = $1 OR id = $1::uuid',
      [planId]
    );
    
    // Если не нашли, пробуем найти по порядковому номеру
    if (planResult.rows.length === 0) {
      const planIndex = parseInt(planId) - 1;
      if (!isNaN(planIndex) && planIndex >= 0) {
        planResult = await query(
          `SELECT duration, daily_percent, name, id 
           FROM investment_plans 
           WHERE is_active = true 
           ORDER BY min_amount ASC 
           LIMIT 1 OFFSET $1`,
          [planIndex]
        );
      }
    }

    if (planResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      )
    }

    const plan = planResult.rows[0]
    console.log('Investment plan:', plan);
    
    // Используем реальный ID плана из базы данных
    const realPlanId = plan.id || planId;
    
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
        [userId, realPlanId, amountNum, dailyProfit, 'active', endDate]
      )

      // Обновляем баланс пользователя
      await query(
        'UPDATE users SET balance = balance - $1, total_invested = COALESCE(total_invested, 0) + $1 WHERE id = $2',
        [amountNum, userId]
      )

      // Создаем транзакцию с investment_id
      await query(
        `INSERT INTO transactions (id, user_id, investment_id, type, amount, status, description, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
        [userId, investmentResult.rows[0].id, 'investment', amountNum, 'completed', `Инвестиция в план "${plan.name}"`]
      )

      await query('COMMIT');
      
      console.log('✅ Investment created successfully');

      // Обновляем статистику после создания инвестиции
      await updateStatistics();

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
