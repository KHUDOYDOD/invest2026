import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔄 Ручное обновление статистики...');
    
    // Динамический импорт JavaScript версии функции
    const { updateStatistics } = require('../../../lib/update-statistics.js');
    const result = await updateStatistics();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Статистика обновлена успешно',
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Ошибка обновления статистики:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to update statistics'
  });
}