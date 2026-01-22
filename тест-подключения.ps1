# Тест подключения к серверу 213.171.31.215
$server = "213.171.31.215"
$username = "root11"
$password = '$X11021997x$'

Write-Host "========================================" -ForegroundColor Green
Write-Host "🔍 ТЕСТ ПОДКЛЮЧЕНИЯ К СЕРВЕРУ" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Сервер: $server" -ForegroundColor Cyan
Write-Host "Пользователь: $username" -ForegroundColor Cyan
Write-Host ""

# Проверка ping
Write-Host "[1/3] Проверка ping..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $server -Count 2 -Quiet
if ($ping) {
    Write-Host "✅ Ping успешен" -ForegroundColor Green
} else {
    Write-Host "❌ Ping неуспешен" -ForegroundColor Red
}

# Проверка SSH порта
Write-Host "[2/3] Проверка SSH порта 22..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.ConnectAsync($server, 22).Wait(5000)
    if ($tcpClient.Connected) {
        Write-Host "✅ SSH порт 22 открыт" -ForegroundColor Green
        $tcpClient.Close()
    } else {
        Write-Host "❌ SSH порт 22 закрыт" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка подключения к SSH порту" -ForegroundColor Red
}

# Попытка SSH подключения с паролем
Write-Host "[3/3] Попытка SSH подключения..." -ForegroundColor Yellow

# Создаем временный скрипт для plink
$plinkScript = @"
echo y | plink -ssh -l $username -pw $password $server "echo 'SSH подключение работает!'"
"@

try {
    $result = Invoke-Expression $plinkScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SSH подключение с паролем работает!" -ForegroundColor Green
        Write-Host "🚀 Можно запускать деплой!" -ForegroundColor Green
    } else {
        Write-Host "❌ SSH подключение не работает" -ForegroundColor Red
        Write-Host "Код ошибки: $LASTEXITCODE" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка SSH: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "📋 РЕЗУЛЬТАТ ПРОВЕРКИ" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

if ($ping -and $LASTEXITCODE -eq 0) {
    Write-Host "✅ Сервер готов к деплою!" -ForegroundColor Green
    Write-Host "Запустите: деплой-новый-сервер.bat" -ForegroundColor Cyan
} else {
    Write-Host "❌ Сервер не готов" -ForegroundColor Red
    Write-Host "Используйте веб-консоль для подключения" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to continue"