import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Возвращаем демо-данные для тестирования
    const requests = [
      {
        id: '1',
        user_id: 'user1',
        amount: 100,
        method: 'Банковская карта',
        payment_details: { card_number: '1234 5678 9012 3456' },
        wallet_address: null,
        card_number: '1234 5678 9012 3456',
        phone_number: null,
        status: 'pending',
        admin_comment: null,
        created_at: new Date().toISOString(),
        processed_at: null,
        user: {
          id: 'user1',
          full_name: 'Иван Иванов',
          email: 'ivan@example.com',
          balance: 250,
          previous_balance: 150
        }
      },
      {
        id: '2',
        user_id: 'user2',
        amount: 500,
        method: 'СБП',
        payment_details: { phone_number: '+7 (999) 123-45-67' },
        wallet_address: null,
        card_number: null,
        phone_number: '+7 (999) 123-45-67',
        status: 'approved',
        admin_comment: 'Одобрено',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        processed_at: new Date().toISOString(),
        user: {
          id: 'user2',
          full_name: 'Мария Петрова',
          email: 'maria@example.com',
          balance: 1500,
          previous_balance: 1000
        }
      }
    ]

    return NextResponse.json({
      success: true,
      requests
    })

  } catch (error) {
    console.error('Error fetching test deposit requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}