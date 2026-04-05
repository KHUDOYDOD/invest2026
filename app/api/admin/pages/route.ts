import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
})

// GET - получить все страницы или одну по slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const result = await pool.query(
        'SELECT * FROM pages WHERE slug = $1',
        [slug]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      })
    }

    const result = await pool.query('SELECT * FROM pages ORDER BY created_at DESC')

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - создать страницу
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, content, meta_description, is_published } = body

    const result = await pool.query(
      `INSERT INTO pages (slug, title, content, meta_description, is_published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slug, title, content, meta_description, is_published ?? true]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - обновить страницу
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, slug, title, content, meta_description, is_published } = body

    const result = await pool.query(
      `UPDATE pages 
       SET slug = $1, title = $2, content = $3, meta_description = $4, is_published = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [slug, title, content, meta_description, is_published, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - удалить страницу
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

    await pool.query('DELETE FROM pages WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
