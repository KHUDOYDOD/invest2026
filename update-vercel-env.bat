@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ VERCEL ENV                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🔧 Обновление переменных окружения на Vercel...
echo.

echo 📝 Удаление старых переменных...
call vercel env rm POSTGRES_URL production --yes 2>nul
call vercel env rm POSTGRES_URL_NON_POOLING production --yes 2>nul
call vercel env rm SUPABASE_URL production --yes 2>nul
call vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes 2>nul
call vercel env rm SUPABASE_ANON_KEY production --yes 2>nul
call vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>nul
call vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes 2>nul

echo.
echo ⚠️  Vercel CLI требует интерактивного ввода для добавления переменных.
echo.
echo 📋 Пожалуйста, обновите переменные вручную:
echo.
echo 🔗 https://vercel.com/xx453925xx-1555s-projects/invest2025-main/settings/environment-variables
echo.
echo 📄 Все значения находятся в файле: UPDATE_VERCEL_ENV.md
echo.
pause
