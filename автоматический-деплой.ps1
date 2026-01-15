$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  АВТОМАТИЧЕСКИЙ ДЕПЛОЙ АДМИНА" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$vpsHost = "130.49.213.197"
$vpsUser = "root"
$vpsPassword = "12345678"

# Создаём SecureString для пароля
$securePassword = ConvertTo-SecureString $vpsPassword -AsPlainText -Force

Write-Host "ШАГ 1: СОЗДАНИЕ АДМИН СТРАНИЦЫ" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/3] Копируем скрипт на VPS..." -ForegroundColor White
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = "/c echo $vpsPassword | scp create-admin-page-on-vps.js ${vpsUser}@${vpsHost}:/root/"
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$process = [System.Diagnostics.Process]::Start($psi)
$process.WaitForExit()

Write-Host ""
Write-Host "[2/3] Создаём файл page.tsx..." -ForegroundColor White
$psi2 = New-Object System.Diagnostics.ProcessStartInfo
$psi2.FileName = "cmd.exe"
$psi2.Arguments = "/c echo $vpsPassword | ssh ${vpsUser}@${vpsHost} `"node /root/create-admin-page-on-vps.js`""
$psi2.RedirectStandardInput = $true
$psi2.RedirectStandardOutput = $true
$psi2.RedirectStandardError = $true
$psi2.UseShellExecute = $false
$process2 = [System.Diagnostics.Process]::Start($psi2)
$process2.WaitForExit()

Write-Host ""
Write-Host "[3/3] Перезапускаем PM2..." -ForegroundColor White
$psi3 = New-Object System.Diagnostics.ProcessStartInfo
$psi3.FileName = "cmd.exe"
$psi3.Arguments = "/c echo $vpsPassword | ssh ${vpsUser}@${vpsHost} `"pm2 restart investpro`""
$psi3.RedirectStandardInput = $true
$psi3.RedirectStandardOutput = $true
$psi3.RedirectStandardError = $true
$psi3.UseShellExecute = $false
$process3 = [System.Diagnostics.Process]::Start($psi3)
$process3.WaitForExit()

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "ШАГ 2: СОЗДАНИЕ АДМИН ПОЛЬЗОВАТЕЛЯ" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/2] Копируем скрипт..." -ForegroundColor White
$psi4 = New-Object System.Diagnostics.ProcessStartInfo
$psi4.FileName = "cmd.exe"
$psi4.Arguments = "/c echo $vpsPassword | scp admin-script-for-vps.js ${vpsUser}@${vpsHost}:/root/create-admin.js"
$psi4.RedirectStandardInput = $true
$psi4.RedirectStandardOutput = $true
$psi4.RedirectStandardError = $true
$psi4.UseShellExecute = $false
$process4 = [System.Diagnostics.Process]::Start($psi4)
$process4.WaitForExit()

Write-Host ""
Write-Host "[2/2] Создаём админа в базе данных..." -ForegroundColor White
$psi5 = New-Object System.Diagnostics.ProcessStartInfo
$psi5.FileName = "cmd.exe"
$psi5.Arguments = "/c echo $vpsPassword | ssh ${vpsUser}@${vpsHost} `"cd /root && node create-admin.js`""
$psi5.RedirectStandardInput = $true
$psi5.RedirectStandardOutput = $true
$psi5.RedirectStandardError = $true
$psi5.UseShellExecute = $false
$process5 = [System.Diagnostics.Process]::Start($psi5)
$output = $process5.StandardOutput.ReadToEnd()
$process5.WaitForExit()

Write-Host ""
Write-Host $output -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "ВСЁ ГОТОВО!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Админ панель: http://130.49.213.197/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Данные для входа:" -ForegroundColor White
Write-Host "  Username: Admin" -ForegroundColor Yellow
Write-Host "  Password: X11021997x" -ForegroundColor Yellow
Write-Host ""
