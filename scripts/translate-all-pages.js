#!/usr/bin/env node

/**
 * Скрипт для автоматического добавления переводов во все страницы
 * Использование: node scripts/translate-all-pages.js
 */

const fs = require('fs');
const path = require('path');

// Список файлов для перевода
const filesToTranslate = [
  // Страницы авторизации
  'app/login/page.tsx',
  'app/register/page.tsx',
  
  // Личный кабинет
  'app/dashboard/page.tsx',
  'app/dashboard/deposit/page.tsx',
  'app/dashboard/withdraw/page.tsx',
  'app/dashboard/investments/page.tsx',
  'app/dashboard/transactions/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/support/page.tsx',
  
  // Компоненты dashboard
  'components/dashboard/header.tsx',
  'components/dashboard/sidebar.tsx',
  'components/dashboard/investment-plans-selector.tsx',
  'components/dashboard/referral-stats.tsx',
];

// Функция для добавления импорта useLanguage
function addLanguageImport(content) {
  // Проверяем, есть ли уже импорт
  if (content.includes("from '@/contexts/language-context'")) {
    console.log('  ✓ Импорт useLanguage уже существует');
    return content;
  }
  
  // Находим последний импорт
  const importRegex = /import .+ from .+\n/g;
  const imports = content.match(importRegex);
  
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const newImport = "import { useLanguage } from '@/contexts/language-context'\n";
    content = content.replace(lastImport, lastImport + newImport);
    console.log('  ✓ Добавлен импорт useLanguage');
  }
  
  return content;
}

// Функция для добавления хука в компонент
function addLanguageHook(content) {
  // Проверяем, есть ли уже хук
  if (content.includes('const { t } = useLanguage()')) {
    console.log('  ✓ Хук useLanguage уже существует');
    return content;
  }
  
  // Ищем начало функции компонента
  const functionRegex = /(export (?:default )?function \w+\([^)]*\) \{)/;
  const match = content.match(functionRegex);
  
  if (match) {
    const hookLine = '\n  const { t } = useLanguage()\n';
    content = content.replace(match[1], match[1] + hookLine);
    console.log('  ✓ Добавлен хук useLanguage');
  }
  
  return content;
}

// Основная функция
function translateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  console.log(`\n📝 Обработка: ${filePath}`);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  Файл не найден: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Проверяем, что это React компонент
  if (!content.includes('export') || !content.includes('function')) {
    console.log('  ⚠️  Не является React компонентом');
    return;
  }
  
  // Добавляем импорт
  content = addLanguageImport(content);
  
  // Добавляем хук
  content = addLanguageHook(content);
  
  // Сохраняем файл
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('  ✅ Файл обновлен');
}

// Запуск
console.log('🚀 Начинаем автоматический перевод страниц...\n');
console.log('=' .repeat(60));

filesToTranslate.forEach(translateFile);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Готово! Импорты и хуки добавлены.');
console.log('\n📝 Следующий шаг:');
console.log('   Замените русские тексты на t("ключ") вручную');
console.log('   Или используйте поиск и замену в вашем редакторе\n');
