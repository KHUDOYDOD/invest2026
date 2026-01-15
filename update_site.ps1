# ============================================
# АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ САЙТА НА VPS
# ============================================

$ErrorActionPreference = "Stop"

# Конфигурация
$VPS_IP = "130.49.213.197"
$VPS_USER = "root"
$PROJECT_DIR = "/root/invest2026"
$APP_NAME = "investpro"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ОБНОВЛЕНИЕ САЙТА НА VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IP: $VPS_IP" -ForegroundColor Yellow
Write-Host "Проект: $PROJECT_DIR" -ForegroundColor Yellow
Write-Host ""

# Команды для выполнения на VPS
$commands = @"
cd $PROJECT_DIR && \
echo '🔄 Получаем обновления из GitHub...' && \
git pull && \
echo '📦 Устанавливаем зависимости...' && \
npm install --production && \
echo '🔨 Собираем проект...' && \
npm run build && \
echo '🧹 Очищаем кэш...' && \
npm cache clean --force && \
echo '🔄 Перезапускаем приложение...' && \
pm2 restart $APP_NAME && \
echo '✅ Обновление завершено!' && \
pm2 status
"@

Write-Host "🚀 Начинаем обновление..." -ForegroundColor Green
Write-Host ""

try {
    # Выполняем команды на VPS через SSH
    ssh "${VPS_USER}@${VPS_IP}" $commands
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ ОБНОВЛЕНИЕ ЗАВЕРШЕНО УСПЕШНО!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Откройте в браузере: http://$VPS_IP" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ ОШИБКА ПРИ ОБНОВЛЕНИИ" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ошибка: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Попробуйте:" -ForegroundColor Yellow
    Write-Host "1. Проверьте подключение к VPS" -ForegroundColor Yellow
    Write-Host "2. Запустите vps-connect.bat и проверьте логи: pm2 logs $APP_NAME" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
