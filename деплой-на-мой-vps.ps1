# Деплой проекта на VPS 45.155.205.43
$server = "45.155.205.43"
$username = "root11" 
$password = '$X11021997x$'

Write-Host "========================================" -ForegroundColor Green
Write-Host "🚀 ДЕПЛОЙ НА VPS $server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Проверка доступности сервера
Write-Host "[1/12] Проверка доступности сервера..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $server -Count 2 -Quiet
if (-not $ping) {
    Write-Host "❌ Сервер недоступен!" -ForegroundColor Red
    Write-Host "Проверьте статус сервера у провайдера" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}
Write-Host "✅ Сервер доступен!" -ForegroundColor Green

# Команды для выполнения на сервере
$commands = @(
    "apt update && apt upgrade -y",
    "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && apt-get install -y nodejs",
    "npm install -g pm2 && apt-get install -y nginx git",
    "cd /root && rm -rf invest2026 && git clone https://github.com/KHUDOYDOD/invest2026.git",
    "cd /root/invest2026 && npm install",
    @"
cd /root/invest2026 && cat > .env.production << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
NEXTAUTH_URL=http://45.155.205.43
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
NODE_ENV=production
EOF
"@,
    "cd /root/invest2026 && npm run build",
    @"
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name 45.155.205.43;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
    }
}
EOF
"@,
    "systemctl restart nginx && systemctl enable nginx",
    "pm2 delete all 2>/dev/null || true",
    "cd /root/invest2026 && NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start",
    "pm2 startup && pm2 save"
)

$stepNames = @(
    "Обновление системы",
    "Установка Node.js",
    "Установка PM2 и зависимостей", 
    "Клонирование проекта",
    "Установка зависимостей проекта",
    "Создание .env.production",
    "Сборка проекта",
    "Настройка Nginx",
    "Перезапуск Nginx",
    "Остановка старых процессов",
    "Запуск приложения",
    "Настройка автозапуска"
)

# Выполнение команд
for ($i = 0; $i -lt $commands.Length; $i++) {
    $step = $i + 2
    Write-Host "[$step/12] $($stepNames[$i])..." -ForegroundColor Yellow
    
    try {
        # Используем plink для SSH подключения с паролем
        $command = $commands[$i]
        $result = echo y | plink -ssh -l $username -pw $password $server $command 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Выполнено успешно" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Возможны предупреждения, продолжаем..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Попробуйте выполнить команду вручную через веб-консоль:" -ForegroundColor Yellow
        Write-Host $command -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ ДЕПЛОЙ ЗАВЕРШЕН!" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Сайт: http://$server" -ForegroundColor Cyan
Write-Host "🔧 Админка: http://$server/admin/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Данные для входа в админку:" -ForegroundColor Yellow
Write-Host "Логин: admin" -ForegroundColor White
Write-Host "Пароль: X11021997x" -ForegroundColor White
Write-Host ""

# Открытие сайта
Write-Host "🌐 Открываю сайт в браузере..." -ForegroundColor Yellow
Start-Process "http://$server"
Start-Sleep 2
Start-Process "http://$server/admin/dashboard"

Read-Host "Нажмите Enter для завершения"