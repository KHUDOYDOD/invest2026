import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    console.log("🔵 Deposit API called")
    
    // Проверяем авторизацию
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any
    
    try {
      const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret"
      decoded = jwt.verify(token, secret)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Неверный токен" },
        { status: 401 }
      )
    }

    const userId = decoded.userId
    const body = await request.json()
    const { amount, payment_method, wallet_address, card_number, phone_number, receipt, receipt_filename, transaction_hash } = body

    console.log("📦 Request data:", { userId, amount, payment_method, has_receipt: !!receipt })

    // Валидация
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Некорректная сумма" },
        { status: 400 }
      )
    }

    if (!payment_method) {
      return NextResponse.json(
        { success: false, error: "Не указан способ оплаты" },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      // Определяем метод оплаты для базы данных
      let methodName = payment_method
      if (payment_method === "card") {
        methodName = "Банковская карта"
      } else if (payment_method === "sbp") {
        methodName = "Система быстрых платежей"
      } else if (payment_method === "crypto") {
        methodName = "USDT TRC-20"
      }

      // Формируем payment_details
      const paymentDetails: any = {
        method: methodName
      }

      if (payment_method === "card" && card_number) {
        paymentDetails.card_number = card_number
      } else if (payment_method === "crypto" && wallet_address) {
        paymentDetails.wallet_address = wallet_address
        if (transaction_hash) {
          paymentDetails.transaction_hash = transaction_hash
        }
      } else if (payment_method === "sbp" && phone_number) {
        paymentDetails.phone_number = phone_number
      }

      // Добавляем чек, если загружен
      if (receipt && receipt_filename) {
        paymentDetails.receipt = receipt
        paymentDetails.receipt_filename = receipt_filename
      }

      // Создаем заявку на пополнение
      const result = await client.query(
        `INSERT INTO deposit_requests (
          user_id,
          amount,
          method,
          payment_details,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, 'pending', NOW())
        RETURNING id, user_id, amount, method, status, created_at`,
        [userId, amount, methodName, JSON.stringify(paymentDetails)]
      )

      const depositRequest = result.rows[0]

      console.log("✅ Deposit request created:", depositRequest.id)

      return NextResponse.json({
        success: true,
        message: "Заявка на пополнение создана",
        transaction: {
          id: depositRequest.id,
          amount: parseFloat(depositRequest.amount),
          method: depositRequest.method,
          status: depositRequest.status,
          created_at: depositRequest.created_at
        }
      })

    } finally {
      client.release()
    }

  } catch (error: any) {
    console.error("❌ Deposit error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Ошибка при создании заявки" 
      },
      { status: 500 }
    )
  }
}
