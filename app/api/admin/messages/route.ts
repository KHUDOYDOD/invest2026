import { NextResponse } from 'next/server'
import { query } from '@/server/db'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Verify admin token
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')
    
    if (!adminToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, message } = body

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, error: 'User ID and message are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const userCheck = await query(
      'SELECT id, email FROM users WHERE id = $1',
      [userId]
    )

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Insert message
    const messageResult = await query(
      `INSERT INTO messages (user_id, subject, message, status, priority, from_user, from_email, created_at)
       VALUES ($1, 'Сообщение от администратора', $2, 'new', 'high', 'Администратор', 'admin@investpro.com', NOW())
       RETURNING id, message, created_at`,
      [userId, message]
    )

    // Create notification for user
    await query(
      `INSERT INTO notifications (user_id, type, title, message, icon, color, created_at)
       VALUES ($1, 'info', 'Новое сообщение от администратора', $2, 'Mail', 'from-blue-500 to-indigo-600', NOW())`,
      [userId, message.substring(0, 100)]
    )

    return NextResponse.json({
      success: true,
      message: messageResult.rows[0]
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
