import { NextResponse } from 'next/server'
import { pool } from '@/server/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, title, description, 
        launch_date, countdown_end, is_launched, 
        is_active, show_on_site, show_countdown,
        position, icon_type, background_type, color_scheme,
        created_at, updated_at
      FROM project_launches 
      WHERE is_active = true
      ORDER BY position ASC, launch_date ASC
    `)

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error fetching project launches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      title,
      description,
      launch_date,
      countdown_end,
      show_countdown = true,
      icon_type = 'rocket',
      color_scheme = 'blue',
      position = 1
    } = body

    const result = await pool.query(`
      INSERT INTO project_launches (
        name, title, description, launch_date, countdown_end,
        show_countdown, icon_type, color_scheme, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, title, description, launch_date, countdown_end, show_countdown, icon_type, color_scheme, position])

    return NextResponse.json(result.rows[0])

  } catch (error) {
    console.error('Error creating project launch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      title,
      description,
      launch_date,
      countdown_end,
      is_launched,
      show_countdown,
      icon_type,
      color_scheme,
      position
    } = body

    const result = await pool.query(`
      UPDATE project_launches 
      SET 
        name = $2,
        title = $3,
        description = $4,
        launch_date = $5,
        countdown_end = $6,
        is_launched = $7,
        show_countdown = $8,
        icon_type = $9,
        color_scheme = $10,
        position = $11,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id, name, title, description, launch_date, countdown_end, is_launched, show_countdown, icon_type, color_scheme, position])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project launch not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])

  } catch (error) {
    console.error('Error updating project launch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const result = await pool.query(`
      DELETE FROM project_launches 
      WHERE id = $1
      RETURNING *
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project launch not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting project launch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}