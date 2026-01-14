const https = require('https');
const { execSync } = require('child_process');

console.log('🔧 Автоматическое обновление переменных Vercel через API...\n');

// Get Vercel token from CLI
let token;
try {
  const result = execSync('vercel whoami --token', { encoding: 'utf8' });
  // Extract token from vercel config
  const configPath = process.env.USERPROFILE + '\\.vercel\\auth.json';
  const fs = require('fs');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    token = config.token;
  }
} catch (e) {
  console.log('⚠️  Не удалось получить токен автоматически');
}

if (!token) {
  console.log('❌ Не удалось получить Vercel токен');
  console.log('\n📝 Используйте ручное обновление:');
  console.log('   https://vercel.com/xx453925xx-1555s-projects/invest2025-main/settings/environment-variables\n');
  console.log('📄 Значения в файле: VERCEL_ENV_VALUES.txt\n');
  process.exit(1);
}

const projectId = 'prj_J03awoKf8ACRKMn1ggAfAnN2mgtc'; // From previous deploys
const teamId = 'team_10tL3N1LZZDnDzKZ6XLp0fVH';

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

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function updateEnvVars() {
  console.log('📋 Обновление переменных окружения...\n');
  
  for (const [key, value] of Object.entries(envVars)) {
    try {
      console.log(`🔄 Обновление ${key}...`);
      
      // Create or update env var
      const result = await makeRequest('POST', `/v10/projects/${projectId}/env?teamId=${teamId}`, {
        key: key,
        value: value,
        type: 'encrypted',
        target: ['production', 'preview']
      });
      
      console.log(`✅ ${key} обновлён`);
    } catch (error) {
      console.log(`⚠️  ${key}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Все переменные обновлены!');
  console.log('\n🚀 Делаю redeploy...');
  
  try {
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('\n✅ Redeploy завершён!');
    console.log('\n📝 Проверьте API: node check-api-endpoints.js');
  } catch (error) {
    console.log('\n⚠️  Redeploy не удался. Запустите вручную: vercel --prod --yes');
  }
}

updateEnvVars().catch(error => {
  console.error('\n❌ Ошибка:', error.message);
  console.log('\n📝 Используйте ручное обновление:');
  console.log('   https://vercel.com/xx453925xx-1555s-projects/invest2025-main/settings/environment-variables\n');
});
