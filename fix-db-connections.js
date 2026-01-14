const fs = require('fs');
const path = require('path');

// Список файлов для исправления
const filesToFix = [
  'app/api/user/profile/route.ts',
  'app/api/messages/route.ts',
  'app/api/notifications/route.ts',
  'app/api/notifications/preferences/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/admin/withdrawal-requests/simple/route.ts',
  'app/api/admin/withdrawal-requests/[id]/reject/route.ts',
  'app/api/admin/withdrawal-requests/[id]/approve/route.ts',
  'app/api/admin/deposit-requests/simple/route.ts',
  'app/api/admin/deposit-requests/[id]/approve/route.ts',
  'app/api/admin/deposit-requests/[id]/reject/route.ts',
  'app/api/admin/investment-plans/route.ts',
  'app/api/admin/dashboard/stats/route.ts'
];

const oldPattern = `const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})`;

const oldPattern2 = `const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})`;

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Файл не найден: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Проверяем, нужно ли исправлять файл
  if (!content.includes('new Pool({')) {
    console.log(`✅ Файл уже исправлен: ${file}`);
    return;
  }

  // Заменяем импорт Pool на импорт query из @/server/db
  if (content.includes('import { Pool } from "pg"') || content.includes("import { Pool } from 'pg'")) {
    content = content.replace(/import { Pool } from ["']pg["']\s*\n/, '');
    
    // Добавляем импорт query из @/server/db в начало файла после других импортов
    const lines = content.split('\n');
    let importIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        importIndex = i + 1;
      } else if (importIndex > 0 && lines[i].trim() === '') {
        break;
      }
    }
    
    lines.splice(importIndex, 0, 'import { query } from "@/server/db"');
    content = lines.join('\n');
  }

  // Удаляем создание pool
  content = content.replace(oldPattern, '');
  content = content.replace(oldPattern2, '');
  
  // Заменяем pool.query на query
  content = content.replace(/pool\.query\(/g, 'query(');
  
  // Заменяем pool.connect на прямое использование query
  content = content.replace(/const client = await pool\.connect\(\)\s*\n/g, '');
  content = content.replace(/client\.release\(\)/g, '');
  
  // Удаляем лишние пустые строки
  content = content.replace(/\n\n\n+/g, '\n\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Исправлен: ${file}`);
});

console.log('\n🎉 Все файлы обработаны!');
