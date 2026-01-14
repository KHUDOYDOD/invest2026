import { NextRequest, NextResponse } from "next/server"
import { query } from "@/server/db"
// GET - Получить настройки уведомлений пользователя
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    let result = await query(
      `SELECT * FROM notification_preferences WHERE user_id = $1::integer`,
      [userId]
    )

    // Если настроек нет, создаем дефолтные
    if (result.rows.length === 0) {
      result = await query(
        `INSERT INTO notification_preferences (user_id)
        VALUES ($1::integer)
        RETURNING *`,
        [userId]
      )
    }

    return NextResponse.json({
      success: true,
      preferences: result.rows[0],
    })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json(
      { error: "Ошибка при получении настроек уведомлений" },
      { status: 500 }
    )
  }
}

// PUT - Обновить настройки уведомлений
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const {
      email_notifications,
      push_notifications,
      sms_notifications,
      deposit_notifications,
      withdrawal_notifications,
      referral_notifications,
      system_notifications,
      marketing_notifications,
    } = body

    const result = await query(
      `INSERT INTO notification_preferences (
        user_id,
        email_notifications,
        push_notifications,
        sms_notifications,
        deposit_notifications,
        withdrawal_notifications,
        referral_notifications,
        system_notifications,
        marketing_notifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        push_notifications = EXCLUDED.push_notifications,
        sms_notifications = EXCLUDED.sms_notifications,
        deposit_notifications = EXCLUDED.deposit_notifications,
        withdrawal_notifications = EXCLUDED.withdrawal_notifications,
        referral_notifications = EXCLUDED.referral_notifications,
        system_notifications = EXCLUDED.system_notifications,
        marketing_notifications = EXCLUDED.marketing_notifications,
        updated_at = NOW()
      RETURNING *`,
      [
        userId,
        email_notifications,
        push_notifications,
        sms_notifications,
        deposit_notifications,
        withdrawal_notifications,
        referral_notifications,
        system_notifications,
        marketing_notifications,
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Настройки уведомлений обновлены",
      preferences: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении настроек уведомлений" },
      { status: 500 }
    )
  }
}
