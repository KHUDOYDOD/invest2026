// Создаем API endpoint для тестирования IP доступа
const fs = require('fs');
const path = require('path');

const apiContent = `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const host = request.headers.get('host') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const forwarded = request.headers.get('x-forwarded-for') || 'none'
  
  return NextResponse.json({
    success: true,
    message: 'IP доступ работает корректно!',
    timestamp: new Date().toISOString(),
    request_info: {
      host: host,
      url: url.toString(),
      user_agent: userAgent,
      forwarded_for: forwarded,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port
    },
    server_info: {
      node_version: process.version,
      platform: process.platform,
      uptime: process.uptime()
    }
  })
}`;

// Создаем директорию если не существует
const apiDir = path.join('app', 'api', 'test-ip');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Записываем файл
fs.writeFileSync(path.join(apiDir, 'route.ts'), apiContent);

console.log('✅ API endpoint создан: /api/test-ip');
console.log('📍 Файл: app/api/test-ip/route.ts');
console.log('🔗 Тест: http://213.171.31.215/api/test-ip');