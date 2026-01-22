# Подключение к VPS с паролем и добавление SSH ключа
$server = "45.155.205.43"
$username = "root11"
$password = '$X11021997x$'

$publicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDXZkc34FyCdhZW5mR0bP1M57fiaN0cMEtZ9iAHgB9SgvFZ+22ssORY1eUf7exzKaUC6ekWfR0XV/dM69FuzDBxZCh6Q/TxV/Meq8yGAAbWWyvXCrAZfyXYBPaJV2adWIcSvmt6Rm3+KgXelJX7QfGWoFPPGh3auZjrtEoj3sqeUTbN1pXrhoO65qvpFqI86Bg0fxsYxBfM3R3PPYMZmm9Oe+9TwMSs2o0+cmkk8ZkPfPSUM1o+kpBcplbGuWPLCbcDmbMijC/ZE8dWscmjWt9ys1GHTUHyX6n+F90sLq1Tkh5qxNnachyBcAuN/fSzhm9HaXKk/I7UDwHIGvEeG8lybOw06KyGiylpIoimERrCeG57wK0agts+VngeV32VpViOYQy+c3N9deRz6hmJ548n7kNvEs+MEk2s8UYyJzCRijbEqj9RtwAYe2goPiBAKRdsyEo+gS7cpEuW0fzYFLF4hnOiRx5FxZC8v05gyE3QNXEd2cL4Rs+sLNKSEA4TtSuVsj4cn4Y3Rsj5QIgVU8RMbbAgx1R5qBq1jGfisJXueBVbJ3lSjvnlcWDG5WNIhcPsIsxluQ+SQucICMHmxQMqOvFd1Y9lFssswRLY32JPOa6Q0OxYrhVeqNQEilL7qSOVKynYJtPCGir0hIEDdcwACBnby8Gt4nWYDbNfFzeIdQ== x4539@KHUDOIDOD"

Write-Host "========================================" -ForegroundColor Green
Write-Host "🔑 ПОДКЛЮЧЕНИЕ К VPS И ДОБАВЛЕНИЕ КЛЮЧА" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

try {
    # Создаем команды для выполнения на сервере
    $commands = @(
        "mkdir -p ~/.ssh",
        "chmod 700 ~/.ssh",
        "echo '$publicKey' >> ~/.ssh/authorized_keys",
        "chmod 600 ~/.ssh/authorized_keys",
        "echo 'SSH ключ успешно добавлен!'"
    )
    
    Write-Host "[INFO] Подключение к серверу $server..." -ForegroundColor Yellow
    
    # Выполняем команды через SSH с паролем
    foreach ($command in $commands) {
        Write-Host "[EXEC] $command" -ForegroundColor Cyan
        $result = & ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$username@$server" $command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Команда выполнена успешно" -ForegroundColor Green
        } else {
            Write-Host "❌ Ошибка выполнения команды" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "🧪 Тестирование SSH подключения с ключом..." -ForegroundColor Yellow
    
    # Тестируем подключение с ключом
    $keyPath = "$env:USERPROFILE\.ssh\id_rsa_vps_new"
    $testResult = & ssh -i $keyPath -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$username@$server" "echo 'SSH подключение работает!'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SSH подключение с ключом работает!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Теперь можно запускать автодеплой!" -ForegroundColor Green
    } else {
        Write-Host "❌ SSH подключение с ключом не работает" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Read-Host "Нажмите Enter для продолжения"