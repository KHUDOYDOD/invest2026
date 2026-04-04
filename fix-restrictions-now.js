const { Pool } = require('pg')

const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
})

async function fixRestrictionsNow() {
  try {
    console.log('🔧 ИСПРАВЛЯЕМ ОГРАНИЧЕНИЯ ПРЯМО СЕЙЧАС...\n')
    
    // 1. Проверяем текущее состояние
    console.log('1️⃣ Текущее состояние базы данных:')
    const currentState = await pool.query(`
      SELECT 
        id, name, title, is_launched, is_active, show_on_site,
        disable_registration, disable_investments, 
        disable_deposits, disable_withdrawals,
        position
      FROM project_launches 
      ORDER BY position ASC
    `)
    
    console.log(`Найдено проектов: ${currentState.rows.length}`)
    currentState.rows.forEach(project => {
      console.log(`\n📋 Проект: ${project.title || project.name}`)
      console.log(`   ID: ${project.id}`)
      console.log(`   Активен: ${project.is_active}`)
      console.log(`   Показывать: ${project.show_on_site}`)
      console.log(`   Запущен: ${project.is_launched}`)
      console.log(`   Позиция: ${project.position}`)
      console.log(`   🚫 Регистрация отключена: ${project.disable_registration}`)
      console.log(`   📈 Инвестиции отключены: ${project.disable_investments}`)
      console.log(`   💰 Пополнение отключено: ${project.disable_deposits}`)
      console.log(`   💸 Вывод отключен: ${project.disable_withdrawals}`)
    })
    
    // 2. Тестируем точный запрос из API
    console.log('\n2️⃣ Тестируем запрос из site-status API:')
    const apiQuery = `
      SELECT 
        disable_registration,
        disable_investments,
        disable_deposits,
        disable_withdrawals
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND (is_launched = false OR is_launched IS NULL)
      ORDER BY position ASC
      LIMIT 1
    `
    
    console.log('SQL запрос:', apiQuery)
    const apiResult = await pool.query(apiQuery)
    
    console.log(`Результатов: ${apiResult.rows.length}`)
    if (apiResult.rows.length > 0) {
      const restrictions = apiResult.rows[0]
      console.log('Найденные ограничения:')
      console.log(`   disable_registration: ${restrictions.disable_registration}`)
      console.log(`   disable_investments: ${restrictions.disable_investments}`)
      console.log(`   disable_deposits: ${restrictions.disable_deposits}`)
      console.log(`   disable_withdrawals: ${restrictions.disable_withdrawals}`)
    } else {
      console.log('❌ ПРОБЛЕМА: Запрос не возвращает результатов!')
      console.log('Это означает что нет проектов соответствующих условиям.')
    }
    
    // 3. Исправляем проблему - создаем или обновляем проект
    console.log('\n3️⃣ Исправляем проблему:')
    
    if (currentState.rows.length === 0) {
      console.log('Создаем новый проект с ограничениями...')
      await pool.query(`
        INSERT INTO project_launches (
          id, name, title, description, launch_date, countdown_end,
          is_launched, is_active, show_on_site, show_countdown,
          position, icon_type, background_type, color_scheme,
          disable_registration, disable_investments, 
          disable_deposits, disable_withdrawals,
          created_at, updated_at
        ) VALUES (
          gen_random_uuid(), 
          'test-project', 
          'Тестовый проект с ограничениями',
          'Проект для тестирования ограничений функций',
          NOW() + INTERVAL '7 days',
          NOW() + INTERVAL '6 days',
          false,
          true,
          true,
          true,
          1,
          'rocket',
          'gradient',
          'blue',
          true,
          true,
          true,
          true,
          NOW(),
          NOW()
        )
      `)
      console.log('✅ Создан новый проект с ограничениями')
    } else {
      console.log('Обновляем существующий проект...')
      await pool.query(`
        UPDATE project_launches 
        SET 
          is_active = true,
          show_on_site = true,
          is_launched = false,
          disable_registration = true,
          disable_investments = true,
          disable_deposits = true,
          disable_withdrawals = true,
          updated_at = NOW()
        WHERE id = $1
      `, [currentState.rows[0].id])
      console.log('✅ Обновлен существующий проект')
    }
    
    // 4. Проверяем результат
    console.log('\n4️⃣ Проверяем результат:')
    const finalCheck = await pool.query(apiQuery)
    
    if (finalCheck.rows.length > 0) {
      const final = finalCheck.rows[0]
      console.log('✅ Теперь API должны работать:')
      console.log(`   🚫 Регистрация: ${final.disable_registration ? 'ЗАБЛОКИРОВАНА ✅' : 'разрешена ❌'}`)
      console.log(`   📈 Инвестиции: ${final.disable_investments ? 'ЗАБЛОКИРОВАНЫ ✅' : 'разрешены ❌'}`)
      console.log(`   💰 Пополнение: ${final.disable_deposits ? 'ЗАБЛОКИРОВАНО ✅' : 'разрешено ❌'}`)
      console.log(`   💸 Вывод: ${final.disable_withdrawals ? 'ЗАБЛОКИРОВАН ✅' : 'разрешен ❌'}`)
    } else {
      console.log('❌ Проблема не решена!')
    }
    
    // 5. Тестируем API напрямую
    console.log('\n5️⃣ Тестируем site-status API:')
    const fetch = require('node-fetch')
    
    try {
      const response = await fetch('http://213.171.31.215/api/site-status')
      const data = await response.json()
      
      console.log('Ответ API:')
      console.log(`   🚫 Регистрация: ${data.registration_enabled ? 'ВКЛЮЧЕНА ❌' : 'ОТКЛЮЧЕНА ✅'}`)
      console.log(`   📈 Инвестиции: ${data.investments_enabled ? 'ВКЛЮЧЕНЫ ❌' : 'ОТКЛЮЧЕНЫ ✅'}`)
      console.log(`   💰 Пополнение: ${data.deposits_enabled ? 'ВКЛЮЧЕНО ❌' : 'ОТКЛЮЧЕНО ✅'}`)
      console.log(`   💸 Вывод: ${data.withdrawals_enabled ? 'ВКЛЮЧЕН ❌' : 'ОТКЛЮЧЕН ✅'}`)
    } catch (error) {
      console.log(`   ❌ Ошибка тестирования API: ${error.message}`)
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

fixRestrictionsNow()