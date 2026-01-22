$server = "213.171.31.215"
$ports = @(21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3000, 3001, 8000, 8080, 8443, 9000)

Write-Host "Port scanning $server"
Write-Host "====================="

$openPorts = @()

foreach ($port in $ports) {
    Write-Host "Port $port..." -NoNewline
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connect = $tcpClient.BeginConnect($server, $port, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne(2000, $false)
        
        if ($wait -and $tcpClient.Connected) {
            Write-Host " OPEN" -ForegroundColor Green
            $openPorts += $port
        } else {
            Write-Host " CLOSED" -ForegroundColor Red
        }
        $tcpClient.Close()
    } catch {
        Write-Host " CLOSED" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Open ports: $($openPorts -join ', ')"