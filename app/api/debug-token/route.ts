import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'No token provided',
        authHeader: authHeader 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret';
      const decoded = jwt.verify(token, secret);
      
      return NextResponse.json({
        success: true,
        decoded: decoded,
        secret: secret.substring(0, 10) + '...',
        tokenLength: token.length
      });
    } catch (jwtError: any) {
      return NextResponse.json({
        error: 'Invalid token',
        jwtError: jwtError.message,
        token: token.substring(0, 50) + '...',
        secret: (process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret').substring(0, 10) + '...'
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: 'Server error',
      message: error.message
    });
  }
}