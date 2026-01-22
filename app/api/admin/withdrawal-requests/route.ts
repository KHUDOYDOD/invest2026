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
    console.log('=== ADMIN GET WITHDRAWAL REQUESTS ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    // Проверяем права администратора
    const admin = verifyAdminToken(request);
    if (!admin) {
      console.log('❌ Admin verification failed');
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    console.log('✅ Admin verified:', admin.email, 'Role:', admin.role);

    // Получаем все заявки на вывод с информацией о пользователях
    console.log('📤 Executing database query...');
    const result = await query(
      `SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.wallet_address,
        wr.card_number,
        wr.card_holder_name,
        wr.bank_name,
        wr.phone_number,
        wr.account_holder_name,
        wr.crypto_network,
        wr.fee,
        wr.final_amount,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        wr.processed_by,
        u.full_name as user_name,
        u.email as user_email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 100`
    );

    console.log(`✅ Found ${result.rows.length} withdrawal requests`);
    
    if (result.rows.length > 0) {
      console.log('📋 First request:', {
        id: result.rows[0].id,
        user: result.rows[0].user_name,
        amount: result.rows[0].amount,
        status: result.rows[0].status
      });
    }

    // Форматируем данные для фронтенда
    const requests = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      users: {
        id: row.user_id,
        full_name: row.user_name || 'Неизвестный пользователь',
        email: row.user_email || ''
      },
      amount: parseFloat(row.amount),
      method: getMethodName(row.method),
      wallet_address: row.wallet_address,
      card_number: row.card_number,
      card_holder_name: row.card_holder_name,
      bank_name: row.bank_name,
      phone_number: row.phone_number,
      account_holder_name: row.account_holder_name,
      crypto_network: row.crypto_network,
      fee: parseFloat(row.fee || 0),
      final_amount: parseFloat(row.final_amount || row.amount),
      status: row.status,
      admin_comment: row.admin_comment,
      created_at: row.created_at,
      processed_at: row.processed_at,
      processed_by: row.processed_by
    }));

    // Логируем первую заявку с реквизитами
    if (requests.length > 0 && requests[0].card_number) {
      console.log('📋 First request with card details:', {
        id: requests[0].id,
        card_number: requests[0].card_number,
        card_holder_name: requests[0].card_holder_name
      });
    }

    return NextResponse.json({
      success: true,
      requests: requests
    });

  } catch (error) {
    console.error('❌ Error fetching admin withdrawal requests:', error);
    
    return NextResponse.json({
      error: 'Ошибка получения заявок на вывод',
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
    'usdt': 'USDT',
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum'
  };
  
  return methodNames[method] || method;
}