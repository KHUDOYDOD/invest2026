import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import jwt from "jsonwebtoken"

// GET - получить настройки статистики
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Statistics Settings GET - Request received")
    
    const authHeader = request.headers.get("authorization")
    console.log("Auth header:", authHeader ? "present" : "missing")
    
    let token: string | null = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
      console.log("Token extracted, length:", token.length)
    }

    if (!token) {
      console.error("❌ No token provided")
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret")
      console.log("✅ Token verified for user:", decoded.userId)
    } catch (error: any) {
      console.error("❌ Token verification failed:", error.message)
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 })
    }

    // Проверяем права администратора
    const userResult = await query("SELECT role FROM users WHERE id = $1", [decoded.userId])

    if (userResult.rows.length === 0 || userResult.rows[0].role !== "admin") {
      console.error("❌ Access denied for user:", decoded.userId, "role:", userResult.rows[0]?.role)
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    console.log("✅ Admin access granted")

    // Получаем настройки
    console.log("Fetching settings from database...")
    const result = await query(`
      SELECT * FROM statistics_settings ORDER BY id DESC LIMIT 1
    `)

    console.log("Query result:", result.rows.length, "rows")

    if (result.rows.length === 0) {
      console.error("❌ No settings found in database")
      return NextResponse.json({ error: "Настройки не найдены" }, { status: 404 })
    }

    console.log("✅ Statistics settings loaded successfully")
    return NextResponse.json({
      success: true,
      settings: result.rows[0],
    })
  } catch (error: any) {
    console.error("❌ Error fetching statistics settings:", error)
    return NextResponse.json(
      {
        error: "Ошибка получения настроек",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}

// PUT - обновить настройки статистики
export async function PUT(request: NextRequest) {
  try {
    console.log("📊 Statistics Settings PUT - Request received")
    
    const authHeader = request.headers.get("authorization")
    let token: string | null = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    }

    if (!token) {
      console.error("❌ No token provided")
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret")
      console.log("✅ Token verified for user:", decoded.userId)
    } catch (error: any) {
      console.error("❌ Token verification failed:", error.message)
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 })
    }

    // Проверяем права администратора
    const userResult = await query("SELECT role FROM users WHERE id = $1", [decoded.userId])

    if (userResult.rows.length === 0 || userResult.rows[0].role !== "admin") {
      console.error("❌ Access denied for user:", decoded.userId)
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    const {
      total_users,
      total_invested,
      total_paid,
      average_return,
      users_change,
      investments_change,
      payouts_change,
      profitability_change,
      use_real_data,
    } = await request.json()

    console.log("Updating settings:", { total_users, total_invested, use_real_data })

    // Обновляем настройки
    const result = await query(
      `UPDATE statistics_settings 
       SET 
         total_users = $1,
         total_invested = $2,
         total_paid = $3,
         average_return = $4,
         users_change = $5,
         investments_change = $6,
         payouts_change = $7,
         profitability_change = $8,
         use_real_data = $9,
         updated_at = NOW(),
         updated_by = $10
       WHERE id = (SELECT id FROM statistics_settings ORDER BY id DESC LIMIT 1)
       RETURNING *`,
      [
        total_users,
        total_invested,
        total_paid,
        average_return,
        users_change,
        investments_change,
        payouts_change,
        profitability_change,
        use_real_data,
        decoded.userId,
      ]
    )

    console.log(`✅ Statistics settings updated by admin ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      message: "Настройки статистики обновлены",
      settings: result.rows[0],
    })
  } catch (error: any) {
    console.error("❌ Error updating statistics settings:", error)
    return NextResponse.json(
      {
        error: "Ошибка обновления настроек",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
