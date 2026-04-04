const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const DATABASE_URL = 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString: DATABASE_URL
})

async function checkAdminAndTest() {
  try {
    console.log('🔍 ПРОВЕРЯЕМ АДМИНА И ТЕСТИРУЕМ ОГРАНИЧЕНИЯ...\n')
    
    // 1. Проверяем админа в базе данных
    console.log('1️⃣ Проверяем админа в базе данных:')
    const adminResult = await pool.query(`
      SELECT id, email, password_hash, role_id, status 
      FROM users 
      WHERE email = 'admin@example.com' OR role_id IN (1, 2)
      ORDER BY role_id ASC
    `)
    
    console.log(`Найдено админов: ${adminResult.rows.length}`)
    adminResult.rows.forEach(admin => {
      console.log(`   👤 Email: ${admin.email}`)
      console.log(`   🔑 ID: ${admin.id}`)
      console.log(`   👑 Роль: ${admin.role_id}`)
      console.log(`   📊 Статус: ${admin.status}`)
      console.log(`   🔐 Хеш пароля: ${admin.password_hash ? 'есть' : 'отсутствует'}`)
      console.log('')
    })
    
    // 2. Создаем/обновляем админа если нужно
    if (adminResult.rows.length === 0) {
      console.log('2️⃣ Создаем админа:')
      const hashedPassword = await bcrypt.hash('X11021997x', 10)
      
      await pool.query(`
        INSERT INTO users (
          id, email, password_hash, full_name, country,
          referral_code, balance, total_invested, total_earned,
          role_id, status, created_at
        ) VALUES (
          gen_random_uuid(), 'admin@example.com', $1, 'Admin User', 'Russia',
          'ADMIN123', 10000, 0, 0, 1, 'active', NOW()
        )
      `, [hashedPassword])
      
      console.log('   ✅ Админ создан')
    } else {
      console.log('2️⃣ Обновляем пароль админа:')
      const hashedPassword = await bcrypt.hash('X11021997x', 10)
      
      await pool.query(`
        UPDATE users 
        SET password_hash = $1, status = 'active', role_id = 1
        WHERE email = 'admin@example.com'
      `, [hashedPassword])
      
      console.log('   ✅ Пароль админа обновлен')
    }
    
    // 3. Тестируем вход админа через API
    console.log('\n3️⃣ Тестируем вход админа через API:')
    const fetch = require('node-fetch')
    
    try {
      const loginResponse = await fetch('http://213.171.31.215/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'X11021997x'
        })
      })
      
      console.log(`   Статус ответа: ${loginResponse.status}`)
      const loginData = await loginResponse.json()
      
      if (loginResponse.ok) {
        console.log('   ✅ Вход успешен!')
        console.log(`   👤 Пользователь: ${loginData.user?.email}`)
        console.log(`   👑 Роль: ${loginData.user?.role}`)
        console.log(`   💰 Баланс: $${loginData.user?.balance}`)
        
        // Теперь тестируем ограничения с токеном админа
        const adminToken = loginData.token
        
        console.log('\n4️⃣ Тестируем ограничения с токеном админа:')
        
        // Тест инвестиций
        console.log('\n   📈 Тестируем инвестиции:')
        const investResponse = await fetch('http://213.171.31.215/api/investments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            planId: '1',
            amount: 100
          })
        })
        
        const investData = await investResponse.json()
        console.log(`   Статус: ${investResponse.status}`)
        
        if (investResponse.status === 403 && investData.disabled) {
          console.log('   ✅ ИНВЕСТИЦИИ ЗАБЛОКИРОВАНЫ!')
          console.log(`   📝 ${investData.error}`)
        } else {
          console.log('   ❌ Инвестиции НЕ заблокированы')
          console.log(`   📊 ${JSON.stringify(investData, null, 2)}`)
        }
        
        // Тест пополнения
        console.log('\n   💰 Тестируем пополнение:')
        const depositResponse = await fetch('http://213.171.31.215/api/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            amount: 50,
            payment_method: 'card',
            card_number: '1234567890123456'
          })
        })
        
        const depositData = await depositResponse.json()
        console.log(`   Статус: ${depositResponse.status}`)
        
        if (depositResponse.status === 403 && depositData.disabled) {
          console.log('   ✅ ПОПОЛНЕНИЕ ЗАБЛОКИРОВАНО!')
          console.log(`   📝 ${depositData.error}`)
        } else {
          console.log('   ❌ Пополнение НЕ заблокировано')
          console.log(`   📊 ${JSON.stringify(depositData, null, 2)}`)
        }
        
        // Тест вывода
        console.log('\n   💸 Тестируем вывод:')
        const withdrawResponse = await fetch('http://213.171.31.215/api/withdraw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            amount: 25,
            method: 'card',
            card_number: '1234567890123456',
            card_holder_name: 'Admin User'
          })
        })
        
        const withdrawData = await withdrawResponse.json()
        console.log(`   Статус: ${withdrawResponse.status}`)
        
        if (withdrawResponse.status === 403 && withdrawData.disabled) {
          console.log('   ✅ ВЫВОД ЗАБЛОКИРОВАН!')
          console.log(`   📝 ${withdrawData.error}`)
        } else {
          console.log('   ❌ Вывод НЕ заблокирован')
          console.log(`   📊 ${JSON.stringify(withdrawData, null, 2)}`)
        }
        
      } else {
        console.log('   ❌ Ошибка входа')
        console.log(`   📝 ${JSON.stringify(loginData, null, 2)}`)
      }
    } catch (error) {
      console.log(`   ❌ Ошибка API: ${error.message}`)
    }
    
    // 5. Финальная проверка статуса
    console.log('\n5️⃣ Финальная проверка статуса ограничений:')
    try {
      const statusResponse = await fetch('http://213.171.31.215/api/site-status')
      const statusData = await statusResponse.json()
      
      console.log('   📊 Текущий статус:')
      console.log(`   🚫 Регистрация: ${statusData.registration_enabled ? 'ВКЛЮЧЕНА ❌' : 'ОТКЛЮЧЕНА ✅'}`)
      console.log(`   📈 Инвестиции: ${statusData.investments_enabled ? 'ВКЛЮЧЕНЫ ❌' : 'ОТКЛЮЧЕНЫ ✅'}`)
      console.log(`   💰 Пополнение: ${statusData.deposits_enabled ? 'ВКЛЮЧЕНО ❌' : 'ОТКЛЮЧЕНО ✅'}`)
      console.log(`   💸 Вывод: ${statusData.withdrawals_enabled ? 'ВКЛЮЧЕН ❌' : 'ОТКЛЮЧЕН ✅'}`)
      console.log(`   📝 Сообщение: ${statusData.message}`)
    } catch (error) {
      console.log(`   ❌ Ошибка проверки статуса: ${error.message}`)
    }
    
    console.log('\n🎯 РЕЗУЛЬТАТ:')
    console.log('Если все функции показывают "ОТКЛЮЧЕНА/ЗАБЛОКИРОВАНО" - система работает!')
    console.log('📋 Админ панель: http://213.171.31.215/admin/project-launches')
    console.log('🧪 Тест страница: http://213.171.31.215/test-api-restrictions.html')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await pool.end()
  }
}

checkAdminAndTest()