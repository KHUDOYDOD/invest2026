import { NextResponse } from 'next/server'
import { query } from '@/server/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        id,
        email,
        full_name,
        balance,
        status,
        created_at,
        last_login
      FROM users
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      success: true,
      users: result.rows
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
