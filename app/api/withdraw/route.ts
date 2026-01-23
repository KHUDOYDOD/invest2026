import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import jwt from 'jsonwebtoken';
import { updateStatistics } from '@/lib/update-statistics';

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
    console.log('=== СОЗДАНИЕ ЗАЯВКИ НА ВЫВОД ===');
    
    // Проверяем токен
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'Необходима авторизация. Пожалуйста, войдите в систему.' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { 
      amount, 
      method,
      payment_method, 
      wallet_address, 
      card_number,
      card_holder_name,
      bank_name,
      phone_number,
      account_holder_name,
      crypto_network
    } = body;

    // Используем method или payment_method
    const withdrawMethod = method || payment_method;

    console.log('Данные запроса:', { 
      amount, 
      method: withdrawMethod,
      wallet_address, 
      card_number,
      card_holder_name,
      bank_name,
      phone_number,
      account_holder_name,
      crypto_network
    });

    // Валидация суммы
    if (!amount) {
      return NextResponse.json({ 
        success: false,
        error: 'Укажите сумму для вывода' 
      }, { status: 400 });
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Сумма должна быть положительным числом' 
      }, { status: 400 });
    }

    if (withdrawAmount < 10) {
      return NextResponse.json({ 
        success: false,
        error: 'Минимальная сумма для вывода: $10' 
      }, { status: 400 });
    }

    // Валидация способа вывода
    if (!withdrawMethod) {
      return NextResponse.json({ 
        success: false,
        error: 'Выберите способ вывода средств' 
      }, { status: 400 });
    }

    const validMethods = ['card', 'crypto', 'sbp', 'bank'];
    if (!validMethods.includes(withdrawMethod)) {
      return NextResponse.json({ 
        success: false,
        error: 'Недопустимый способ вывода' 
      }, { status: 400 });
    }

    // Валидация реквизитов
    if (withdrawMethod === 'crypto' && !wallet_address) {
      return NextResponse.json({ 
        success: false,
        error: 'Укажите адрес криптокошелька' 
      }, { status: 400 });
    }

    if (withdrawMethod === 'card' && !card_number) {
      return NextResponse.json({ 
        success: false,
        error: 'Укажите номер карты' 
      }, { status: 400 });
    }

    if (withdrawMethod === 'sbp' && !phone_number) {
      return NextResponse.json({ 
        success: false,
        error: 'Укажите номер телефона для СБП' 
      }, { status: 400 });
    }

    if (withdrawMethod === 'sbp' && !bank_name) {
      return NextResponse.json({ 
        success: false,
        error: 'Выберите банк для СБП' 
      }, { status: 400 });
    }

    console.log('Creating withdrawal request:', {
      userId: user.userId,
      amount: withdrawAmount,
      method: withdrawMethod,
      bank_name: bank_name
    });

    // Проверяем баланс пользователя
    const userResult = await query(
      'SELECT balance, full_name FROM users WHERE id = $1',
      [user.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Пользователь не найден в системе' 
      }, { status: 404 });
    }

    const userBalance = parseFloat(userResult.rows[0].balance);
    const userName = userResult.rows[0].full_name;

    console.log(`Баланс пользователя ${userName}: $${userBalance}, запрашивает: $${withdrawAmount}`);

    // Детальная проверка баланса
    if (userBalance === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'На вашем счету недостаточно средств для вывода',
        details: {
          currentBalance: userBalance,
          requestedAmount: withdrawAmount,
          message: 'Ваш текущий баланс: $0.00. Пополните счет или получите прибыль от инвестиций для вывода средств.'
        }
      }, { status: 400 });
    }

    if (userBalance < withdrawAmount) {
      const shortage = withdrawAmount - userBalance;
      return NextResponse.json({ 
        success: false,
        error: `Недостаточно средств на счету`,
        details: {
          currentBalance: userBalance,
          requestedAmount: withdrawAmount,
          shortage: shortage,
          message: `Ваш баланс: $${userBalance.toFixed(2)}. Для вывода $${withdrawAmount.toFixed(2)} не хватает $${shortage.toFixed(2)}.`
        }
      }, { status: 400 });
    }

    // Рассчитываем комиссию (2%)
    const fee = withdrawAmount * 0.02;
    const finalAmount = withdrawAmount - fee;

    // Начинаем транзакцию
    await query('BEGIN');

    try {
      // Списываем средства с баланса
      await query(
        'UPDATE users SET balance = balance - $1 WHERE id = $2',
        [withdrawAmount, user.userId]
      );

      // Создаем заявку на вывод
      const withdrawalResult = await query(
        `INSERT INTO withdrawal_requests (
          user_id, amount, method, wallet_address, card_number, card_holder_name, bank_name,
          phone_number, account_holder_name, crypto_network, fee, final_amount, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW()) 
        RETURNING id, created_at`,
        [
          user.userId,
          withdrawAmount,
          withdrawMethod,
          wallet_address || null,
          card_number || null,
          card_holder_name || null,
          bank_name || null,
          phone_number || null,
          account_holder_name || null,
          crypto_network || null,
          fee,
          finalAmount
        ]
      );

      // Создаем запись транзакции
      const transactionResult = await query(
        `INSERT INTO transactions (
          id, user_id, type, amount, status, description, created_at
        ) VALUES (gen_random_uuid(), $1, 'withdrawal', $2, 'pending', 'Заявка на вывод средств', NOW())
        RETURNING id`,
        [user.userId, withdrawAmount]
      );

      await query('COMMIT');

      console.log('✅ Withdrawal request created successfully');

      // Обновляем статистику после создания заявки на вывод
      await updateStatistics();

      return NextResponse.json({
        success: true,
        message: 'Заявка на вывод создана успешно',
        transaction: {
          id: transactionResult.rows[0].id,
          amount: withdrawAmount,
          fee: fee,
          final_amount: finalAmount,
          status: 'pending',
          created_at: withdrawalResult.rows[0].created_at
        },
        withdrawal_request: {
          id: withdrawalResult.rows[0].id,
          status: 'pending'
        }
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('❌ Error creating withdrawal request:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Произошла ошибка при создании заявки на вывод',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}