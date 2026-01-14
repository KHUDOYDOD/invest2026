@echo off
echo ========================================
echo Creating Messages and Notifications Tables
echo ========================================
echo.

node -e "const {Client}=require('pg');const fs=require('fs');function loadEnv(){try{const e=fs.readFileSync('.env.local','utf8').split('\n'),n={};return e.forEach(e=>{const t=e.match(/^([^=:#]+)=(.*)$/);if(t){const e=t[1].trim(),r=t[2].trim().replace(/^[\"']|[\"']$/g,'');n[e]=r}}),n}catch(e){return console.error('Error reading .env.local:',e.message),null}}async function run(){const e=loadEnv();if(!e||!e.DATABASE_URL)return void console.error('DATABASE_URL not found');const n=new Client({connectionString:e.DATABASE_URL});try{await n.connect(),console.log('Connected to database\n');const e=fs.readFileSync('scripts/create-messages-tables-fixed.sql','utf8');await n.query(e),console.log('Tables created successfully!\n')}catch(e){console.error('Error:',e.message)}finally{await n.end()}}run();"

echo.
echo ========================================
echo Done!
echo ========================================
pause
