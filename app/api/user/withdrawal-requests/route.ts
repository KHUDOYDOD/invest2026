import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    console.log('=== GET USER WITHDRAWAL REQUESTS ===');
    
    // Получаем userId из URL параметров
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('Requested userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Сначала проверим, существует ли таблица withdrawal_requests
    try {
      const result = await query(
        `SELECT 
          id,
          user_id,
          amount,
          method,
          status,
          admin_comment,
          created_at,
          processed_at,
          processed_by
        FROM withdrawal_requests 
        WHERE user_id = $1 
        ORDER BY created_at DESC`,
        [userId]
      );

      console.log(`Found ${result.rows.length} withdrawal requests for user ${userId}`);

      // Форматируем данные для фронтенда
      const requests = result.rows.map(row => ({
        id: row.id,
        amount: parseFloat(row.amount),
        method: row.method,
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

    } catch (dbError: any) {
      console.log('Withdrawal requests table error:', dbError.message);
      
      // Если таблица не существует или есть ошибки, возвращаем пустой массив
      return NextResponse.json({
        success: true,
        requests: []
      });
    }

  } catch (error) {
    console.error('❌ Error fetching withdrawal requests:', error);
    
    return NextResponse.json({
      success: true,
      requests: []
    });
  }
}