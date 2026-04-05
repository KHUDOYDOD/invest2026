import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const result = await pool.query(
        'SELECT * FROM blog_posts WHERE slug = $1 AND is_published = true',
        [slug]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        )
      }

      // Увеличиваем счетчик просмотров
      await pool.query(
        'UPDATE blog_posts SET views = views + 1 WHERE slug = $1',
        [slug]
      )

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      })
    }

    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC'
    )

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
