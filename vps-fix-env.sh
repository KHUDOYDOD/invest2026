#!/bin/bash

# Скрипт для исправления переменных окружения на VPS

echo "🔧 Исправление переменных окружения..."

cd /root/invest2026

# Создаем правильный .env.production
cat > .env.production << 'EOF'
# Database
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://130.49.213.197
EOF

echo "✅ Файл .env.production создан"

# Перезапускаем приложение
echo "🔄 Перезапуск приложения..."
pm2 restart investpro

echo "✅ Готово! Проверьте: http://130.49.213.197"
echo ""
echo "Проверка логов:"
pm2 logs investpro --lines 20
