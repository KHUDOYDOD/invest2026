import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, login } = body

    // Используем либо username, либо login
    const loginField = username || login

    console.log('🔐 Попытка входа:', { loginField, password: password ? '***' : 'нет' })

    if (!loginField || !password) {
      return NextResponse.json({ success: false, error: "Логин и пароль обязательны" }, { status: 400 })
    }

    // Подключаемся к базе данных
    const client = await pool.connect()

    try {
      // Ищем пользователя по email или login
      const userQuery = `
        SELECT u.*, ur.name as role_name 
        FROM users u 
        LEFT JOIN user_roles ur ON u.role_id = ur.id 
        WHERE u.email = $1 OR u.login = $1
      `
      
      const userResult = await client.query(userQuery, [loginField])
      
      if (userResult.rows.length === 0) {
        console.log('❌ Пользователь не найден:', loginField)
        return NextResponse.json({ success: false, error: "Неверное имя пользователя или пароль" }, { status: 401 })
      }

      const user = userResult.rows[0]
      console.log('👤 Найден пользователь:', { id: user.id, email: user.email, login: user.login, role: user.role_name })

      // Проверяем пароль
      if (!user.password_hash) {
        console.log('❌ У пользователя нет пароля')
        return NextResponse.json({ success: false, error: "Неверное имя пользователя или пароль" }, { status: 401 })
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      
      if (!isValidPassword) {
        console.log('❌ Неверный пароль')
        return NextResponse.json({ success: false, error: "Неверное имя пользователя или пароль" }, { status: 401 })
      }

      // Проверяем, что это админ
      if (user.role_name !== 'admin' && user.role_name !== 'super_admin') {
        console.log('❌ Недостаточно прав:', user.role_name)
        return NextResponse.json({ success: false, error: "Недостаточно прав доступа" }, { status: 403 })
      }

      console.log('✅ Успешный вход админа')

      // Создаем JWT токен
      const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret'
      
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role_name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }
      
      const token = jwt.sign(tokenPayload, secret)

      // Set a cookie for authentication
      cookies().set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return NextResponse.json({
        success: true,
        token: token,
        user: {
          id: user.id,
          username: user.login || user.email,
          email: user.email,
          name: user.full_name,
          role: user.role_name,
        },
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, error: "Ошибка аутентификации" }, { status: 500 })
  }
}
