import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Получаем статистику транзакций пользователя
    const transactionsResult = await query(
      `SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as total_deposits,
        SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END) as total_withdrawals,
        SUM(CASE WHEN type = 'profit' THEN amount ELSE 0 END) as total_profit
      FROM transactions 
      WHERE user_id = $1`,
      [userId]
    )

    const stats = transactionsResult.rows[0]

    return NextResponse.json({
      totalTransactions: parseInt(stats.total_transactions) || 0,
      totalDeposits: parseFloat(stats.total_deposits) || 0,
      totalWithdrawals: parseFloat(stats.total_withdrawals) || 0,
      totalProfit: parseFloat(stats.total_profit) || 0
    })

  } catch (error) {
    console.error("Error fetching transaction stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch transaction stats" },
      { status: 500 }
    )
  }
}
