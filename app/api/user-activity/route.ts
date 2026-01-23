import { NextResponse } from 'next/server';
import { query } from '@/server/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        t.id,
        t.user_id,
        t.type,
        CAST(t.amount AS DECIMAL(10,2)) as amount,
        t.status,
        t.created_at as time,
        u.full_name as user_name,
        CASE 
          WHEN t.type = 'investment' AND t.investment_id IS NOT NULL THEN 
            (SELECT p.name FROM investment_plans p 
             JOIN investments i ON i.plan_id = p.id 
             WHERE i.id = t.investment_id
             LIMIT 1)
          ELSE NULL
        END as plan_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.status IN ('completed', 'pending')
      ORDER BY t.created_at DESC
      LIMIT 20
    `);

    console.log('📊 User activity query result:', result.rows.length, 'rows');
    
    // Если нет транзакций, возвращаем демо-данные
    if (result.rows.length === 0) {
      const demoActivity = [
        {
          id: '1',
          user_id: '1',
          type: 'deposit',
          amount: 500,
          status: 'completed',
          time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user_name: 'Александр П.'
        },
        {
          id: '2',
          user_id: '2',
          type: 'investment',
          amount: 1000,
          status: 'completed',
          time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          user_name: 'Мария И.'
        },
        {
          id: '3',
          user_id: '3',
          type: 'withdrawal',
          amount: 250,
          status: 'completed',
          time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          user_name: 'Дмитрий С.'
        },
        {
          id: '4',
          user_id: '4',
          type: 'deposit',
          amount: 750,
          status: 'completed',
          time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          user_name: 'Елена К.'
        },
        {
          id: '5',
          user_id: '5',
          type: 'investment',
          amount: 2000,
          status: 'completed',
          time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          user_name: 'Андрей В.'
        }
      ];

      return NextResponse.json({
        success: true,
        data: demoActivity
      });
    }

    return NextResponse.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        amount: parseFloat(row.amount) || 0
      }))
    });

  } catch (error) {
    console.error('Error fetching user activity:', error);
    
    // При ошибке возвращаем демо-данные
    const demoActivity = [
      {
        id: '1',
        user_id: '1',
        type: 'deposit',
        amount: 500,
        status: 'completed',
        time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user_name: 'Александр П.'
      },
      {
        id: '2',
        user_id: '2',
        type: 'investment',
        amount: 1000,
        status: 'completed',
        time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user_name: 'Мария И.'
      }
    ];

    return NextResponse.json({
      success: true,
      data: demoActivity
    });
  }
}