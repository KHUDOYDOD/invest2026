@echo off
chcp 65001 >nul
echo ========================================
echo 🔑 ДОБАВЛЕНИЕ SSH КЛЮЧА НА VPS
echo ========================================
echo.

set PUBLIC_KEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDXZkc34FyCdhZW5mR0bP1M57fiaN0cMEtZ9iAHgB9SgvFZ+22ssORY1eUf7exzKaUC6ekWfR0XV/dM69FuzDBxZCh6Q/TxV/Meq8yGAAbWWyvXCrAZfyXYBPaJV2adWIcSvmt6Rm3+KgXelJX7QfGWoFPPGh3auZjrtEoj3sqeUTbN1pXrhoO65qvpFqI86Bg0fxsYxBfM3R3PPYMZmm9Oe+9TwMSs2o0+cmkk8ZkPfPSUM1o+kpBcplbGuWPLCbcDmbMijC/ZE8dWscmjWt9ys1GHTUHyX6n+F90sLq1Tkh5qxNnachyBcAuN/fSzhm9HaXKk/I7UDwHIGvEeG8lybOw06KyGiylpIoimERrCeG57wK0agts+VngeV32VpViOYQy+c3N9deRz6hmJ548n7kNvEs+MEk2s8UYyJzCRijbEqj9RtwAYe2goPiBAKRdsyEo+gS7cpEuW0fzYFLF4hnOiRx5FxZC8v05gyE3QNXEd2cL4Rs+sLNKSEA4TtSuVsj4cn4Y3Rsj5QIgVU8RMbbAgx1R5qBq1jGfisJXueBVbJ3lSjvnlcWDG5WNIhcPsIsxluQ+SQucICMHmxQMqOvFd1Y9lFssswRLY32JPOa6Q0OxYrhVeqNQEilL7qSOVKynYJtPCGir0hIEDdcwACBnby8Gt4nWYDbNfFzeIdQ== x4539@KHUDOIDOD

echo [INFO] Подключение к VPS и добавление SSH ключа...
echo.

sshpass -p "$X11021997x$" ssh -o StrictHostKeyChecking=no root11@45.155.205.43 "
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo '%PUBLIC_KEY%' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo 'SSH ключ успешно добавлен!'
"

if errorlevel 1 (
    echo.
    echo ❌ Ошибка! Попробуем через PowerShell...
    echo.
    powershell -Command "
    $password = ConvertTo-SecureString '$X11021997x$' -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential('root11', $password)
    
    # Создаем SSH сессию
    $session = New-SSHSession -ComputerName '45.155.205.43' -Credential $credential -AcceptKey
    
    # Выполняем команды
    Invoke-SSHCommand -SessionId $session.SessionId -Command 'mkdir -p ~/.ssh && chmod 700 ~/.ssh'
    Invoke-SSHCommand -SessionId $session.SessionId -Command 'echo \"%PUBLIC_KEY%\" >> ~/.ssh/authorized_keys'
    Invoke-SSHCommand -SessionId $session.SessionId -Command 'chmod 600 ~/.ssh/authorized_keys'
    
    Remove-SSHSession -SessionId $session.SessionId
    Write-Host 'SSH ключ добавлен через PowerShell!'
    "
)

echo.
echo ✅ SSH ключ добавлен на VPS!
echo.
echo 🧪 Тестирование подключения...
ssh -i "%USERPROFILE%\.ssh\id_rsa_vps_new" -o ConnectTimeout=10 -o StrictHostKeyChecking=no root11@45.155.205.43 "echo 'SSH подключение работает!'"

if errorlevel 1 (
    echo ❌ SSH подключение не работает
    echo Попробуйте добавить ключ вручную через веб-консоль
) else (
    echo ✅ SSH подключение работает!
    echo Теперь можно запускать автодеплой
)

echo.
pause