import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Ищем пользователя в базе данных по email
    const userResult = await query(`
      SELECT 
        id,
        email,
        full_name,
        password_hash,
        role,
        status
      FROM users
      WHERE email = $1 AND status = 'active'
    `, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Пользователь с таким email не найден',
          field: 'email'
        },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Проверяем статус пользователя
    if (user.status !== 'active') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Аккаунт заблокирован или неактивен. Обратитесь к администратору.',
          field: 'status'
        },
        { status: 401 }
      );
    }

    // Проверяем пароль с использованием bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Неверный пароль',
          field: 'password'
        },
        { status: 401 }
      );
    }

    // Обновляем время последнего входа
    await query(`
      UPDATE users 
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [user.id]);

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role || 'user'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Определяем URL для редиректа на основе роли пользователя
    let redirectUrl = '/dashboard'; // По умолчанию обычные пользователи
    
    // Проверяем роль пользователя для админов
    if (user.role === 'admin' || user.role === 'super_admin') {
      redirectUrl = '/admin/dashboard'; // Админ
    } else {
      redirectUrl = '/dashboard'; // Обычные пользователи
    }

    const response = NextResponse.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role || 'user',
        isAdmin: user.role === 'admin' || user.role === 'super_admin'
      },
      token: token,
      redirect: redirectUrl
    });

    // Устанавливаем cookie с токеном
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при входе' },
      { status: 500 }
    );
  }
}