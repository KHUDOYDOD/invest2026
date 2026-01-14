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

export async function GET(request: NextRequest) {
  try {
    console.log('=== ADMIN GET DEPOSIT REQUESTS ===');
    
    // Проверяем права администратора
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    console.log('Admin verified:', admin.email);

    // Получаем все заявки на пополнение с информацией о пользователях
    const result = await query(
      `SELECT 
        dr.id,
        dr.user_id,
        dr.amount,
        dr.method,
        dr.payment_details,
        dr.status,
        dr.admin_comment,
        dr.created_at,
        dr.processed_at,
        dr.processed_by,
        u.full_name as user_name,
        u.email as user_email
      FROM deposit_requests dr
      LEFT JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 100`
    );

    console.log(`Found ${result.rows.length} deposit requests`);

    // Форматируем данные для фронтенда
    const requests = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      user_id: row.user_id,
      users: {
        id: row.user_id,
        full_name: row.user_name || 'Неизвестный пользователь',
        email: row.user_email || ''
      },
      userName: row.user_name || 'Неизвестный пользователь',
      userEmail: row.user_email || '',
      amount: parseFloat(row.amount),
      method: getMethodName(row.method),
      paymentDetails: row.payment_details,
      payment_details: row.payment_details,
      status: row.status,
      adminComment: row.admin_comment,
      admin_comment: row.admin_comment,
      createdAt: row.created_at,
      created_at: row.created_at,
      processedAt: row.processed_at,
      processed_at: row.processed_at,
      processedBy: row.processed_by
    }));

    return NextResponse.json({
      success: true,
      requests: requests
    });

  } catch (error) {
    console.error('❌ Error fetching admin deposit requests:', error);
    
    return NextResponse.json({
      error: 'Ошибка получения заявок на пополнение',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('=== ADMIN UPDATE DEPOSIT REQUEST ===');
    
    // Проверяем права администратора
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, status, adminComment } = body;

    if (!requestId || !status) {
      return NextResponse.json({ error: 'Не указаны обязательные поля' }, { status: 400 });
    }

    console.log('Updating request:', requestId, 'Status:', status);

    // Обновляем заявку
    const result = await query(
      `UPDATE deposit_requests 
       SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
       WHERE id = $4
       RETURNING *`,
      [status, adminComment || null, admin.userId, requestId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    console.log('✅ Request updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Заявка обновлена успешно',
      request: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating deposit request:', error);
    
    return NextResponse.json({
      error: 'Ошибка обновления заявки',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Функция для перевода названий методов оплаты
function getMethodName(method: string): string {
  const methodNames: Record<string, string> = {
    'bank_card': 'Банковская карта',
    'crypto': 'Криптовалюта',
    'bank_transfer': 'Банковский перевод',
    'e_wallet': 'Электронный кошелек',
    'cash': 'Наличные',
    'Банковская карта': 'Банковская карта',
    'Система быстрых платежей': 'СБП',
    'USDT TRC-20': 'USDT TRC-20'
  };
  
  return methodNames[method] || method;
}