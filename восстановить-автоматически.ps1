# ============================================
# АВТОМАТИЧЕСКОЕ ВОССТАНОВЛЕНИЕ САЙТА
# ============================================

$VPS_IP = "130.49.213.197"
$VPS_PASSWORD = "12345678"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚨 ВОССТАНОВЛЕНИЕ САЙТА" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка соединения
Write-Host "[1/5] Проверка соединения..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet
if (-not $ping) {
    Write-Host "❌ VPS недоступен!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ VPS отвечает" -ForegroundColor Green

# Сборка проекта
Write-Host ""
Write-Host "[2/5] Сборка проекта..." -ForegroundColor Yellow
$buildResult = & npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка сборки!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Проект собран" -ForegroundColor Green

# Восстановление PM2
Write-Host ""
Write-Host "[3/5] Восстановление PM2 процесса..." -ForegroundColor Yellow

Write-Host "Подключаемся к VPS..." -ForegroundColor Cyan
ssh root@$VPS_IP "cd /root/invest2026 && pm2 status && pm2 restart investpro || (echo 'Запускаем PM2...' && NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start) && pm2 status"

# Обновление кода
Write-Host ""
Write-Host "[4/5] Обновление кода..." -ForegroundColor Yellow

ssh root@$VPS_IP "cd /root/invest2026 && git pull origin main"

# Копирование .next
Write-Host ""
Write-Host "[5/5] Копирование .next и финальный перезапуск..." -ForegroundColor Yellow

Write-Host "Копируем .next..." -ForegroundColor Cyan
scp -r .next root@${VPS_IP}:/root/invest2026/

ssh root@$VPS_IP "cd /root/invest2026 && pm2 restart investpro && pm2 status && echo 'Сайт восстановлен!'"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ ГОТОВО! САЙТ ВОССТАНОВЛЕН" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Сайт: http://$VPS_IP" -ForegroundColor Cyan
Write-Host "📊 Админ: http://$VPS_IP/admin/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "Данные для входа в админ панель:" -ForegroundColor Yellow
Write-Host "Логин: admin" -ForegroundColor White
Write-Host "Пароль: X11021997x" -ForegroundColor White
Write-Host ""

# Проверка сайта
Write-Host "Проверяем доступность сайта..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$VPS_IP" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Сайт отвечает! Код: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Сайт пока не отвечает, подождите 30 секунд и проверьте вручную" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")