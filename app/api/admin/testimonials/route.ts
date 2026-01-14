import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret"

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

    // Проверяем права администратора
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    let whereClause = ''
    let queryParams = [limit, offset]

    if (status !== 'all') {
      whereClause = 'WHERE t.status = $3'
      queryParams.push(status)
    }

    // Получаем отзывы с информацией о пользователях
    const testimonialsResult = await query(`
      SELECT 
        t.id,
        t.rating,
        t.title,
        t.content,
        t.status,
        t.admin_comment,
        t.created_at,
        t.updated_at,
        t.approved_at,
        u.full_name,
        u.email,
        u.country,
        u.city,
        approver.full_name as approved_by_name
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users approver ON t.approved_by = approver.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
    `, queryParams)

    // Получаем статистику
    const statsResult = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM testimonials
      GROUP BY status
    `)

    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    }

    statsResult.rows.forEach(row => {
      stats[row.status as keyof typeof stats] = parseInt(row.count)
      stats.total += parseInt(row.count)
    })

    const testimonials = testimonialsResult.rows.map(testimonial => ({
      id: testimonial.id,
      rating: testimonial.rating,
      title: testimonial.title,
      content: testimonial.content,
      status: testimonial.status,
      adminComment: testimonial.admin_comment,
      user: {
        name: testimonial.full_name || 'Анонимный пользователь',
        email: testimonial.email,
        location: testimonial.city && testimonial.country 
          ? `${testimonial.city}, ${testimonial.country}`
          : testimonial.country || 'Не указано'
      },
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at,
      approvedAt: testimonial.approved_at,
      approvedBy: testimonial.approved_by_name
    }))

    console.log(`✅ Loaded ${testimonials.length} testimonials for admin`)

    return NextResponse.json({
      success: true,
      testimonials,
      stats,
      pagination: {
        page,
        limit,
        total: stats.total
      }
    })

  } catch (error) {
    console.error("Error loading testimonials for admin:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load testimonials" },
      { status: 500 }
    )
  }
}