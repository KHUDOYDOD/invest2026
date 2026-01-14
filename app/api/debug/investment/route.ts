import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Investment creation request received');
    
    // Логируем заголовки
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 Headers:', headers);
    
    // Проверяем авторизацию
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Auth header:', authHeader ? 'EXISTS' : 'MISSING');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'No authorization header',
        debug: { authHeader: authHeader || 'null' }
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('🎫 Token length:', token.length);
    
    // Проверяем токен
    try {
      const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
      console.log('🔑 Using secret:', secret.substring(0, 10) + '...');
      
      const decoded = jwt.verify(token, secret) as any;
      console.log('✅ Token decoded:', { userId: decoded.userId, email: decoded.email });
      
      // Проверяем тело запроса
      const body = await request.json();
      console.log('📦 Request body:', body);
      
      // Проверяем пользователя в базе
      const userResult = await query('SELECT id, email, balance FROM users WHERE id = $1', [decoded.userId]);
      console.log('👤 User from DB:', userResult.rows[0] || 'NOT FOUND');
      
      // Проверяем план
      if (body.planId) {
        const planResult = await query('SELECT id, name, daily_percent, duration FROM investment_plans WHERE id = $1', [body.planId]);
        console.log('📋 Plan from DB:', planResult.rows[0] || 'NOT FOUND');
      }
      
      return NextResponse.json({
        success: true,
        debug: {
          tokenValid: true,
          userId: decoded.userId,
          userExists: userResult.rows.length > 0,
          userBalance: userResult.rows[0]?.balance || 0,
          requestBody: body,
          planExists: body.planId ? (await query('SELECT id FROM investment_plans WHERE id = $1', [body.planId])).rows.length > 0 : false
        }
      });
      
    } catch (tokenError) {
      console.error('❌ Token verification failed:', tokenError);
      return NextResponse.json({ 
        error: 'Invalid token',
        debug: { tokenError: tokenError.message }
      }, { status: 401 });
    }
    
  } catch (error) {
    console.error('💥 Debug endpoint error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint error',
      debug: { message: error.message, stack: error.stack }
    }, { status: 500 });
  }
}