#!/bin/bash
# ============================================
# АВТОМАТИЧЕСКОЕ ВОССТАНОВЛЕНИЕ САЙТА
# ============================================

set -e  # Остановить при ошибке

echo "========================================"
echo "🚨 АВТОМАТИЧЕСКОЕ ВОССТАНОВЛЕНИЕ"
echo "========================================"
echo ""

cd /home/root11/invest2026

echo "[1/8] Останавливаем все процессы PM2..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

echo ""
echo "[2/8] Очищаем старые логи PM2..."
pm2 flush

echo ""
echo "[3/8] Проверяем права на папку..."
chown -R root11:root11 /home/root11/invest2026 2>/dev/null || true

echo ""
echo "[4/8] Очищаем кэш npm..."
npm cache clean --force 2>/dev/null || true

echo ""
echo "[5/8] Устанавливаем зависимости..."
npm install

echo ""
echo "[6/8] Пересобираем проект..."
NODE_OPTIONS='--max-old-space-size=1024' npm run build

echo ""
echo "[7/8] Запускаем приложение..."
NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro -- start

echo ""
echo "[8/8] Сохраняем конфигурацию..."
pm2 save

echo ""
echo "========================================"
echo "✅ САЙТ ВОССТАНОВЛЕН!"
echo "========================================"
echo ""
echo "Проверка статуса:"
pm2 status

echo ""
echo "Проверка доступности:"
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Проверьте через несколько секунд"

echo ""
echo "🌐 Сайт должен быть доступен: http://213.171.31.215"
echo ""
echo "Если не работает, проверьте логи: pm2 logs investpro"
