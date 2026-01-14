import { NextResponse } from 'next/server'
import { query } from '@/server/db'
import { cookies } from 'next/headers'

// PATCH - Update user
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    const emailCheck = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    )

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Update user
    const result = await query(
      `UPDATE users 
       SET full_name = $1, email = $2
       WHERE id = $3
       RETURNING id, full_name, email`,
      [name, email, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
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
        { success: false, error: 'Cannot delete admin users' },
        { status: 403 }
      )
    }

    // Delete user's related data first
    await query('DELETE FROM investments WHERE user_id = $1', [userId])
    await query('DELETE FROM transactions WHERE user_id = $1', [userId])
    await query('DELETE FROM deposit_requests WHERE user_id = $1', [userId])
    await query('DELETE FROM withdrawal_requests WHERE user_id = $1', [userId])
    await query('DELETE FROM messages WHERE user_id = $1', [userId])
    await query('DELETE FROM notifications WHERE user_id = $1', [userId])

    // Delete user
    await query('DELETE FROM users WHERE id = $1', [userId])

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
