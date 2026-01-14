import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authorization required" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    // Получаем все отзывы пользователя
    const result = await query(`
      SELECT 
        id,
        rating,
        title,
        content,
        status,
        admin_comment,
        created_at,
        updated_at,
        approved_at
      FROM testimonials
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [decoded.userId])

    const testimonials = result.rows.map(testimonial => ({
      id: testimonial.id,
      rating: testimonial.rating,
      title: testimonial.title,
      content: testimonial.content,
      status: testimonial.status,
      adminComment: testimonial.admin_comment,
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at,
      approvedAt: testimonial.approved_at
    }))

    console.log(`✅ Loaded ${testimonials.length} testimonials for user ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      testimonials
    })

  } catch (error) {
    console.error("Error loading user testimonials:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load testimonials" },
      { status: 500 }
    )
  }
}