import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import jwt from 'jsonwebtoken';

// Функция для проверки токена и роли администратора
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as any;
    
    // Проверяем, что пользователь - администратор
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Admin token verification error:', error);
    return null;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== ADMIN UPDATE DEPOSIT REQUEST ===');
    
    // Проверяем права администратора
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const { status, admin_comment } = body;
    const requestId = params.id;

    if (!requestId || !status) {
      return NextResponse.json({ error: 'Не указаны обязательные поля' }, { status: 400 });
    }

    console.log('Updating deposit request:', requestId, 'Status:', status);

    // Если заявка одобрена, нужно пополнить баланс пользователя
    if (status === 'approved') {
      // Получаем информацию о заявке
      const requestResult = await query(
        'SELECT user_id, amount FROM deposit_requests WHERE id = $1',
        [requestId]
      );

      if (requestResult.rows.length === 0) {
        return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
      }

      const { user_id, amount } = requestResult.rows[0];

      // Начинаем транзакцию
      await query('BEGIN');

      try {
        // Обновляем заявку
        await query(
          `UPDATE deposit_requests 
           SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
           WHERE id = $4`,
          [status, admin_comment || null, admin.userId, requestId]
        );

        // Пополняем баланс пользователя
        await query(
          'UPDATE users SET balance = balance + $1 WHERE id = $2',
          [amount, user_id]
        );

        // Создаем запись о транзакции
        await query(
          `INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
           VALUES (gen_random_uuid(), $1, 'deposit', $2, 'completed', 'Пополнение баланса (одобрено администратором)', NOW())`,
          [user_id, amount]
        );

        // Обрабатываем реферальную комиссию
        const userInfoResult = await query(
          'SELECT referred_by FROM users WHERE id = $1',
          [user_id]
        );

        if (userInfoResult.rows.length > 0 && userInfoResult.rows[0].referred_by) {
          const referralCode = userInfoResult.rows[0].referred_by;
          const commission = parseFloat(amount) * 0.05; // 5% комиссия

          console.log(`💰 Processing referral commission: ${commission} for code ${referralCode}`);

          // Находим реферера по коду
          const referrerResult = await query(
            'SELECT id FROM users WHERE referral_code = $1',
            [referralCode]
          );

          if (referrerResult.rows.length > 0) {
            const referrerId = referrerResult.rows[0].id;

            // Начисляем комиссию рефереру
            await query(
              'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
              [commission, referrerId]
            );

            // Создаем запись о транзакции для реферера
            await query(
              `INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
               VALUES (gen_random_uuid(), $1, 'referral_bonus', $2, 'completed', 'Реферальная комиссия (5% от депозита)', NOW())`,
              [referrerId, commission]
            );

            console.log(`✅ Referral commission ${commission} credited to user ${referrerId}`);
          }
        }

        await query('COMMIT');
        console.log('✅ Deposit request approved and balance updated');

      } catch (error) {
        await query('ROLLBACK');
        throw error;
      }

    } else {
      // Просто обновляем статус заявки
      const result = await query(
        `UPDATE deposit_requests 
         SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
         WHERE id = $4
         RETURNING *`,
        [status, admin_comment || null, admin.userId, requestId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
      }
    }

    console.log('✅ Deposit request updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Заявка обновлена успешно'
    });

  } catch (error) {
    console.error('❌ Error updating deposit request:', error);
    
    return NextResponse.json({
      error: 'Ошибка обновления заявки',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}