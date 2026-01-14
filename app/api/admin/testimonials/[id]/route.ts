import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { status, adminComment } = await request.json()
    const testimonialId = params.id

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be 'approved' or 'rejected'" },
        { status: 400 }
      )
    }

    // Обновляем статус отзыва
    let updateQuery, queryParams;
    
    if (status === 'approved') {
      updateQuery = `
        UPDATE testimonials 
        SET 
          status = $1,
          admin_comment = $2,
          approved_by = $3,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, status, updated_at
      `;
      queryParams = [status, adminComment || null, decoded.userId, parseInt(testimonialId)];
    } else {
      updateQuery = `
        UPDATE testimonials 
        SET 
          status = $1,
          admin_comment = $2,
          approved_by = $3,
          approved_at = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, status, updated_at
      `;
      queryParams = [status, adminComment || null, decoded.userId, parseInt(testimonialId)];
    }

    const result = await query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      )
    }

    console.log(`✅ Testimonial ${testimonialId} ${status} by admin ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      message: `Testimonial ${status} successfully`,
      testimonial: result.rows[0]
    })

  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const testimonialId = params.id

    const result = await query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING id',
      [parseInt(testimonialId)] // Преобразуем в число
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      )
    }

    console.log(`✅ Testimonial ${testimonialId} deleted by admin ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    )
  }
}