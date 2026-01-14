import { NextResponse } from 'next/server'
import { query } from '@/server/db'

export async function GET() {
  try {
    const result = await query(
      `SELECT setting_key, setting_value, setting_type 
       FROM site_settings 
       WHERE category = 'general'`
    )

    const settings: any = {}
    result.rows.forEach((row) => {
      const key = row.setting_key
      let value = row.setting_value

      // Преобразуем значения в правильный тип
      if (row.setting_type === 'boolean') {
        value = value === 'true'
      } else if (row.setting_type === 'number') {
        value = parseFloat(value)
      }

      settings[key] = value
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Обновляем каждую настройку
    for (const [key, value] of Object.entries(body)) {
      const settingKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      const settingValue = String(value)

      await query(
        `INSERT INTO site_settings (setting_key, setting_value, category, updated_at)
         VALUES ($1, $2, 'general', CURRENT_TIMESTAMP)
         ON CONFLICT (setting_key) 
         DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP`,
        [settingKey, settingValue]
      )
    }

    return NextResponse.json({ success: true, message: 'Settings updated' })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
