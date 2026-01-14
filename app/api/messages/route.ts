import { NextRequest, NextResponse } from "next/server"
import { query } from "@/server/db"
// GET - Получить все сообщения пользователя
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const result = await query(
      `SELECT 
        id,
        subject,
        message,
        status,
        priority,
        from_user,
        from_email,
        admin_reply,
        is_read,
        created_at,
        replied_at
      FROM messages
      WHERE user_id = $1::integer
      ORDER BY created_at DESC`,
      [userId]
    )

    return NextResponse.json({
      success: true,
      messages: result.rows,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Ошибка при получении сообщений" }, { status: 500 })
  }
}

// POST - Создать новое сообщение
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { subject, message, priority = "medium" } = body

    if (!subject || !message) {
      return NextResponse.json({ error: "Тема и сообщение обязательны" }, { status: 400 })
    }

    // Получаем данные пользователя
    const userResult = await query(
      "SELECT full_name, email FROM users WHERE id = $1::integer",
      [userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Создаем сообщение
    const result = await query(
      `INSERT INTO messages (
        user_id,
        subject,
        message,
        priority,
        from_user,
        from_email,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'new')
      RETURNING *`,
      [userId, subject, message, priority, user.full_name, user.email]
    )

    // Создаем уведомление для админов
    await query(
      `INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        icon,
        color
      )
      SELECT 
        id,
        'info',
        'Новое сообщение от пользователя',
        $1,
        'MessageCircle',
        'from-blue-500 to-cyan-600'
      FROM users
      WHERE role_id = 1`,
      [`Пользователь ${user.full_name} отправил новое сообщение: ${subject}`]
    )

    return NextResponse.json({
      success: true,
      message: "Сообщение успешно отправлено",
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Ошибка при отправке сообщения" }, { status: 500 })
  }
}

// PATCH - Отметить сообщение как прочитанное
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { messageId, isRead } = body

    if (!messageId) {
      return NextResponse.json({ error: "ID сообщения обязателен" }, { status: 400 })
    }

    const result = await query(
      `UPDATE messages
      SET is_read = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3::integer
      RETURNING *`,
      [isRead, messageId, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Статус сообщения обновлен",
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Ошибка при обновлении сообщения" }, { status: 500 })
  }
}

// DELETE - Удалить сообщение
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get("id")

    if (!messageId) {
      return NextResponse.json({ error: "ID сообщения обязателен" }, { status: 400 })
    }

    const result = await query(
      "DELETE FROM messages WHERE id = $1 AND user_id = $2::integer RETURNING id",
      [messageId, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Сообщение успешно удалено",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Ошибка при удалении сообщения" }, { status: 500 })
  }
}
