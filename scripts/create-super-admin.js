const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function createSuperAdmin() {
  try {
    console.log('🔌 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключено к базе данных\n');

    // Данные супер-администратора
    const superAdmin = {
      id: 1,
      email: 'creator@investpro.com',
      password: 'SuperAdmin2025!',
      fullName: 'Создатель Системы',
      role: 'super_admin',
      country: 'RU',
      phone: '+7 (999) 999-99-99',
      referralCode: 'CREATOR001'
    };

    console.log('🔐 Хеширование пароля...');
    const hashedPassword = await bcrypt.hash(superAdmin.password, 10);
    console.log('✅ Пароль захеширован\n');

    console.log('👤 Создание супер-администратора...');
    
    // Сначала создаем или получаем роль super_admin
    console.log('🔧 Проверка роли super_admin...');
    const roleCheck = await client.query("SELECT id FROM user_roles WHERE name = 'super_admin'");
    
    let superAdminRoleId;
    if (roleCheck.rows.length === 0) {
      console.log('📝 Создание роли super_admin...');
      const roleResult = await client.query(`
        INSERT INTO user_roles (name, display_name, description, permissions)
        VALUES ('super_admin', 'Супер Администратор', 'Полный контроль над системой', '{"all": true}')
        RETURNING id
      `);
      superAdminRoleId = roleResult.rows[0].id;
      console.log('✅ Роль super_admin создана с ID:', superAdminRoleId);
    } else {
      superAdminRoleId = roleCheck.rows[0].id;
      console.log('✅ Роль super_admin найдена с ID:', superAdminRoleId);
    }
    
    // Проверяем, существует ли пользователь с email creator@investpro.com
    const checkResult = await client.query("SELECT id FROM users WHERE email = 'creator@investpro.com'");
    
    if (checkResult.rows.length > 0) {
      console.log('⚠️  Пользователь creator@investpro.com уже существует. Обновляем...');
      
      // Обновляем существующего пользователя
      await client.query(`
        UPDATE users SET
          email = $1,
          password_hash = $2,
          full_name = $3,
          role_id = $4,
          country = $5,
          phone = $6,
          referral_code = $7,
          is_verified = true,
          is_active = true,
          updated_at = NOW()
        WHERE email = 'creator@investpro.com'
      `, [
        superAdmin.email,
        hashedPassword,
        superAdmin.fullName,
        superAdminRoleId,
        superAdmin.country,
        superAdmin.phone,
        superAdmin.referralCode
      ]);
      
      console.log('✅ Пользователь обновлен до супер-администратора');
    } else {
      console.log('📝 Создание нового супер-администратора...');
      
      // Создаем нового пользователя
      await client.query(`
        INSERT INTO users (
          email,
          password_hash,
          full_name,
          role_id,
          balance,
          total_invested,
          total_earned,
          referral_code,
          country,
          phone,
          login,
          is_verified,
          is_active,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, 0.00, 0.00, 0.00, $5, $6, $7, $8, true, true, NOW(), NOW())
      `, [
        superAdmin.email,
        hashedPassword,
        superAdmin.fullName,
        superAdminRoleId,
        superAdmin.referralCode,
        superAdmin.country,
        superAdmin.phone,
        'creator'
      ]);
      
      console.log('✅ Супер-администратор создан');
    }

    // Получаем информацию о созданном пользователе
    const result = await client.query(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.country,
        u.phone,
        u.referral_code,
        u.is_verified,
        u.is_active,
        u.created_at,
        r.name as role
      FROM users u
      LEFT JOIN user_roles r ON u.role_id = r.id
      WHERE u.email = 'creator@investpro.com'
    `);

    const user = result.rows[0];

    console.log('\n' + '='.repeat(60));
    console.log('🎉 СУПЕР-АДМИНИСТРАТОР УСПЕШНО СОЗДАН!');
    console.log('='.repeat(60));
    console.log('\n📋 ДАННЫЕ ДЛЯ ВХОДА:\n');
    console.log(`   🆔 ID:              ${user.id}`);
    console.log(`   📧 Email:           ${user.email}`);
    console.log(`   🔑 Пароль:          ${superAdmin.password}`);
    console.log(`   👤 Имя:             ${user.full_name}`);
    console.log(`   👑 Роль:            ${user.role}`);
    console.log(`   🌍 Страна:          ${user.country}`);
    console.log(`   📱 Телефон:         ${user.phone}`);
    console.log(`   🎫 Реферальный код: ${user.referral_code}`);
    console.log(`   ✅ Верифицирован:   ${user.is_verified ? 'Да' : 'Нет'}`);
    console.log(`   🟢 Активен:         ${user.is_active ? 'Да' : 'Нет'}`);
    console.log(`   📅 Создан:          ${new Date(user.created_at).toLocaleString('ru-RU')}`);
    console.log('\n' + '='.repeat(60));
    console.log('🔐 ПРАВА ДОСТУПА:\n');
    console.log('   ✅ Полный доступ к админ-панели');
    console.log('   ✅ Управление всеми пользователями');
    console.log('   ✅ Управление инвестициями');
    console.log('   ✅ Управление транзакциями');
    console.log('   ✅ Управление настройками системы');
    console.log('   ✅ Управление контентом');
    console.log('   ✅ Доступ к статистике');
    console.log('   ✅ Управление платежными системами');
    console.log('   ✅ Полный контроль над сайтом');
    console.log('\n' + '='.repeat(60));
    console.log('🚀 СЛЕДУЮЩИЕ ШАГИ:\n');
    console.log('   1. Откройте: http://localhost:3000/login');
    console.log('   2. Войдите с указанными данными');
    console.log('   3. Вы получите полный доступ к системе!');
    console.log('\n' + '='.repeat(60));
    console.log('\n⚠️  ВАЖНО: Сохраните эти данные в безопасном месте!\n');

    // Сохраняем данные в файл
    const fs = require('fs');
    const credentials = `
# 👑 СУПЕР-АДМИНИСТРАТОР (СОЗДАТЕЛЬ)

## 🔐 Данные для входа:

- **Email:** ${user.email}
- **Пароль:** ${superAdmin.password}
- **ID:** ${user.id}
- **Роль:** ${user.role}

## 🎯 Возможности:

- ✅ Полный контроль над всей системой
- ✅ Доступ ко всем функциям админ-панели
- ✅ Управление пользователями, инвестициями, транзакциями
- ✅ Настройка системы, контента, платежей
- ✅ Доступ к полной статистике

## 🚀 Вход в систему:

1. Откройте: http://localhost:3000/login
2. Введите email и пароль
3. Получите полный доступ!

## ⚠️ БЕЗОПАСНОСТЬ:

**ВАЖНО:** Это супер-администратор с полными правами!
- Храните пароль в безопасности
- Не делитесь этими данными
- Измените пароль после первого входа
- Используйте двухфакторную аутентификацию (если доступна)

---
Создано: ${new Date().toLocaleString('ru-RU')}
`;

    fs.writeFileSync('SUPER_ADMIN_CREDENTIALS.md', credentials);
    console.log('💾 Данные сохранены в файл: SUPER_ADMIN_CREDENTIALS.md\n');

  } catch (error) {
    console.error('\n❌ Ошибка при создании супер-администратора:', error);
    console.error('\nДетали ошибки:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Запускаем создание супер-администратора
createSuperAdmin();
