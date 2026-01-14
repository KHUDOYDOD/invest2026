import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
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

    const { rating, title, content } = await request.json()

    // Валидация данных
    if (!rating || !title || !content) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, error: "Title is too long (max 200 characters)" },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Content is too long (max 1000 characters)" },
        { status: 400 }
      )
    }

    // Проверяем, не оставлял ли пользователь отзыв недавно (защита от спама)
    const recentTestimonial = await query(`
      SELECT id FROM testimonials 
      WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'
    `, [decoded.userId])

    if (recentTestimonial.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: "You can only submit one testimonial per day" },
        { status: 429 }
      )
    }

    // Создаем отзыв
    const result = await query(`
      INSERT INTO testimonials (user_id, rating, title, content, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id, created_at
    `, [decoded.userId, rating, title, content])

    console.log(`✅ New testimonial created by user ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      message: "Testimonial submitted successfully. It will be reviewed by our team.",
      testimonial: {
        id: result.rows[0].id,
        createdAt: result.rows[0].created_at
      }
    })

  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    )
  }
}