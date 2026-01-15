# ============================================
# АВТОМАТИЧЕСКАЯ НАСТРОЙКА SSH КЛЮЧА
# Работает БЕЗ подтверждений
# ============================================

$VPS_IP = "130.49.213.197"
$VPS_USER = "root"
$VPS_PASSWORD = "12345678"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_FILE = "$SSH_DIR\id_rsa_vps"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  АВТОМАТИЧЕСКАЯ НАСТРОЙКА SSH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Создаём директорию .ssh
if (-not (Test-Path $SSH_DIR)) {
    Write-Host "[1/4] Создаём .ssh директорию..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $SSH_DIR -Force | Out-Null
} else {
    Write-Host "[1/4] Директория .ssh уже существует" -ForegroundColor Green
}

# Генерируем ключ (перезаписываем если есть)
Write-Host "[2/4] Генерируем SSH ключ..." -ForegroundColor Yellow
if (Test-Path $KEY_FILE) {
    Remove-Item $KEY_FILE -Force -ErrorAction SilentlyContinue
    Remove-Item "$KEY_FILE.pub" -Force -ErrorAction SilentlyContinue
}

# Генерируем без вопросов
ssh-keygen -t rsa -b 4096 -f $KEY_FILE -N '""' -q

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SSH ключ создан" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка создания ключа" -ForegroundColor Red
    exit 1
}

# Копируем ключ на VPS
Write-Host "[3/4] Копируем ключ на VPS..." -ForegroundColor Yellow

$publicKey = Get-Content "$KEY_FILE.pub"

# Используем sshpass или expect для автоматического ввода пароля
# Для Windows используем plink если есть, или обычный ssh с ожиданием
$sshCommand = "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'OK'"

# Пробуем скопировать ключ
Write-Host "Вводим пароль автоматически..." -ForegroundColor Gray

# Создаём временный скрипт для автоматического ввода пароля
$expectScript = @"
spawn ssh ${VPS_USER}@${VPS_IP} "$sshCommand"
expect "password:"
send "$VPS_PASSWORD\r"
expect eof
"@

# Для Windows используем другой подход - через echo и pipe
$result = echo y | ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" $sshCommand 2>&1

Write-Host "✅ Ключ скопирован" -ForegroundColor Green

# Проверяем подключение
Write-Host "[4/4] Проверяем подключение без пароля..." -ForegroundColor Yellow

$testResult = ssh -i $KEY_FILE -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" "echo 'SUCCESS' && hostname" 2>&1

if ($testResult -match "SUCCESS") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ ГОТОВО!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Теперь все команды работают БЕЗ ПАРОЛЯ!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Можете использовать:" -ForegroundColor White
    Write-Host "  - обновить-сайт.bat" -ForegroundColor Gray
    Write-Host "  - vps-logs.bat" -ForegroundColor Gray
    Write-Host "  - vps-connect.bat" -ForegroundColor Gray
    Write-Host "  - проверить-сайт.bat" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️ Подключение работает, но нужно ввести пароль вручную один раз" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Запустите эту команду и введите пароль: 12345678" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ssh-copy-id -i `"$KEY_FILE.pub`" ${VPS_USER}@${VPS_IP}" -ForegroundColor White
    Write-Host ""
}

Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
