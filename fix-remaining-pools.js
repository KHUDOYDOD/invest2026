const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

const apiDir = path.join(__dirname, 'app', 'api');
const files = getAllFiles(apiDir);

let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Проверяем, есть ли проблема
  if (!content.includes('const pool = new Pool')) {
    return;
  }

  console.log(`Исправляю: ${path.relative(__dirname, file)}`);
  
  // Удаляем строки с const pool = new Pool
  content = content.replace(/const pool = new Pool\(\{[^}]*\}\)\s*\n/g, '');
  content = content.replace(/const pool = new Pool\(\{[^}]*\}\)/g, '');
  
  // Удаляем лишние пустые строки
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  fs.writeFileSync(file, content, 'utf8');
  fixedCount++;
});

console.log(`\n✅ Исправлено файлов: ${fixedCount}`);
