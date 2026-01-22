# Автоматический деплой на VPS через SSH
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Подключаюсь к VPS 130.49.213.197..." -ForegroundColor Yellow
Write-Host ""

$password = "12345678"
$commands = @"
cd /root/invest2026
git pull origin main
npm run build
pm2 restart investpro
pm2 status
"@

# Создаем временный файл с командами
$tempFile = [System.IO.Path]::GetTempFileName()
$commands | Out-File -FilePath $tempFile -Encoding ASCII

try {
    # Используем ssh с автоматическим вводом пароля через sshpass (если установлен)
    # Или через expect-подобный механизм
    
    Write-Host "Выполняю команды на VPS..." -ForegroundColor Yellow
    
    # Пробуем через ssh напрямую
    $sshCommand = "ssh root@130.49.213.197 'cd /root/invest2026 && git pull origin main && npm run build && pm2 restart investpro && pm2 status'"
    
    Write-Host ""
    Write-Host "ВНИМАНИЕ: Введите пароль когда попросит: 12345678" -ForegroundColor Green
    Write-Host ""
    
    Invoke-Expression $sshCommand
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ ГОТОВО! Сайт обновлен" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Проверьте: http://130.49.213.197" -ForegroundColor Cyan
    Write-Host "📊 Попробуйте создать инвестицию" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Ошибка: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Альтернатива:" -ForegroundColor Yellow
    Write-Host "1. Откройте консоль VPS на https://4vps.su/" -ForegroundColor White
    Write-Host "2. Выполните команды:" -ForegroundColor White
    Write-Host ""
    Write-Host "   cd /root/invest2026" -ForegroundColor Cyan
    Write-Host "   git pull origin main" -ForegroundColor Cyan
    Write-Host "   npm run build" -ForegroundColor Cyan
    Write-Host "   pm2 restart investpro" -ForegroundColor Cyan
    Write-Host ""
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

Read-Host "Нажмите Enter для выхода"
