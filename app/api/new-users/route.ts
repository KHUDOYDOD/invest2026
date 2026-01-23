import { NextResponse } from 'next/server';
import { query } from '@/server/db';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id,
        full_name,
        email,
        country,
        balance,
        total_invested,
        total_earned,
        avatar_url,
        created_at
      FROM users 
      WHERE status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 10`
    );

    // Если нет пользователей, создаем демо-данные
    if (result.rows.length === 0) {
      const demoUsers = [
        {
          full_name: 'Александр Петров',
          email: 'alex@example.com',
          country: 'Russia',
          balance: 5000,
          total_invested: 2000,
          total_earned: 300,
          avatar_url: '/avatars/user1.png'
        },
        {
          full_name: 'Мария Иванова',
          email: 'maria@example.com',
          country: 'Ukraine',
          balance: 3500,
          total_invested: 1500,
          total_earned: 225,
          avatar_url: '/avatars/user2.png'
        },
        {
          full_name: 'John Smith',
          email: 'john@example.com',
          country: 'USA',
          balance: 8000,
          total_invested: 5000,
          total_earned: 750,
          avatar_url: '/avatars/user3.png'
        }
      ];

      return NextResponse.json(demoUsers, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching new users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new users' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}