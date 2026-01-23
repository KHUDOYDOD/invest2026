const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkStatistics() {
  try {
    console.log('🔍 Проверяем таблицу platform_statistics...');
    
    // Проверяем существование таблицы
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'platform_statistics'
      );
    `);
    
    console.log('📊 Таблица platform_statistics существует:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Проверяем данные в таблице
      const dataCheck = await pool.query('SELECT * FROM platform_statistics ORDER BY id DESC LIMIT 1');
      console.log('📊 Записей в таблице:', dataCheck.rows.length);
      
      if (dataCheck.rows.length > 0) {
        console.log('📊 Последняя запись:', dataCheck.rows[0]);
      } else {
        console.log('⚠️ Таблица пустая, создаем начальные данные...');
        
        // Создаем начальную запись со статистикой
        const insertResult = await pool.query(`
          INSERT INTO platform_statistics (
            users_count,
            users_change,
            investments_amount,
            investments_change,
            payouts_amount,
            payouts_change,
            profitability_rate,
            profitability_change,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          RETURNING *
        `, [15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2]);
        
        console.log('✅ Создана начальная запись:', insertResult.rows[0]);
      }
    } else {
      console.log('❌ Таблица platform_statistics не существует!');
      console.log('🔧 Создаем таблицу...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS platform_statistics (
          id SERIAL PRIMARY KEY,
          users_count INTEGER DEFAULT 0,
          users_change DECIMAL(5,2) DEFAULT 0,
          investments_amount BIGINT DEFAULT 0,
          investments_change DECIMAL(5,2) DEFAULT 0,
          payouts_amount BIGINT DEFAULT 0,
          payouts_change DECIMAL(5,2) DEFAULT 0,
          profitability_rate DECIMAL(5,2) DEFAULT 0,
          profitability_change DECIMAL(5,2) DEFAULT 0,
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      
      console.log('✅ Таблица создана');
      
      // Добавляем начальные данные
      const insertResult = await pool.query(`
        INSERT INTO platform_statistics (
          users_count,
          users_change,
          investments_amount,
          investments_change,
          payouts_amount,
          payouts_change,
          profitability_rate,
          profitability_change,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *
      `, [15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2]);
      
      console.log('✅ Добавлены начальные данные:', insertResult.rows[0]);
    }
    
    // Тестируем API статистики
    console.log('\n🌐 Тестируем API статистики...');
    const http = require('http');
    
    const options = {
      hostname: '213.171.31.215',
      port: 80,
      path: '/api/statistics',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('✅ API статистики работает:', parsed);
        } catch (e) {
          console.log('❌ Ошибка парсинга ответа API:', data);
        }
      });
    });

    req.on('error', (e) => {
      console.log('❌ Ошибка подключения к API:', e.message);
    });

    req.end();
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await pool.end();
  }
}

checkStatistics();