@echo off
echo ========================================
echo Добавление полей для реквизитов вывода
echo ========================================
echo.

node -e "const { Client } = require('pg'); require('dotenv').config({ path: '.env.local' }); const client = new Client({ connectionString: process.env.DATABASE_URL }); client.connect().then(() => { const fs = require('fs'); const sql = fs.readFileSync('scripts/add-withdrawal-details-fields.sql', 'utf8'); return client.query(sql); }).then(() => { console.log('✅ Поля успешно добавлены!'); return client.end(); }).catch(err => { console.error('❌ Ошибка:', err.message); process.exit(1); });"

echo.
echo ========================================
echo Готово!
echo ========================================
pause
