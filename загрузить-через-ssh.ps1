$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ЗАГРУЗКА НА VPS ЧЕРЕЗ SSH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main"

$sshKey = "$env:USERPROFILE\.ssh\id_rsa_vps"

Write-Host "[1/6] Создание архива..." -ForegroundColor Yellow
if (Test-Path "next.tar.gz") {
    Remove-Item "next.tar.gz" -Force
}
tar -czf next.tar.gz .next
Write-Host "[OK] Архив создан" -ForegroundColor Green

Write-Host ""
Write-Host "[2/6] Удаление старой версии на VPS..." -ForegroundColor Yellow
$cmd = "ssh -i `"$sshKey`" root@130.49.213.197 `"rm -rf /root/invest2026/.next /root/invest2026/next.tar.gz`""
Invoke-Expression $cmd
Write-Host "[OK] Удалено" -ForegroundColor Green

Write-Host ""
Write-Host "[3/6] Загрузка через base64..." -ForegroundColor Yellow
# Читаем файл и кодируем в base64
$bytes = [System.IO.File]::ReadAllBytes("next.tar.gz")
$base64 = [System.Convert]::ToBase64String($bytes)

# Разбиваем на части по 50000 символов
$chunkSize = 50000
$chunks = [Math]::Ceiling($base64.Length / $chunkSize)

Write-Host "Размер архива: $($bytes.Length) байт" -ForegroundColor Cyan
Write-Host "Частей для загрузки: $chunks" -ForegroundColor Cyan

# Создаем временный файл на VPS
$cmd = "ssh -i `"$sshKey`" root@130.49.213.197 `"echo '' > /root/invest2026/next.b64`""
Invoke-Expression $cmd

# Загружаем по частям
for ($i = 0; $i -lt $chunks; $i++) {
    $start = $i * $chunkSize
    $length = [Math]::Min($chunkSize, $base64.Length - $start)
    $chunk = $base64.Substring($start, $length)
    
    $progress = [Math]::Round(($i + 1) / $chunks * 100)
    Write-Host "Загрузка: $progress% ($($i + 1)/$chunks)" -ForegroundColor Yellow
    
    # Экранируем кавычки в chunk
    $chunk = $chunk.Replace('"', '\"')
    $cmd = "ssh -i `"$sshKey`" root@130.49.213.197 `"echo '$chunk' >> /root/invest2026/next.b64`""
    Invoke-Expression $cmd
}

Write-Host "[OK] Загружено" -ForegroundColor Green

Write-Host ""
Write-Host "[4/6] Декодирование на VPS..." -ForegroundColor Yellow
$cmd = "ssh -i `"$sshKey`" root@130.49.213.197 `"base64 -d /root/invest2026/next.b64 > /root/invest2026/next.tar.gz && rm /root/invest2026/next.b64`""
Invoke-Expression $cmd
Write-Host "[OK] Декодировано" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Распаковка..." -ForegroundColor Yellow
$cmd = "ssh -i `"$sshKey`" root@130.49.213.197 `"cd /root/invest2026 && tar -xzf next.tar.gz && rm next.tar.gz`""
Invoke-Expression $cmd
Write-Host "[OK] Распаковано" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] Перезапуск приложения..." -ForegroundColor Yellow
$cmd = "ssh -i `"$sshKey`" root@130.49.213.197 `"cd /root/invest2026 && pm2 restart investpro`""
Invoke-Expression $cmd
Write-Host "[OK] Перезапущено" -ForegroundColor Green

Write-Host ""
Write-Host "Ждем 3 секунды..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ГОТОВО! ИСПРАВЛЕНИЕ ЗАГРУЖЕНО" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Попробуйте создать инвестицию:" -ForegroundColor Cyan
Write-Host "http://130.49.213.197/dashboard/investments" -ForegroundColor Cyan
Write-Host ""

# Удаляем локальный архив
if (Test-Path "next.tar.gz") {
    Remove-Item "next.tar.gz" -Force
}

Read-Host "Нажмите Enter для выхода"
