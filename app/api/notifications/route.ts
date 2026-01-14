import { NextRequest, NextResponse } from "next/server"
import { query } from "@/server/db"
// GET - Получить все уведомления пользователя
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // all, unread, transactions, system
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = `
      SELECT 
        id,
        type,
        title,
        message,
        icon,
        color,
        is_read,
        action_url,
        metadata,
        created_at,
        read_at
      FROM notifications
      WHERE user_id = $1::integer
    `

    const params: any[] = [userId]

    if (type === "unread") {
      query += " AND is_read = false"
    } else if (type === "transactions") {
      query += " AND type IN ('success', 'bonus')"
    } else if (type === "system") {
      query += " AND type = 'system'"
    }

    query += " ORDER BY created_at DESC LIMIT $2"
    params.push(limit)

    const result = await query(query, params)

    // Получаем статистику
    const statsResult = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_read = false) as unread,
        COUNT(*) FILTER (WHERE is_read = true) as read
      FROM notifications
      WHERE user_id = $1::integer`,
      [userId]
    )

    return NextResponse.json({
      success: true,
      notifications: result.rows,
      stats: statsResult.rows[0],
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Ошибка при получении уведомлений" }, { status: 500 })
  }
}

// POST - Создать новое уведомление (обычно используется системой)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, icon, color, actionUrl, metadata } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "userId, type, title и message обязательны" },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        icon,
        color,
        action_url,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [userId, type, title, message, icon, color, actionUrl, JSON.stringify(metadata || {})]
    )

    return NextResponse.json({
      success: true,
      message: "Уведомление создано",
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Ошибка при создании уведомления" }, { status: 500 })
  }
}

// PATCH - Отметить уведомление как прочитанное
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // Отметить все уведомления как прочитанные
      await query(
        `UPDATE notifications
        SET is_read = true, read_at = NOW()
        WHERE user_id = $1::integer AND is_read = false`,
        [userId]
      )

      return NextResponse.json({
        success: true,
        message: "Все уведомления отмечены как прочитанные",
      })
    }

    if (!notificationId) {
      return NextResponse.json({ error: "ID уведомления обязателен" }, { status: 400 })
    }

    const result = await query(
      `UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE id = $1 AND user_id = $2::integer
      RETURNING *`,
      [notificationId, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Уведомление не найдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Уведомление отмечено как прочитанное",
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Ошибка при обновлении уведомления" }, { status: 500 })
  }
}

// DELETE - Удалить уведомление
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")
    const deleteAll = searchParams.get("all") === "true"

    if (deleteAll) {
      // Удалить все уведомления
      await query("DELETE FROM notifications WHERE user_id = $1::integer", [userId])

      return NextResponse.json({
        success: true,
        message: "Все уведомления удалены",
      })
    }

    if (!notificationId) {
      return NextResponse.json({ error: "ID уведомления обязателен" }, { status: 400 })
    }

    const result = await query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2::integer RETURNING id",
      [notificationId, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Уведомление не найдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Уведомление удалено",
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Ошибка при удалении уведомления" }, { status: 500 })
  }
}
