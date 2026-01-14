import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    console.log(`Loading testimonials: limit=${limit}, page=${page}`)

    // Получаем одобренные отзывы с информацией о пользователях
    const testimonialsResult = await query(`
      SELECT 
        t.id,
        t.rating,
        t.title,
        t.content,
        t.created_at,
        t.approved_at,
        u.full_name,
        u.email,
        u.avatar_url,
        u.country,
        u.city
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'approved'
      ORDER BY t.approved_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    // Получаем общее количество одобренных отзывов
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM testimonials 
      WHERE status = 'approved'
    `)

    const testimonials = testimonialsResult.rows.map(testimonial => ({
      id: testimonial.id,
      rating: testimonial.rating,
      title: testimonial.title,
      content: testimonial.content,
      user: {
        name: testimonial.full_name || 'Анонимный пользователь',
        email: testimonial.email,
        avatar: testimonial.avatar_url || '/placeholder-avatar.png',
        location: testimonial.city && testimonial.country 
          ? `${testimonial.city}, ${testimonial.country}`
          : testimonial.country || 'Не указано'
      },
      createdAt: testimonial.created_at,
      approvedAt: testimonial.approved_at
    }))

    const total = parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    console.log(`✅ Loaded ${testimonials.length} testimonials (${total} total)`)

    return NextResponse.json({
      success: true,
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    })

  } catch (error) {
    console.error("Error loading testimonials:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load testimonials" },
      { status: 500 }
    )
  }
}