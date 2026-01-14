import { NextRequest, NextResponse } from "next/server"
import { query } from "@/server/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

        try {
      const result = await client.query(
        `SELECT 
          id,
          email,
          full_name,
          COALESCE(balance, 0) as balance,
          COALESCE(total_invested, 0) as total_invested,
          COALESCE(total_earned, 0) as total_earned,
          role,
          created_at,
          phone,
          country,
          city,
          profile_image,
          referral_code,
          last_login,
          status,
          (SELECT COUNT(*) FROM referrals WHERE referrer_id = $1) as referral_count
        FROM users
        WHERE id = $1`,
        [userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const user = result.rows[0]

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          balance: parseFloat(user.balance),
          total_invested: parseFloat(user.total_invested),
          total_earned: parseFloat(user.total_earned),
          role: user.role,
          created_at: user.created_at,
          phone: user.phone,
          country: user.country,
          city: user.city,
          bio: null,
          avatar_url: user.profile_image,
          referral_code: user.referral_code,
          referral_count: parseInt(user.referral_count) || 0,
          last_login: user.last_login,
          status: user.status,
        },
      })
    } finally {
      
    }
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, full_name, phone, country, city, bio, occupation } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

        try {
      const result = await client.query(
        `UPDATE users 
        SET 
          full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          country = COALESCE($3, country),
          city = COALESCE($4, city),
          updated_at = NOW()
        WHERE id = $5
        RETURNING 
          id,
          email,
          full_name,
          COALESCE(balance, 0) as balance,
          COALESCE(total_invested, 0) as total_invested,
          COALESCE(total_earned, 0) as total_earned,
          role,
          created_at,
          phone,
          country,
          city,
          profile_image,
          referral_code,
          (SELECT COUNT(*) FROM referrals WHERE referrer_id = $5) as referral_count`,
        [full_name, phone, country, city, userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const user = result.rows[0]

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          balance: parseFloat(user.balance),
          total_invested: parseFloat(user.total_invested),
          total_earned: parseFloat(user.total_earned),
          role: user.role,
          created_at: user.created_at,
          phone: user.phone,
          country: user.country,
          city: user.city,
          bio: null,
          avatar_url: user.profile_image,
          referral_code: user.referral_code,
          referral_count: parseInt(user.referral_count) || 0,
        },
      })
    } finally {
      
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
