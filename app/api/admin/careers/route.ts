import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
})

// GET - получить все вакансии
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = 'SELECT * FROM careers'
    if (activeOnly) {
      query += ' WHERE is_active = true'
    }
    query += ' ORDER BY created_at DESC'

    const result = await pool.query(query)

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching careers:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - создать вакансию
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, department, location, type, description, requirements, responsibilities, salary_range } = body

    const result = await pool.query(
      `INSERT INTO careers (title, department, location, type, description, requirements, responsibilities, salary_range)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, department, location, type, description, requirements, responsibilities, salary_range]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error creating career:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - обновить вакансию
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, department, location, type, description, requirements, responsibilities, salary_range, is_active } = body

    const result = await pool.query(
      `UPDATE careers 
       SET title = $1, department = $2, location = $3, type = $4, description = $5,
           requirements = $6, responsibilities = $7, salary_range = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [title, department, location, type, description, requirements, responsibilities, salary_range, is_active, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Career not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error updating career:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - удалить вакансию
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

    await pool.query('DELETE FROM careers WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Career deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting career:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
