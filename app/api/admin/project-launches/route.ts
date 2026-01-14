import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Возвращаем демо-данные для запусков проектов
    const launches = [
      {
        id: '1',
        name: 'investpro-launch',
        title: 'Проект запущен!',
        description: 'Наша инвестиционная платформа успешно работает и принимает инвестиции!',
        launch_date: new Date().toISOString(),
        is_launched: true,
        is_active: true,
        show_on_site: true,
        position: 1,
        icon_type: 'success',
        background_type: 'gradient',
        color_scheme: 'green'
      }
    ]

    return NextResponse.json(launches)

  } catch (error) {
    console.error('Error fetching project launches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}