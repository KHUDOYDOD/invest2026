import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import jwt from 'jsonwebtoken';
import { updateStatistics } from '@/lib/update-statistics';

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
    console.log('=== ADMIN UPDATE WITHDRAWAL REQUEST ===');
    
    // Проверяем права администратора
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const { status, admin_comment } = body;
    const requestId = params.id;

    console.log('Request details:', {
      requestId,
      status,
      admin_comment,
      adminUserId: admin.userId
    });

    if (!requestId || !status) {
      return NextResponse.json({ error: 'Не указаны обязательные поля' }, { status: 400 });
    }

    // Проверяем, что статус допустимый
    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      console.error('Invalid status:', status, 'Allowed:', allowedStatuses);
      return NextResponse.json({ 
        error: `Недопустимый статус: ${status}. Разрешены: ${allowedStatuses.join(', ')}` 
      }, { status: 400 });
    }

    console.log('Updating withdrawal request:', requestId, 'Status:', status);

    // Получаем информацию о заявке
    const requestResult = await query(
      'SELECT user_id, amount, final_amount FROM withdrawal_requests WHERE id = $1',
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    const { user_id, amount, final_amount } = requestResult.rows[0];

    // Начинаем транзакцию
    await query('BEGIN');

    try {
      // Обновляем заявку
      await query(
        `UPDATE withdrawal_requests 
         SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
         WHERE id = $4`,
        [status, admin_comment || null, admin.userId, requestId]
      );

      // Если заявка отклонена, возвращаем средства на баланс
      if (status === 'rejected') {
        await query(
          'UPDATE users SET balance = balance + $1 WHERE id = $2',
          [amount, user_id]
        );

        // Создаем запись о возврате средств
        await query(
          `INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
           VALUES (gen_random_uuid(), $1, 'refund', $2, 'completed', 'Возврат средств (заявка на вывод отклонена)', NOW())`,
          [user_id, amount]
        );

        console.log('✅ Withdrawal rejected and funds returned to balance');
      } else if (status === 'approved') {
        // Создаем запись о выводе средств
        await query(
          `INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
           VALUES (gen_random_uuid(), $1, 'withdrawal', $2, 'completed', 'Вывод средств (одобрено администратором)', NOW())`,
          [user_id, final_amount || amount]
        );

        console.log('✅ Withdrawal approved');
      }

      await query('COMMIT');

      // Обновляем статистику после изменения статуса заявки
      await updateStatistics();

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

    console.log('✅ Withdrawal request updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Заявка обновлена успешно'
    });

  } catch (error) {
    console.error('❌ Error updating withdrawal request:', error);
    
    return NextResponse.json({
      error: 'Ошибка обновления заявки',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}