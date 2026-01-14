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
    // Проверяем права администратора
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('q') || '';

    if (searchQuery.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Поиск пользователей
    const usersResult = await query(
      `SELECT id, full_name, email, balance, created_at
       FROM users
       WHERE full_name ILIKE $1 OR email ILIKE $1
       LIMIT 5`,
      [`%${searchQuery}%`]
    );

    usersResult.rows.forEach(user => {
      results.push({
        id: `user-${user.id}`,
        type: 'user',
        title: user.full_name || user.email,
        subtitle: `Email: ${user.email} • Баланс: $${parseFloat(user.balance).toFixed(2)}`,
        url: `/admin/users?id=${user.id}`
      });
    });

    // Поиск заявок на вывод
    const withdrawalsResult = await query(
      `SELECT wr.id, wr.amount, wr.status, wr.created_at, u.full_name, u.email
       FROM withdrawal_requests wr
       LEFT JOIN users u ON wr.user_id = u.id
       WHERE u.full_name ILIKE $1 OR u.email ILIKE $1 OR CAST(wr.amount AS TEXT) LIKE $1
       ORDER BY wr.created_at DESC
       LIMIT 5`,
      [`%${searchQuery}%`]
    );

    withdrawalsResult.rows.forEach(req => {
      results.push({
        id: `withdrawal-${req.id}`,
        type: 'request',
        title: `Вывод $${parseFloat(req.amount).toFixed(2)}`,
        subtitle: `${req.full_name || req.email} • ${req.status} • ${new Date(req.created_at).toLocaleDateString('ru-RU')}`,
        url: `/admin/requests?type=withdrawal&id=${req.id}`
      });
    });

    // Поиск заявок на пополнение
    const depositsResult = await query(
      `SELECT dr.id, dr.amount, dr.status, dr.created_at, u.full_name, u.email
       FROM deposit_requests dr
       LEFT JOIN users u ON dr.user_id = u.id
       WHERE u.full_name ILIKE $1 OR u.email ILIKE $1 OR CAST(dr.amount AS TEXT) LIKE $1
       ORDER BY dr.created_at DESC
       LIMIT 5`,
      [`%${searchQuery}%`]
    );

    depositsResult.rows.forEach(req => {
      results.push({
        id: `deposit-${req.id}`,
        type: 'request',
        title: `Пополнение $${parseFloat(req.amount).toFixed(2)}`,
        subtitle: `${req.full_name || req.email} • ${req.status} • ${new Date(req.created_at).toLocaleDateString('ru-RU')}`,
        url: `/admin/requests?type=deposit&id=${req.id}`
      });
    });

    // Поиск транзакций
    const transactionsResult = await query(
      `SELECT t.id, t.type, t.amount, t.status, t.created_at, u.full_name, u.email
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE u.full_name ILIKE $1 OR u.email ILIKE $1 OR CAST(t.amount AS TEXT) LIKE $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [`%${searchQuery}%`]
    );

    transactionsResult.rows.forEach(tx => {
      results.push({
        id: `transaction-${tx.id}`,
        type: 'transaction',
        title: `${tx.type} $${parseFloat(tx.amount).toFixed(2)}`,
        subtitle: `${tx.full_name || tx.email} • ${tx.status} • ${new Date(tx.created_at).toLocaleDateString('ru-RU')}`,
        url: `/admin/transactions?id=${tx.id}`
      });
    });

    // Ограничиваем общее количество результатов
    const limitedResults = results.slice(0, 10);

    return NextResponse.json({
      success: true,
      results: limitedResults,
      total: results.length
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    
    return NextResponse.json({
      error: 'Ошибка поиска',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
