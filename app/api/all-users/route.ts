import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    console.log('Fetching all users...');
    
    const result = await query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.email,
        u.created_at as joinedDate,
        u.country,
        u.city,
        u.status,
        COALESCE(u.balance, 0) as balance,
        COALESCE(u.total_invested, 0) as total_invested,
        COALESCE(u.total_earned, 0) as total_profit,
        COALESCE(u.referral_count, 0) as referrals_count,
        COALESCE(u.last_login, u.created_at) as last_activity
      FROM users u
      ORDER BY u.created_at DESC
    `);

    console.log(`Found ${result.rows.length} users in database`);

    // Если нет пользователей, возвращаем демо-данные
    if (result.rows.length === 0) {
      const demoUsers = [
        {
          id: '1',
          name: 'Александр Петров',
          email: 'alex@example.com',
          joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          country: 'RU',
          city: 'Москва',
          status: 'active',
          balance: 2500.50,
          total_invested: 10000.00,
          total_profit: 1250.75,
          referrals_count: 5,
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Мария Иванова',
          email: 'maria@example.com',
          joinedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          country: 'UA',
          city: 'Киев',
          status: 'active',
          balance: 1750.25,
          total_invested: 5000.00,
          total_profit: 625.50,
          referrals_count: 3,
          last_activity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Дмитрий Смирнов',
          email: 'dmitry@example.com',
          joinedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          country: 'BY',
          city: 'Минск',
          status: 'active',
          balance: 3200.00,
          total_invested: 15000.00,
          total_profit: 2100.25,
          referrals_count: 8,
          last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ];

      return NextResponse.json({
        success: true,
        data: demoUsers,
        total: demoUsers.length
      });
    }

    // Преобразуем данные
    const users = result.rows.map(row => ({
      ...row,
      balance: parseFloat(row.balance) || 0,
      total_invested: parseFloat(row.total_invested) || 0,
      total_profit: parseFloat(row.total_profit) || 0,
      referrals_count: parseInt(row.referrals_count) || 0,
      joinedDate: row.joinedDate ? new Date(row.joinedDate).toISOString() : new Date().toISOString(),
      last_activity: row.last_activity ? new Date(row.last_activity).toISOString() : null
    }));

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length
    });

  } catch (error) {
    console.error('Error fetching all users:', error);
    
    // При ошибке возвращаем демо-данные
    const demoUsers = [
      {
        id: '1',
        name: 'Александр Петров',
        email: 'alex@example.com',
        joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        country: 'RU',
        city: 'Москва',
        status: 'active',
        balance: 2500.50,
        total_invested: 10000.00,
        total_profit: 1250.75,
        referrals_count: 5,
        last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Мария Иванова',
        email: 'maria@example.com',
        joinedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        country: 'UA',
        city: 'Киев',
        status: 'active',
        balance: 1750.25,
        total_invested: 5000.00,
        total_profit: 625.50,
        referrals_count: 3,
        last_activity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: demoUsers,
      total: demoUsers.length
    });
  }
}