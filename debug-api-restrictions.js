const { Pool } = require('pg')

const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
})

async function debugAPIRestrictions() {
  try {
    console.log('🔍 Детальная диагностика API ограничений...')
    
    // 1. Проверяем текущие настройки в БД
    console.log('\n1️⃣ Текущие настройки в базе данных:')
    const currentSettings = await pool.query(`
      SELECT 
        id, title, is_launched, is_active, show_on_site,
        disable_registration, disable_investments, 
        disable_deposits, disable_withdrawals,
        position
      FROM project_launches 
      ORDER BY position ASC
    `)
    
    currentSettings.rows.forEach(project => {
      console.log(`\n📋 Проект: ${project.title}`)
      console.log(`   ID: ${project.id}`)
      console.log(`   Активен: ${project.is_active}`)
      console.log(`   Показывать на сайте: ${project.show_on_site}`)
      console.log(`   Запущен: ${project.is_launched}`)
      console.log(`   Позиция: ${project.position}`)
      console.log(`   🚫 Регистрация отключена: ${project.disable_registration}`)
      console.log(`   📈 Инвестиции отключены: ${project.disable_investments}`)
      console.log(`   💰 Пополнение отключено: ${project.disable_deposits}`)
      console.log(`   💸 Вывод отключен: ${project.disable_withdrawals}`)
    })
    
    // 2. Тестируем точно такой же запрос как в API
    console.log('\n2️⃣ Тестируем запрос как в API:')
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
    
    console.log(`Найдено записей: ${apiResult.rows.length}`)
    if (apiResult.rows.length > 0) {
      const restrictions = apiResult.rows[0]
      console.log('Результат запроса:')
      console.log(`   disable_registration: ${restrictions.disable_registration}`)
      console.log(`   disable_investments: ${restrictions.disable_investments}`)
      console.log(`   disable_deposits: ${restrictions.disable_deposits}`)
      console.log(`   disable_withdrawals: ${restrictions.disable_withdrawals}`)
      
      console.log('\nЧто должны вернуть API:')
      console.log(`   Регистрация заблокирована: ${restrictions.disable_registration}`)
      console.log(`   Инвестиции заблокированы: ${restrictions.disable_investments}`)
      console.log(`   Пополнение заблокировано: ${restrictions.disable_deposits}`)
      console.log(`   Вывод заблокирован: ${restrictions.disable_withdrawals}`)
    } else {
      console.log('⚠️ Запрос не вернул результатов - все функции будут ВКЛЮЧЕНЫ')
      console.log('Возможные причины:')
      console.log('   - Нет активных проектов (is_active = false)')
      console.log('   - Проекты не показываются на сайте (show_on_site = false)')
      console.log('   - Все проекты уже запущены (is_launched = true)')
    }
    
    // 3. Проверяем каждое условие отдельно
    console.log('\n3️⃣ Проверяем каждое условие отдельно:')
    
    const activeProjects = await pool.query('SELECT COUNT(*) as count FROM project_launches WHERE is_active = true')
    console.log(`Активных проектов: ${activeProjects.rows[0].count}`)
    
    const visibleProjects = await pool.query('SELECT COUNT(*) as count FROM project_launches WHERE show_on_site = true')
    console.log(`Видимых на сайте: ${visibleProjects.rows[0].count}`)
    
    const unlaunchedProjects = await pool.query('SELECT COUNT(*) as count FROM project_launches WHERE is_launched = false OR is_launched IS NULL')
    console.log(`Незапущенных проектов: ${unlaunchedProjects.rows[0].count}`)
    
    const combinedCondition = await pool.query(`
      SELECT COUNT(*) as count 
      FROM project_launches 
      WHERE is_active = true 
        AND show_on_site = true 
        AND (is_launched = false OR is_launched IS NULL)
    `)
    console.log(`Проектов соответствующих всем условиям: ${combinedCondition.rows[0].count}`)
    
    // 4. Исправляем проблемы если они есть
    console.log('\n4️⃣ Исправляем возможные проблемы...')
    
    if (combinedCondition.rows[0].count === 0) {
      console.log('🔧 Исправляем настройки проектов...')
      
      const fixResult = await pool.query(`
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
        WHERE id IS NOT NULL
        RETURNING id, title
      `)
      
      console.log(`✅ Исправлено проектов: ${fixResult.rows.length}`)
      fixResult.rows.forEach(project => {
        console.log(`   - ${project.title} (${project.id})`)
      })
    }
    
    // 5. Финальная проверка
    console.log('\n5️⃣ Финальная проверка после исправлений:')
    const finalCheck = await pool.query(apiQuery)
    
    if (finalCheck.rows.length > 0) {
      const final = finalCheck.rows[0]
      console.log('✅ Теперь API должны работать правильно:')
      console.log(`   🚫 Регистрация: ${final.disable_registration ? 'ЗАБЛОКИРОВАНА' : 'разрешена'}`)
      console.log(`   📈 Инвестиции: ${final.disable_investments ? 'ЗАБЛОКИРОВАНЫ' : 'разрешены'}`)
      console.log(`   💰 Пополнение: ${final.disable_deposits ? 'ЗАБЛОКИРОВАНО' : 'разрешено'}`)
      console.log(`   💸 Вывод: ${final.disable_withdrawals ? 'ЗАБЛОКИРОВАН' : 'разрешен'}`)
    } else {
      console.log('❌ Проблема не решена - API не найдут ограничений')
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

debugAPIRestrictions()