import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/server/db"

export async function POST(request: NextRequest) {
  console.log("🔵 Registration API called")
  
  try {
    const body = await request.json()
    console.log("📦 Request body:", { email: body.email, fullName: body.fullName, country: body.country, referralCode: body.referralCode })
    
    const { email, password, fullName, country, referralCode } = body

    // Валидация
    if (!email || !password || !fullName) {
      console.log("❌ Validation failed: missing fields")
      return NextResponse.json(
        { 
          success: false, 
          error: "Все поля обязательны для заполнения",
          field: !email ? "email" : !password ? "password" : "full_name"
        },
        { status: 400 }
      )
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Некорректный формат email",
          field: "email"
        },
        { status: 400 }
      )
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Пароль должен содержать минимум 6 символов",
          field: "password"
        },
        { status: 400 }
      )
    }

    console.log("🔌 Connecting to database...")
    console.log("📍 DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))
    
        console.log("✅ Database connected successfully!")

    try {
      // Проверяем, существует ли пользователь
      console.log("🔍 Checking if user exists...")
      const existingUser = await query(
        "SELECT id FROM users WHERE email = $1",
        [email.toLowerCase()]
      )
      console.log("✅ User check complete:", existingUser.rows.length > 0 ? "User exists" : "User not found")

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Пользователь с таким email уже существует",
            field: "email"
          },
          { status: 400 }
        )
      }

      // Хешируем пароль
      console.log("🔐 Hashing password...")
      const hashedPassword = await bcrypt.hash(password, 10)
      console.log("✅ Password hashed")

      // Генерируем реферальный код для нового пользователя
      const newUserReferralCode = 'REF' + Math.random().toString(36).substring(2, 10).toUpperCase()
      console.log("🎫 Generated referral code:", newUserReferralCode)

      // Проверяем реферальный код, если он был предоставлен
      let referredByCode = null
      if (referralCode) {
        console.log("🔍 Checking referral code:", referralCode)
        const referrerResult = await query(
          "SELECT referral_code FROM users WHERE referral_code = $1",
          [referralCode]
        )
        if (referrerResult.rows.length > 0) {
          referredByCode = referralCode
          console.log("✅ Valid referral code found")
        } else {
          console.log("⚠️ Invalid referral code, ignoring")
        }
      }

      // Создаем пользователя
      console.log("💾 Creating user in database...")
      const result = await query(
        `INSERT INTO users (
          email, 
          password_hash, 
          full_name, 
          country,
          referral_code,
          referred_by,
          balance,
          total_invested,
          total_earned,
          role_id,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 0, 0, 0, 3, 'active', NOW())
        RETURNING id, email, full_name, role_id, referral_code, balance, created_at`,
        [email.toLowerCase(), hashedPassword, fullName, country || null, newUserReferralCode, referredByCode]
      )

      const user = result.rows[0]
      console.log("✅ User created successfully:", user.id)

      // Создаем JWT токен (как при входе)
      const userRole = user.role_id === 1 ? 'super_admin' : user.role_id === 2 ? 'admin' : 'user';
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: userRole,
          isDemoMode: false
        },
        process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      )

      console.log("🎉 Registration successful!")
      return NextResponse.json({
        success: true,
        message: "Регистрация успешна!",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          full_name: user.full_name,
          role: userRole,
          referralCode: user.referral_code,
          balance: parseFloat(user.balance || 0),
          createdAt: user.created_at,
        },
        token,
        redirect: "/dashboard"
      })
    } finally {
      
    }
  } catch (error: any) {
    console.error("❌ Registration error:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
    })
    
    // Обработка специфичных ошибок PostgreSQL
    if (error.code === '23505') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Пользователь с таким email уже существует",
          field: "email"
        },
        { status: 400 }
      )
    }

    if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Ошибка подключения к базе данных. Проверьте, что PostgreSQL запущен." 
        },
        { status: 500 }
      )
    }

    if (error.code === '42703') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Ошибка структуры базы данных. Запустите setup-registration.bat" 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: `Ошибка при регистрации: ${error.message || 'Попробуйте позже.'}` 
      },
      { status: 500 }
    )
  }
}
