import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import jwt from 'jsonwebtoken';

// Функция для проверки токена
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    return decoded as any;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== GET USER DEPOSIT REQUESTS ===');
    
    // Получаем userId из URL параметров
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('Requested userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Получаем заявки на пополнение для пользователя
    const result = await query(
      `SELECT 
        id,
        user_id,
        amount,
        method,
        payment_details,
        status,
        admin_comment,
        created_at,
        processed_at,
        processed_by
      FROM deposit_requests 
      WHERE user_id = $1 
      ORDER BY created_at DESC`,
      [userId]
    );

    console.log(`Found ${result.rows.length} deposit requests for user ${userId}`);

    // Форматируем данные для фронтенда
    const requests = result.rows.map(row => ({
      id: row.id,
      amount: parseFloat(row.amount),
      method: getMethodName(row.method),
      paymentDetails: row.payment_details,
      status: row.status,
      adminComment: row.admin_comment,
      createdAt: row.created_at,
      processedAt: row.processed_at,
      processedBy: row.processed_by
    }));

    return NextResponse.json({
      success: true,
      requests: requests
    });

  } catch (error) {
    console.error('❌ Error fetching deposit requests:', error);
    
    // В случае ошибки возвращаем пустой массив
    return NextResponse.json({
      success: true,
      requests: []
    });
  }
}

// Функция для перевода названий методов оплаты
function getMethodName(method: string): string {
  const methodNames: Record<string, string> = {
    'bank_card': 'Банковская карта',
    'crypto': 'Криптовалюта',
    'bank_transfer': 'Банковский перевод',
    'e_wallet': 'Электронный кошелек',
    'cash': 'Наличные'
  };
  
  return methodNames[method] || method;
}