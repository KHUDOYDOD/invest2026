import { NextRequest, NextResponse } from "next/server"
import { query } from "@/server/db"

// GET - Получить все планы
export async function GET(request: NextRequest) {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        description,
        min_amount,
        max_amount,
        daily_profit,
        duration_days,
        payout_interval_hours,
        is_active,
        created_at,
        updated_at
      FROM investment_plans
      ORDER BY min_amount ASC
    `)

    return NextResponse.json({
      success: true,
      plans: result.rows,
    })
  } catch (error) {
    console.error("Error fetching investment plans:", error)
    return NextResponse.json(
      { error: "Ошибка при получении планов" },
      { status: 500 }
    )
  }
}

// POST - Создать новый план
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, min_amount, max_amount, daily_profit, duration_days, payout_interval_hours, is_active } = body

    if (!name || !min_amount || !max_amount || !daily_profit || !duration_days) {
      return NextResponse.json(
        { error: "Все обязательные поля должны быть заполнены" },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO investment_plans 
        (name, description, min_amount, max_amount, daily_profit, duration_days, payout_interval_hours, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, description, min_amount, max_amount, daily_profit, duration_days, payout_interval_hours ?? 24, is_active ?? true]
    )

    return NextResponse.json({
      success: true,
      message: "План успешно создан",
      plan: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating investment plan:", error)
    return NextResponse.json(
      { error: "Ошибка при создании плана" },
      { status: 500 }
    )
  }
}

// PUT - Обновить план
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, min_amount, max_amount, daily_profit, duration_days, payout_interval_hours, is_active } = body

    if (!id) {
      return NextResponse.json({ error: "ID плана обязателен" }, { status: 400 })
    }

    const result = await query(
      `UPDATE investment_plans 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        min_amount = COALESCE($3, min_amount),
        max_amount = COALESCE($4, max_amount),
        daily_profit = COALESCE($5, daily_profit),
        duration_days = COALESCE($6, duration_days),
        payout_interval_hours = COALESCE($7, payout_interval_hours),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *`,
      [name, description, min_amount, max_amount, daily_profit, duration_days, payout_interval_hours, is_active, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "План не найден" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "План успешно обновлен",
      plan: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating investment plan:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении плана" },
      { status: 500 }
    )
  }
}

// DELETE - Удалить план
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID плана обязателен" }, { status: 400 })
    }

    // Проверяем, есть ли активные инвестиции по этому плану
    const investmentsCheck = await query(
      "SELECT COUNT(*) as count FROM investments WHERE plan_id = $1 AND status = 'active'",
      [id]
    )

    if (parseInt(investmentsCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { error: "Невозможно удалить план с активными инвестициями. Деактивируйте план вместо удаления." },
        { status: 400 }
      )
    }

    const result = await query(
      "DELETE FROM investment_plans WHERE id = $1 RETURNING id",
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "План не найден" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "План успешно удален",
    })
  } catch (error) {
    console.error("Error deleting investment plan:", error)
    return NextResponse.json(
      { error: "Ошибка при удалении плана" },
      { status: 500 }
    )
  }
}
