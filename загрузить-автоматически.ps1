# Автоматическая загрузка на VPS
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  АВТОМАТИЧЕСКАЯ ЗАГРУЗКА НА VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Переходим в директорию проекта
Set-Location "C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main"

# Проверяем наличие SSH ключа
$sshKey = "$env:USERPROFILE\.ssh\id_rsa_vps"
if (Test-Path $sshKey) {
    Write-Host "[✓] SSH ключ найден" -ForegroundColor Green
    $sshCmd = "ssh -i `"$sshKey`""
    $scpCmd = "scp -i `"$sshKey`""
} else {
    Write-Host "[!] SSH ключ не найден, используем пароль" -ForegroundColor Yellow
    $sshCmd = "ssh"
    $scpCmd = "scp"
}

Write-Host ""
Write-Host "[1/5] Создание архива .next..." -ForegroundColor Yellow
if (Test-Path "next.tar.gz") {
    Remove-Item "next.tar.gz" -Force
}
tar -czf next.tar.gz .next
Write-Host "[✓] Архив создан" -ForegroundColor Green

Write-Host ""
Write-Host "[2/5] Удаление старой версии на VPS..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd root@130.49.213.197 'rm -rf /root/invest2026/.next /root/invest2026/next.tar.gz'"
Write-Host "[✓] Старая версия удалена" -ForegroundColor Green

Write-Host ""
Write-Host "[3/5] Загрузка архива на VPS..." -ForegroundColor Yellow
Invoke-Expression "$scpCmd next.tar.gz root@130.49.213.197:/root/invest2026/"
Write-Host "[✓] Архив загружен" -ForegroundColor Green

Write-Host ""
Write-Host "[4/5] Распаковка на VPS..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd root@130.49.213.197 'cd /root/invest2026 && tar -xzf next.tar.gz && rm next.tar.gz'"
Write-Host "[✓] Архив распакован" -ForegroundColor Green

Write-Host ""
Write-Host "[5/5] Перезапуск приложения..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd root@130.49.213.197 'cd /root/invest2026 && pm2 restart investpro'"
Write-Host "[✓] Приложение перезапущено" -ForegroundColor Green

Write-Host ""
Write-Host "Ждем 3 секунды..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Проверка статуса..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd root@130.49.213.197 'pm2 status'"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ ГОТОВО! ИСПРАВЛЕНИЕ ЗАГРУЖЕНО" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь попробуйте создать инвестицию на сайте" -ForegroundColor Cyan
Write-Host "http://130.49.213.197" -ForegroundColor Cyan
Write-Host ""

# Удаляем локальный архив
if (Test-Path "next.tar.gz") {
    Remove-Item "next.tar.gz" -Force
}

Read-Host "Нажмите Enter для выхода"
