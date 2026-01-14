const { execSync } = require('child_process');

console.log('🔧 Автоматическое обновление переменных Vercel...\n');

const envVars = {
  'POSTGRES_URL': 'postgres://postgres.hndoefvarvhfickrvlbf:_$X11021997x$_@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
  'POSTGRES_URL_NON_POOLING': 'postgres://postgres.hndoefvarvhfickrvlbf:_$X11021997x$_@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require',
  'POSTGRES_HOST': 'db.hndoefvarvhfickrvlbf.supabase.co',
  'POSTGRES_PASSWORD': '_$X11021997x$_',
  'SUPABASE_URL': 'https://hndoefvarvhfickrvlbf.supabase.co',
  'NEXT_PUBLIC_SUPABASE_URL': 'https://hndoefvarvhfickrvlbf.supabase.co',
  'SUPABASE_ANON_KEY': 'sb_publishable_WQZ32E6Y4Mk41os57uoq1Q_8LfypBtS',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'sb_publishable_WQZ32E6Y4Mk41os57uoq1Q_8LfypBtS',
  'SUPABASE_SERVICE_ROLE_KEY': 'sb_secret_qe8iJqGUVrWqh6rlJS4OkA_52AQY3SI'
};

console.log('📋 Переменные для обновления:');
Object.keys(envVars).forEach(key => {
  console.log(`  • ${key}`);
});
console.log('');

console.log('⚠️  ВНИМАНИЕ: Vercel CLI требует интерактивного ввода.');
console.log('📝 Вместо этого используйте Vercel Dashboard:\n');
console.log('🔗 https://vercel.com/xx453925xx-1555s-projects/invest2025-main/settings/environment-variables\n');

console.log('📋 Скопируйте эти значения:\n');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=`);
  console.log(`${value}\n`);
});

console.log('\n💡 Или откройте файл UPDATE_VERCEL_ENV.md для подробных инструкций.');
