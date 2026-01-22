param(
    [string]$Command = "echo 'Connected successfully'"
)

$password = '$X11021997x$'
$host = 'root11@45.155.205.43'

# Создаем временный expect скрипт
$expectScript = @"
spawn ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no $host "$Command"
expect "password:"
send "$password\r"
expect eof
"@

$expectScript | Out-File -FilePath "temp_ssh.exp" -Encoding ASCII

# Выполняем через expect (если доступен)
try {
    expect temp_ssh.exp
} catch {
    Write-Host "Expect не найден, пробуем другой способ..."
    
    # Альтернативный способ через PowerShell
    $securePassword = ConvertTo-SecureString $password -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential($host, $securePassword)
    
    # Пробуем подключиться
    ssh -o ConnectTimeout=30 -o StrictHostKeyChecking=no $host $Command
}

Remove-Item "temp_ssh.exp" -ErrorAction SilentlyContinue