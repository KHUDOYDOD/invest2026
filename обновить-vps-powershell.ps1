# Обновление VPS сервера 213.171.31.215
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🚀 ОБНОВЛЕНИЕ VPS 213.171.31.215" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$server = "root@213.171.31.215"
$projectPath = "/var/www/invest2026"

Write-Host "Сервер: 213.171.31.215" -ForegroundColor Yellow
Write-Host "Проект: $projectPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Нажмите Enter для продолжения (потребуется пароль)..."
Read-Host

Write-Host ""
Write-Host "[1/6] Подключаемся к серверу..." -ForegroundColor Cyan
ssh $server "cd $projectPath && pwd"

Write-Host ""
Write-Host "[2/6] Сбрасываем локальные изменения..." -ForegroundColor Cyan
ssh $server "cd $projectPath && git reset --hard HEAD"

Write-Host ""
Write-Host "[3/6] Загружаем изменения из GitHub..." -ForegroundColor Cyan
ssh $server "cd $projectPath && git pull origin main"

Write-Host ""
Write-Host "[4/6] Удаляем кэш Next.js..." -ForegroundColor Cyan
ssh $server "cd $projectPath && rm -rf .next"

Write-Host ""
Write-Host "[5/6] Устанавливаем зависимости..." -ForegroundColor Cyan
ssh $server "cd $projectPath && npm install"

Write-Host ""
Write-Host "[6/6] Перезапускаем PM2..." -ForegroundColor Cyan
ssh $server "cd $projectPath && pm2 restart invest2026"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ ОБНОВЛЕНИЕ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Проверяем статус PM2:" -ForegroundColor Yellow
ssh $server "pm2 status"

Write-Host ""
Write-Host "Последний коммит на сервере:" -ForegroundColor Yellow
ssh $server "cd $projectPath && git log --oneline -1"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Откройте: http://213.171.31.215" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  ОЧИСТИТЕ КЭШ БРАУЗЕРА:" -ForegroundColor Yellow
Write-Host "   Ctrl + Shift + Delete или Ctrl + Shift + N (инкогнито)" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://213.171.31.215"

Read-Host "Нажмите Enter для выхода"
