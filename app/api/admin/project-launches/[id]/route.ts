import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

// PATCH - частичное обновление проекта
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Получаем текущий проект
    const currentResult = await query('SELECT * FROM project_launches WHERE id = $1', [id])
    
    if (currentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const current = currentResult.rows[0]

    // Обновляем только переданные поля
    const updates: any = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.status !== undefined) updates.status = body.status
    if (body.launch_date !== undefined) updates.launch_date = body.launch_date
    if (body.target_amount !== undefined) updates.target_amount = body.target_amount
    if (body.raised_amount !== undefined) updates.raised_amount = body.raised_amount
    if (body.is_launched !== undefined) updates.is_launched = body.is_launched
    if (body.is_active !== undefined) updates.is_active = body.is_active
    if (body.show_on_site !== undefined) updates.show_on_site = body.show_on_site
    if (body.position !== undefined) updates.position = body.position
    if (body.icon_type !== undefined) updates.icon_type = body.icon_type
    if (body.background_type !== undefined) updates.background_type = body.background_type
    if (body.color_scheme !== undefined) updates.color_scheme = body.color_scheme
    if (body.show_countdown !== undefined) updates.show_countdown = body.show_countdown
    if (body.countdown_end !== undefined) updates.countdown_end = body.countdown_end

    // Формируем SET часть запроса
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ')
    const values = Object.values(updates)
    values.push(id) // Добавляем id в конец

    const result = await query(
      `UPDATE project_launches 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING *`,
      values
    )

    console.log('✅ Project updated:', result.rows[0])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating project launch:', error)
    return NextResponse.json({ error: 'Failed to update project launch' }, { status: 500 })
  }
}

// DELETE - удаление проекта
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await query('DELETE FROM project_launches WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting project launch:', error)
    return NextResponse.json({ error: 'Failed to delete project launch' }, { status: 500 })
  }
}