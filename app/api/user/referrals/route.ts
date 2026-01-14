import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      // Get user's referral code
      const userResult = await client.query(
        "SELECT referral_code, total_earned FROM users WHERE id = $1",
        [userId]
      )

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        )
      }

      const user = userResult.rows[0]

      // Get all referrals (users who used this user's referral code)
      const referralsResult = await client.query(
        `SELECT 
          u.id,
          u.full_name as name,
          u.email,
          u.created_at as "registrationDate",
          u.total_invested as "totalInvested",
          u.status,
          COALESCE(
            (SELECT SUM(amount * 0.05) 
             FROM deposit_requests 
             WHERE user_id = u.id AND status = 'approved'),
            0
          ) as earned
        FROM users u
        WHERE u.referred_by = $1
        ORDER BY u.created_at DESC`,
        [user.referral_code]
      )

      // Calculate totals
      const referrals = referralsResult.rows.map((ref, index) => ({
        id: ref.id,
        name: ref.name,
        email: ref.email,
        registrationDate: ref.registrationDate,
        level: 1, // For now, only tracking 1st level
        totalInvested: parseFloat(ref.totalInvested || 0),
        earned: parseFloat(ref.earned || 0),
        status: ref.status
      }))

      const totalReferrals = referrals.length
      const totalInvested = referrals.reduce((sum, ref) => sum + ref.totalInvested, 0)
      const totalEarned = parseFloat(user.total_earned || 0)

      return NextResponse.json({
        success: true,
        referralCode: user.referral_code,
        totalReferrals,
        totalEarned,
        totalInvested,
        referrals
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error("❌ Error fetching referrals:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch referrals" },
      { status: 500 }
    )
  }
}
