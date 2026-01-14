import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Возвращаем настройки для hero-секции
    const heroSettings = {
      enabled: true,
      title: "Инвестируйте с умом, получайте стабильный доход",
      subtitle: "Профессиональная инвестиционная платформа с ежедневными выплатами, высокой доходностью и гарантированной безопасностью",
      badge_text: "Платформа работает с 2025 года",
      button1_text: "Начать инвестировать",
      button1_link: "/register",
      button2_text: "Войти в систему", 
      button2_link: "/login",
      show_buttons: true,
      background_animation: true,
      show_stats: true,
      stats_users: "15K+",
      stats_users_label: "Активных инвесторов",
      stats_invested: "$2.8M",
      stats_invested_label: "Общие инвестиции",
      stats_return: "24.8%",
      stats_return_label: "Средняя доходность",
      stats_reliability: "99.9%",
      stats_reliability_label: "Надежность"
    }

    return NextResponse.json(heroSettings)

  } catch (error) {
    console.error('Error fetching hero settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}