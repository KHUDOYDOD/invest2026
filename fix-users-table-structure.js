const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/investpro',
});

async function fixUsersTableStructure() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Проверяем структуру таблицы users...');
    
    // Проверяем существующие колонки
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Существующие колонки:');
    columnsResult.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    const existingColumns = columnsResult.rows.map(row => row.column_name);
    
    // Добавляем недостающие колонки
    const requiredColumns = [
      { name: 'referral_code', type: 'VARCHAR(20)', nullable: true },
      { name: 'country', type: 'VARCHAR(100)', nullable: true },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true },
      { name: 'city', type: 'VARCHAR(100)', nullable: true },
      { name: 'avatar_url', type: 'TEXT', nullable: true }
    ];
    
    for (const column of requiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`➕ Добавляем колонку: ${column.name}`);
        await client.query(`
          ALTER TABLE users 
          ADD COLUMN ${column.name} ${column.type} ${column.nullable ? '' : 'NOT NULL'}
        `);
        console.log(`✅ Колонка ${column.name} добавлена`);
      } else {
        console.log(`✅ Колонка ${column.name} уже существует`);
      }
    }
    
    // Проверяем индексы
    console.log('\n🔍 Проверяем индексы...');
    
    const indexesResult = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'users'
    `);
    
    console.log('📋 Существующие индексы:');
    indexesResult.rows.forEach(idx => {
      console.log(`- ${idx.indexname}`);
    });
    
    // Создаем индекс для email если его нет
    const emailIndexExists = indexesResult.rows.some(idx => 
      idx.indexname.includes('email') || idx.indexdef.includes('email')
    );
    
    if (!emailIndexExists) {
      console.log('➕ Создаем уникальный индекс для email...');
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique 
        ON users (email)
      `);
      console.log('✅ Индекс для email создан');
    }
    
    // Создаем индекс для referral_code если его нет
    const referralIndexExists = indexesResult.rows.some(idx => 
      idx.indexname.includes('referral') || idx.indexdef.includes('referral_code')
    );
    
    if (!referralIndexExists) {
      console.log('➕ Создаем уникальный индекс для referral_code...');
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_unique 
        ON users (referral_code)
      `);
      console.log('✅ Индекс для referral_code создан');
    }
    
    // Проверяем финальную структуру
    console.log('\n📋 Финальная структура таблицы users:');
    const finalResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    finalResult.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
    console.log('\n✅ Структура таблицы users исправлена!');
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении структуры:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixUsersTableStructure().catch(console.error);