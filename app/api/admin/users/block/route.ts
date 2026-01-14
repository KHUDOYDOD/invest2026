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
    const { userId, status } = body

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
        { status: 400 }
      )
    }

    if (status !== 'active' && status !== 'blocked') {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be "active" or "blocked"' },
        { status: 400 }
      )
    }

    // Check if user is admin
    const userCheck = await query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    )

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (userCheck.rows[0].role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot block admin users' },
        { status: 403 }
      )
    }

    // Update user status
    const result = await query(
      `UPDATE users 
       SET status = $1
       WHERE id = $2
       RETURNING id, status`,
      [status, userId]
    )

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}
