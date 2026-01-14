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
    // Используем тот же ключ, что и при создании токена
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    return decoded as any;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEPOSIT REQUEST DEBUG ===');
    
    // Проверяем заголовки
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header');
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Token length:', token.length);
    console.log('Token start:', token.substring(0, 20) + '...');

    // Проверяем токен
    let user;
    try {
      const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
      console.log('Using secret:', secret.substring(0, 10) + '...');
      user = jwt.verify(token, secret);
      console.log('✅ Token verified, user:', user);
    } catch (jwtError: any) {
      console.log('❌ JWT verification failed:', jwtError.message);
      return NextResponse.json({ error: 'Invalid token: ' + jwtError.message }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, paymentDetails } = body;
    console.log('Request body:', { amount, method, paymentDetails });

    if (!amount || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Creating deposit request for user:', (user as any).userId, 'Amount:', amount, 'Method:', method);

    const result = await query(
      `INSERT INTO deposit_requests (user_id, amount, method, payment_details, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING *`,
      [(user as any).userId, amount, method, JSON.stringify(paymentDetails)]
    );

    console.log('✅ Deposit request created successfully:', result.rows[0]);

    return NextResponse.json({
      success: true,
      message: 'Заявка на пополнение создана успешно',
      request: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating deposit request:', error);
    return NextResponse.json(
      { error: 'Failed to create deposit request: ' + (error as any).message },
      { status: 500 }
    );
  }
}