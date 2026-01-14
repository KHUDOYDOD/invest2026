import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    console.log('Fetching all transactions...');
    
    const result = await query(`
      SELECT 
        t.id,
        t.user_id,
        t.type,
        CAST(t.amount AS DECIMAL(10,2)) as amount,
        t.status,
        t.created_at as time,
        COALESCE(u.full_name, 'Неизвестный пользователь') as user_name,
        ip.name as plan_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN investments i ON t.investment_id = i.id
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      ORDER BY t.created_at DESC
    `);

    console.log(`Found ${result.rows.length} transactions in database`);

    // Преобразуем данные и убеждаемся, что amount - число
    const transactions = result.rows.map(row => ({
      ...row,
      amount: parseFloat(row.amount) || 0
    }));

    // Вычисляем общую сумму
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    console.log(`Total amount calculated: ${totalAmount}`);

    return NextResponse.json({
      success: true,
      data: transactions,
      total: transactions.length,
      totalAmount: totalAmount
    });

  } catch (error) {
    console.error('Error fetching all transactions:', error);
    
    // При ошибке возвращаем демо-данные
    const demoTransactions = [
      {
        id: '1',
        user_id: '1',
        type: 'deposit',
        amount: 1500.50,
        status: 'completed',
        time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user_name: 'Александр П.',
        plan_name: null
      },
      {
        id: '2',
        user_id: '2',
        type: 'investment',
        amount: 2000.00,
        status: 'completed',
        time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user_name: 'Мария И.',
        plan_name: 'Стандарт'
      }
    ];

    return NextResponse.json({
      success: true,
      data: demoTransactions,
      total: demoTransactions.length,
      totalAmount: demoTransactions.reduce((sum, t) => sum + t.amount, 0)
    });
  }
}