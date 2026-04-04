# Скрипт для автоматического подтверждения команд
# Использование: powershell -File auto-yes.ps1 "команда"

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

Write-Host "🤖 Автоматическое выполнение команды..." -ForegroundColor Green
Write-Host "Команда: $Command" -ForegroundColor Cyan

# Выполняем команду с автоматическим подтверждением
$output = $Command | Invoke-Expression 2>&1

# Выводим результат
Write-Host "`n📊 Результат:" -ForegroundColor Yellow
$output | ForEach-Object { Write-Host $_ }

Write-Host "`n✅ Готово!" -ForegroundColor Green
