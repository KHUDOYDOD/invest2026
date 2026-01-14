import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Возвращаем демо-данные для тестирования
    const requests = [
      {
        id: '3',
        user_id: 'user3',
        amount: 200,
        method: 'Криптовалюта',
        payment_details: { wallet_address: 'TYN5CrEMj4hJcGpZHRq1qPgWwzfCVtJnEF' },
        wallet_address: 'TYN5CrEMj4hJcGpZHRq1qPgWwzfCVtJnEF',
        card_number: null,
        phone_number: null,
        status: 'pending',
        admin_comment: null,
        created_at: new Date().toISOString(),
        processed_at: null,
        user: {
          id: 'user3',
          full_name: 'Алексей Сидоров',
          email: 'alex@example.com',
          balance: 800,
          previous_balance: 1000
        }
      }
    ]

    return NextResponse.json({
      success: true,
      requests
    })

  } catch (error) {
    console.error('Error fetching test withdrawal requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}