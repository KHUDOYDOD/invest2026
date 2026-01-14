import { NextRequest, NextResponse } from "next/server"
import { query } from "@/server/db"

export async function GET(request: NextRequest) {
  try {
    // Получаем общую статистику
    const usersResult = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users
      FROM users
    `)

    const revenueResult = await query(`
      SELECT 
        COALESCE(SUM(balance), 0) as total_balance,
        COALESCE(SUM(total_invested), 0) as total_invested,
        COALESCE(SUM(total_earned), 0) as total_earned
      FROM users
    `)

    const investmentsResult = await query(`
      SELECT COUNT(*) as total_investments
      FROM investments
      WHERE status = 'active'
    `)

    const requestsResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_deposits,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_withdrawals
      FROM (
        SELECT status FROM deposit_requests
        UNION ALL
        SELECT status FROM withdrawal_requests
      ) as all_requests
    `)

    // Рост за месяц (сравнение с прошлым месяцем)
    const growthResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as current_month,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days') as previous_month
      FROM users
    `)

    const users = usersResult.rows[0]
    const revenue = revenueResult.rows[0]
    const investments = investmentsResult.rows[0]
    const requests = requestsResult.rows[0]
    const growth = growthResult.rows[0]

    const currentMonth = parseInt(growth.current_month) || 0
    const previousMonth = parseInt(growth.previous_month) || 1
    const monthlyGrowthCalc = previousMonth > 0 
      ? ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1)
      : "0"
    const monthlyGrowth = parseFloat(monthlyGrowthCalc)

    return NextResponse.json({
      totalUsers: parseInt(users.total_users) || 0,
      activeUsers: parseInt(users.active_users) || 0,
      totalRevenue: parseFloat(revenue.total_balance) + parseFloat(revenue.total_invested),
      totalInvested: parseFloat(revenue.total_invested),
      totalEarned: parseFloat(revenue.total_earned),
      totalInvestments: parseInt(investments.total_investments) || 0,
      pendingRequests: (parseInt(requests.pending_deposits) || 0) + (parseInt(requests.pending_withdrawals) || 0),
      monthlyGrowth: monthlyGrowth,
    })
  } catch (error) {
    console.error("Admin dashboard stats error:", error)
    return NextResponse.json(
      { 
        error: "Failed to load dashboard stats",
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        totalInvestments: 0,
        pendingRequests: 0,
      },
      { status: 500 }
    )
  }
}
