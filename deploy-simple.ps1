# Автоматический деплой на VPS
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$VPS_IP = "130.49.213.197"
$VPS_USER = "root"
$VPS_PASS = "12345678"
$VPS_PATH = "/root/invest2026"
$LOCAL_PATH = "C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main\.next"

Write-Host "[1/3] Удаление старой .next на VPS..." -ForegroundColor Yellow
$password = ConvertTo-SecureString $VPS_PASS -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($VPS_USER, $password)

# Используем SSH для удаления
$deleteCmd = "rm -rf $VPS_PATH/.next"
Write-Host "Выполняем: ssh $VPS_USER@$VPS_IP '$deleteCmd'" -ForegroundColor Gray

# Создаем временный скрипт для автоматического ввода пароля
$sshScript = @"
@echo off
echo $VPS_PASS | ssh $VPS_USER@$VPS_IP "$deleteCmd"
"@
$sshScript | Out-File -FilePath "temp_ssh.bat" -Encoding ASCII
cmd /c temp_ssh.bat
Remove-Item "temp_ssh.bat" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "[2/3] Копирование новой .next на VPS..." -ForegroundColor Yellow
Write-Host "Это может занять 1-2 минуты..." -ForegroundColor Gray
Write-Host ""

# Используем SCP для копирования
$scpScript = @"
@echo off
echo $VPS_PASS | scp -r "$LOCAL_PATH" ${VPS_USER}@${VPS_IP}:${VPS_PATH}/
"@
$scpScript | Out-File -FilePath "temp_scp.bat" -Encoding ASCII
$result = cmd /c temp_scp.bat 2>&1
Remove-Item "temp_scp.bat" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Ошибка при копировании!" -ForegroundColor Red
    Write-Host ""
    Write-Host "РЕШЕНИЕ:" -ForegroundColor Yellow
    Write-Host "1. Скачайте WinSCP: https://winscp.net/eng/download.php" -ForegroundColor White
    Write-Host "2. Подключитесь к VPS (130.49.213.197, root, 12345678)" -ForegroundColor White
    Write-Host "3. Удалите папку /root/invest2026/.next" -ForegroundColor White
    Write-Host "4. Загрузите папку .next с компьютера" -ForegroundColor White
    Write-Host ""
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "[3/3] Перезапуск приложения..." -ForegroundColor Yellow
$restartCmd = "cd $VPS_PATH && pm2 restart investpro"
$restartScript = @"
@echo off
echo $VPS_PASS | ssh $VPS_USER@$VPS_IP "$restartCmd"
"@
$restartScript | Out-File -FilePath "temp_restart.bat" -Encoding ASCII
cmd /c temp_restart.bat
Remove-Item "temp_restart.bat" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Ждем 3 секунды..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Проверка статуса..." -ForegroundColor Gray
$statusCmd = "pm2 status"
$statusScript = @"
@echo off
echo $VPS_PASS | ssh $VPS_USER@$VPS_IP "$statusCmd"
"@
$statusScript | Out-File -FilePath "temp_status.bat" -Encoding ASCII
cmd /c temp_status.bat
Remove-Item "temp_status.bat" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ ГОТОВО! Сайт обновлен" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Откройте: http://130.49.213.197/dashboard/investments" -ForegroundColor Cyan
Write-Host ""
Write-Host "Попробуйте создать инвестицию - должно работать!" -ForegroundColor Yellow
Write-Host ""
Read-Host "Нажмите Enter для выхода"
