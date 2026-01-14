# PowerShell script to add Vercel environment variables

$envVars = @{
    "POSTGRES_URL" = "postgres://postgres.hndoefvarvhfickrvlbf:_`$X11021997x`$_@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
    "POSTGRES_URL_NON_POOLING" = "postgres://postgres.hndoefvarvhfickrvlbf:_`$X11021997x`$_@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
    "SUPABASE_URL" = "https://hndoefvarvhfickrvlbf.supabase.co"
    "NEXT_PUBLIC_SUPABASE_URL" = "https://hndoefvarvhfickrvlbf.supabase.co"
    "SUPABASE_ANON_KEY" = "sb_publishable_WQZ32E6Y4Mk41os57uoq1Q_8LfypBtS"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "sb_publishable_WQZ32E6Y4Mk41os57uoq1Q_8LfypBtS"
    "SUPABASE_SERVICE_ROLE_KEY" = "sb_secret_qe8iJqGUVrWqh6rlJS4OkA_52AQY3SI"
}

Write-Host "🔧 Добавление переменных окружения в Vercel..." -ForegroundColor Cyan
Write-Host ""

foreach ($key in $envVars.Keys) {
    Write-Host "📝 Добавление $key..." -ForegroundColor Yellow
    
    $value = $envVars[$key]
    
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value -NoNewline
    
    try {
        # Use echo to pipe the value
        $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c echo $value | vercel env add $key production" -NoNewWindow -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ $key добавлен" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $key: возможно уже существует" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Ошибка при добавлении $key" -ForegroundColor Red
    }
    
    Remove-Item $tempFile -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "✅ Готово!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Запускаю redeploy..." -ForegroundColor Cyan
vercel --prod --yes

Write-Host ""
Write-Host "📝 Проверьте API: node check-api-endpoints.js" -ForegroundColor Cyan
