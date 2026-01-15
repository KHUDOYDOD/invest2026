@echo off
chcp 65001 >nul
echo ========================================
echo SOZDANIE ADMINA NA VPS
echo ========================================
echo.
echo Username: Admin
echo Email:    X45395x@gmail.com
echo Password: X11021997x
echo.

REM Создаём скрипт на VPS
echo Sozdayom skript na VPS...

ssh root@130.49.213.197 "cat > /root/create-admin.js << 'EOF'
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function createAdmin() {
  // Читаем DATABASE_URL из .env.production
  const envContent = fs.readFileSync('/root/invest2026/.env.production', 'utf8');
  const match = envContent.match(/DATABASE_URL=(.+)/);
  const databaseUrl = match ? match[1].trim() : null;

  if (!databaseUrl) {
    console.error('DATABASE_URL ne nayden');
    return;
  }

  const pool = new Pool({ 
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Podklyuchaemsya k baze...');

    const username = 'Admin';
    const email = 'X45395x@gmail.com';
    const password = 'X11021997x';
    const fullName = 'Administrator';

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Parol zaheshirovan');

    const checkUser = await pool.query(
      'SELECT id, username, email, role, is_admin FROM users WHERE username = \$1 OR email = \$2',
      [username, email]
    );

    if (checkUser.rows.length > 0) {
      const existingUser = checkUser.rows[0];
      console.log('Polzovatel uzhe est, obnovlyaem...');
      
      await pool.query(
        \`UPDATE users 
         SET username = \$1, 
             email = \$2, 
             password = \$3, 
             full_name = \$4,
             role = 'admin',
             is_admin = true
         WHERE id = \$5\`,
        [username, email, hashedPassword, fullName, existingUser.id]
      );

      console.log('Polzovatel obnovlyon!');
      
    } else {
      console.log('Sozdayom novogo admina...');
      
      await pool.query(
        \`INSERT INTO users (
          username, 
          email, 
          password, 
          full_name, 
          role, 
          is_admin,
          balance,
          total_earned,
          total_invested,
          active_investments
        ) VALUES (\$1, \$2, \$3, \$4, 'admin', true, 0, 0, 0, 0)\`,
        [username, email, hashedPassword, fullName]
      );

      console.log('Admin sozdan!');
    }

    console.log('========================================');
    console.log('ADMIN GOTOV!');
    console.log('========================================');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Admin panel: http://130.49.213.197/admin');
    console.log('========================================');

  } catch (error) {
    console.error('Oshibka:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
EOF"

echo.
echo Zapuskaem skript na VPS...
echo.

ssh root@130.49.213.197 "cd /root && node create-admin.js"

echo.
echo ========================================
echo GOTOVO!
echo ========================================
echo.
echo Dannye dlya vhoda:
echo Username: Admin
echo Password: X11021997x
echo.
echo Admin panel:
echo http://130.49.213.197/admin
echo.
pause
