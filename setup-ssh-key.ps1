# ============================================
# НАСТРОЙКА SSH КЛЮЧА ДЛЯ VPS
# ============================================

$VPS_IP = "130.49.213.197"
$VPS_USER = "root"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_FILE = "$SSH_DIR\id_rsa_vps"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  НАСТРОЙКА SSH КЛЮЧА" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Создаём директорию .ssh если её нет
if (-not (Test-Path $SSH_DIR)) {
    Write-Host "Создаём директорию .ssh..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $SSH_DIR -Force | Out-Null
}

# Проверяем, есть ли уже ключ
if (Test-Path $KEY_FILE) {
    Write-Host "SSH ключ уже существует: $KEY_FILE" -ForegroundColor Yellow
    $response = Read-Host "Создать новый ключ? (y/n)"
    if ($response -ne "y") {
        Write-Host "Используем существующий ключ" -ForegroundColor Green
    } else {
        Remove-Item $KEY_FILE -Force
        Remove-Item "$KEY_FILE.pub" -Force -ErrorAction SilentlyContinue
    }
}

# Генерируем SSH ключ если его нет
if (-not (Test-Path $KEY_FILE)) {
    Write-Host ""
    Write-Host "Генерируем SSH ключ..." -ForegroundColor Green
    Write-Host "Нажимайте Enter на все вопросы (не вводите passphrase)" -ForegroundColor Yellow
    Write-Host ""
    
    ssh-keygen -t rsa -b 4096 -f $KEY_FILE -N '""'
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Ошибка при генерации ключа!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ SSH ключ создан: $KEY_FILE" -ForegroundColor Green
Write-Host ""

# Копируем ключ на VPS
Write-Host "Копируем ключ на VPS..." -ForegroundColor Green
Write-Host "Введите пароль от VPS (ПОСЛЕДНИЙ РАЗ!):" -ForegroundColor Yellow
Write-Host ""

$publicKey = Get-Content "$KEY_FILE.pub"

# Команда для добавления ключа на VPS
$sshCommand = @"
mkdir -p ~/.ssh && \
chmod 700 ~/.ssh && \
echo '$publicKey' >> ~/.ssh/authorized_keys && \
chmod 600 ~/.ssh/authorized_keys && \
echo 'SSH ключ успешно добавлен!'
"@

ssh "${VPS_USER}@${VPS_IP}" $sshCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ НАСТРОЙКА ЗАВЕРШЕНА!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Теперь вы можете подключаться БЕЗ ПАРОЛЯ!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Проверим подключение..." -ForegroundColor Yellow
    Write-Host ""
    
    # Тестовое подключение
    ssh -i $KEY_FILE "${VPS_USER}@${VPS_IP}" "echo 'Подключение без пароля работает!' && hostname"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Отлично! Подключение без пароля работает!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Теперь все скрипты будут работать БЕЗ ВВОДА ПАРОЛЯ:" -ForegroundColor Cyan
        Write-Host "  - vps-auto-setup.bat" -ForegroundColor White
        Write-Host "  - update_site.bat" -ForegroundColor White
        Write-Host "  - vps-status.bat" -ForegroundColor White
        Write-Host "  - vps-logs.bat" -ForegroundColor White
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "❌ Ошибка при копировании ключа" -ForegroundColor Red
    Write-Host "Проверьте пароль и попробуйте снова" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
