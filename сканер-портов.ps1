# Сканирование портов сервера 213.171.31.215
$server = "213.171.31.215"
$commonPorts = @(21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3000, 3001, 8000, 8080, 8443, 9000)

Write-Host "========================================" -ForegroundColor Green
Write-Host "🔍 СКАНИРОВАНИЕ ПОРТОВ $server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$openPorts = @()

foreach ($port in $commonPorts) {
    Write-Host "Проверка порта $port..." -NoNewline
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connect = $tcpClient.BeginConnect($server, $port, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne(3000, $false)
        
        if ($wait -and $tcpClient.Connected) {
            Write-Host " ✅ ОТКРЫТ" -ForegroundColor Green
            $openPorts += $port
        } else {
            Write-Host " ❌ Закрыт" -ForegroundColor Red
        }
        $tcpClient.Close()
    } catch {
        Write-Host " ❌ Закрыт" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "📊 РЕЗУЛЬТАТЫ СКАНИРОВАНИЯ" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

if ($openPorts.Count -gt 0) {
    Write-Host "Открытые порты: $($openPorts -join ', ')" -ForegroundColor Green
    
    foreach ($port in $openPorts) {
        switch ($port) {
            22 { Write-Host "  - Порт 22: SSH сервер" -ForegroundColor Cyan }
            80 { Write-Host "  - Порт 80: HTTP веб-сервер" -ForegroundColor Cyan }
            443 { Write-Host "  - Порт 443: HTTPS веб-сервер" -ForegroundColor Cyan }
            3000 { Write-Host "  - Порт 3000: Node.js приложение" -ForegroundColor Cyan }
            8080 { Write-Host "  - Порт 8080: Альтернативный HTTP" -ForegroundColor Cyan }
            default { Write-Host "  - Порт $port`: Неизвестный сервис" -ForegroundColor Yellow }
        }
    }
} else {
    Write-Host "No open ports found (except SSH)" -ForegroundColor Yellow
}

Write-Host ""