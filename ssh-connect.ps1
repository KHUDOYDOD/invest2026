$server = "213.171.31.215"
$username = "root11"
$password = '$X11021997x$'

# Попробуем разные методы подключения
Write-Host "Попытка 1: SSH с принудительной аутентификацией по паролю..."
$result1 = ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -o PasswordAuthentication=yes $username@$server "echo 'Connected successfully'" 2>&1

Write-Host "Попытка 2: SSH с игнорированием ключей..."
$result2 = ssh -o IdentitiesOnly=no -o PreferredAuthentications=password $username@$server "echo 'Connected successfully'" 2>&1

Write-Host "Попытка 3: Проверка доступных методов аутентификации..."
$result3 = ssh -o PreferredAuthentications=none $username@$server 2>&1

Write-Host "Результаты:"
Write-Host "Попытка 1: $result1"
Write-Host "Попытка 2: $result2" 
Write-Host "Попытка 3: $result3"