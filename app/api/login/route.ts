import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

// Демо-пользователи (используются когда БД недоступна)
const DEMO_USERS = [
  {
    id: 'demo-admin-1',
    email: 'admin@demo.com',
    password: 'admin123',
    full_name: 'Администратор Демо',
    role: 'admin',
    balance: 50000.00
  },
  {
    id: 'demo-user-1',
    email: 'user@demo.com',
    password: 'user123',
    full_name: 'Пользователь Демо',
    role: 'user',
    balance: 10000.00
  },
  {
    id: 'demo-creator-1',
    email: 'creator@investpro.com',
    password: 'SuperAdmin2025!',
    full_name: 'Создатель Системы',
    role: 'super_admin',
    balance: 0.00
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email и пароль обязательны' 
      }, { status: 400 })
    }

    console.log('Attempting login for:', email)

    let user: any = null
    let role = 'user'
    let isDemoMode = false

    // Пытаемся подключиться к базе данных
    try {
      // Поиск пользователя по email (нечувствительно к регистру)
      const userResult = await query(
        'SELECT id, full_name, email, password_hash, role_id, balance, status FROM users WHERE LOWER(email) = LOWER($1)',
        [email]
      )

      if (userResult.rows.length === 0) {
        console.log('User not found in database:', email)
        return NextResponse.json({ 
          success: false, 
          error: 'Неверный email или пароль' 
        }, { status: 401 })
      }

      user = userResult.rows[0]
      
      // Проверка активности аккаунта
      if (user.status !== 'active') {
        console.log('Account is inactive:', email)
        return NextResponse.json({ 
          success: false, 
          error: 'Аккаунт деактивирован. Обратитесь в поддержку.' 
        }, { status: 403 })
      }

      console.log('Found user in database:', user.email, 'Role ID:', user.role_id)

      // Проверка пароля
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        console.log('Invalid password for user:', email)
        return NextResponse.json({ 
          success: false, 
          error: 'Неверный email или пароль' 
        }, { status: 401 })
      }

      // Преобразуем role_id в роль
      role = user.role_id === 1 ? 'super_admin' : user.role_id === 2 ? 'admin' : 'user'

      // Обновляем время последнего входа
      await query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      )

    } catch (dbError: any) {
      // Если база данных недоступна, используем демо-режим
      console.log('⚠️  Database unavailable, using DEMO mode')
      console.log('Database error:', dbError.message)
      
      isDemoMode = true
      
      // Ищем пользователя в демо-данных
      const demoUser = DEMO_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      )

      if (!demoUser) {
        console.log('Demo user not found:', email)
        return NextResponse.json({ 
          success: false, 
          error: 'Неверный email или пароль' 
        }, { status: 401 })
      }

      // Проверка пароля (простое сравнение для демо)
      if (password !== demoUser.password) {
        console.log('Invalid demo password for user:', email)
        return NextResponse.json({ 
          success: false, 
          error: 'Неверный email или пароль' 
        }, { status: 401 })
      }

      user = {
        id: demoUser.id,
        full_name: demoUser.full_name,
        email: demoUser.email,
        balance: demoUser.balance
      }
      role = demoUser.role

      console.log('✅ Demo login successful for:', demoUser.email, 'Role:', role)
    }

    // Создание JWT токена (используем NEXTAUTH_SECRET как основной ключ)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: role,
        isDemoMode: isDemoMode
      },
      process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    console.log('✅ Successful login for:', user.email, 'Role:', role, isDemoMode ? '(DEMO MODE)' : '')

    // Определяем redirect в зависимости от роли
    let redirect = '/dashboard'
    if (role === 'super_admin' || role === 'admin') {
      redirect = '/admin/dashboard'
    }

    return NextResponse.json({
      success: true,
      message: isDemoMode ? 'Успешная авторизация (ДЕМО-РЕЖИМ)' : 'Успешная авторизация',
      token,
      redirect,
      isDemoMode,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: role,
        balance: user.balance,
        isAdmin: role === 'super_admin' || role === 'admin'
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Ошибка сервера' 
    }, { status: 500 })
  }
}
