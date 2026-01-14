import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    // Проверяем подключение к базе данных
    const dbResult = await query('SELECT NOW() as current_time, version() as version');
    
    // Проверяем переменные окружения
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'undefined'
    };
    
    // Проверяем таблицы
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    // Проверяем количество записей в основных таблицах
    const counts = {};
    for (const table of ['users', 'investment_plans', 'investments', 'transactions']) {
      if (tables.includes(table)) {
        try {
          const countResult = await query(`SELECT COUNT(*) as count FROM ${table}`);
          counts[table] = parseInt(countResult.rows[0].count);
        } catch (error) {
          counts[table] = `ERROR: ${error.message}`;
        }
      }
    }
    
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        time: dbResult.rows[0].current_time,
        version: dbResult.rows[0].version.split(' ')[0] + ' ' + dbResult.rows[0].version.split(' ')[1]
      },
      environment: envVars,
      tables: {
        available: tables,
        counts: counts
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: {
        connected: false
      }
    }, { status: 500 });
  }
}