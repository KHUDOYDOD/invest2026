@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА RENDER + NEON         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Этот скрипт поможет вам задеплоить сайт за 10 минут!
echo.
pause

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ШАГ 1: СОЗДАНИЕ БАЗЫ ДАННЫХ В NEON           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Сейчас откроется Neon Console
echo.
echo ЧТО ДЕЛАТЬ:
echo 1. Войдите через GitHub
echo 2. Нажмите "Create Project"
echo 3. Name: invest2026
echo 4. Region: Europe (Frankfurt)
echo 5. Нажмите "Create Project"
echo 6. СКОПИРУЙТЕ Connection String (ВАЖНО!)
echo 7. Откройте SQL Editor
echo 8. Скопируйте содержимое файла neon-database-setup.sql
echo 9. Вставьте в SQL Editor и нажмите Run
echo.
echo 📝 СОХРАНИТЕ Connection String - она понадобится для Render!
echo.
pause
start https://console.neon.tech
echo.
echo ⏳ Подождите, пока создастся база данных...
echo.
echo Нажмите любую клавишу, когда база данных будет готова...
pause >nul

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ШАГ 2: ДЕПЛОЙ НА RENDER                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Сейчас откроется Render Dashboard
echo.
echo ЧТО ДЕЛАТЬ:
echo 1. Войдите через GitHub
echo 2. Нажмите "New +" → "Web Service"
echo 3. Найдите репозиторий "invest2026"
echo 4. Нажмите "Connect"
echo.
echo ЗАПОЛНИТЕ ФОРМУ:
echo ═══════════════════════════════════════════════════════════
echo Name: invest2026
echo Region: Frankfurt (EU Central)
echo Branch: main
echo Build Command: npm install ^&^& npm run build
echo Start Command: npm start
echo Instance Type: Free
echo ═══════════════════════════════════════════════════════════
echo.
pause
start https://dashboard.render.com

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║         ШАГ 3: ДОБАВЛЕНИЕ ENVIRONMENT VARIABLES            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo В форме Render прокрутите вниз до "Environment Variables"
echo.
echo ДОБАВЬТЕ 7 ПЕРЕМЕННЫХ:
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. DATABASE_URL
echo    Value: [Ваша Connection String из Neon]
echo.
echo 2. POSTGRES_URL
echo    Value: [Ваша Connection String из Neon]
echo.
echo 3. POSTGRES_URL_NON_POOLING
echo    Value: [Ваша Connection String из Neon]
echo.
echo 4. JWT_SECRET
echo    Value: your-super-secret-jwt-key-change-this-12345
echo.
echo 5. NEXTAUTH_SECRET
echo    Value: your-super-secret-nextauth-key-change-67890
echo.
echo 6. NEXTAUTH_URL
echo    Value: https://invest2026.onrender.com
echo.
echo 7. NODE_ENV
echo    Value: production
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 📝 Скопируйте эти значения и добавьте в Render!
echo.
echo Нажмите любую клавишу, когда добавите все переменные...
pause >nul

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ШАГ 4: ЗАПУСК ДЕПЛОЯ                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo В форме Render:
echo 1. Проверьте, что все 7 переменных добавлены
echo 2. Нажмите "Create Web Service"
echo 3. Подождите 5-7 минут
echo.
echo 📊 ВЫ УВИДИТЕ ЛОГИ:
echo    - Installing dependencies (2-3 минуты)
echo    - Building (2-3 минуты)
echo    - Starting (30 секунд)
echo    - Live! ✅
echo.
echo Нажмите любую клавишу, когда деплой завершится...
pause >nul

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🎉 ДЕПЛОЙ ЗАВЕРШЕН!                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ Ваш сайт готов!
echo.
echo 🌐 URL: https://invest2026.onrender.com
echo.
echo 🔐 ВХОД В АДМИН ПАНЕЛЬ:
echo    URL: https://invest2026.onrender.com/login
echo    Логин: admin
echo    Пароль: X12345x
echo.
echo Открыть сайт сейчас? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    start https://invest2026.onrender.com
    echo.
    echo Открываю сайт...
    timeout /t 2 >nul
    start https://invest2026.onrender.com/login
    echo Открываю страницу входа...
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              📖 ПОЛЕЗНАЯ ИНФОРМАЦИЯ                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📊 Render Dashboard: https://dashboard.render.com
echo 🗄️ Neon Console: https://console.neon.tech
echo 📦 GitHub Repo: https://github.com/KHUDOYDOD/invest2026
echo.
echo 💡 АВТОМАТИЧЕСКИЕ ОБНОВЛЕНИЯ:
echo    git add .
echo    git commit -m "Update"
echo    git push
echo    (Render автоматически задеплоит изменения!)
echo.
echo 📝 ЛОГИ И МОНИТОРИНГ:
echo    Render Dashboard → Ваш сервис → Logs
echo.
echo ⚠️ ВАЖНО:
echo    - Бесплатный план Render засыпает после 15 минут
echo    - Первый запрос после сна займет ~30 секунд
echo    - База данных Neon не засыпает
echo.
pause
