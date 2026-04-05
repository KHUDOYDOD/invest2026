import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
})

// GET - получить всех членов команды
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = 'SELECT * FROM team_members'
    if (activeOnly) {
      query += ' WHERE is_active = true'
    }
    query += ' ORDER BY display_order ASC, created_at DESC'

    const result = await pool.query(query)

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - создать нового члена команды
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, image_emoji, bio, email, linkedin, twitter, display_order } = body

    const result = await pool.query(
      `INSERT INTO team_members (name, role, image_emoji, bio, email, linkedin, twitter, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, role, image_emoji || '👤', bio, email, linkedin, twitter, display_order || 0]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - обновить члена команды
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, role, image_emoji, bio, email, linkedin, twitter, display_order, is_active } = body

    const result = await pool.query(
      `UPDATE team_members 
       SET name = $1, role = $2, image_emoji = $3, bio = $4, email = $5, 
           linkedin = $6, twitter = $7, display_order = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, role, image_emoji, bio, email, linkedin, twitter, display_order, is_active, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - удалить члена команды
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM team_members WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
