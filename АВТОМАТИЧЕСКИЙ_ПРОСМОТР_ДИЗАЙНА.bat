@echo off
echo.
echo ========================================
echo 🎨 АВТОМАТИЧЕСКИЙ ПРОСМОТР НОВОГО ДИЗАЙНА
echo ========================================
echo.
echo 🚀 Открываю сайт с принудительной очисткой кэша...
echo.

REM Закрываем все браузеры для полной очистки
echo 🔄 Закрываю браузеры для очистки кэша...
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Открываем в приватном режиме Chrome
echo 🌐 Открываю Chrome в приватном режиме...
start chrome --incognito --disable-web-security --disable-features=VizDisplayCompositor --no-first-run --disable-cache --disable-application-cache --disable-offline-load-stale-cache --disable-gpu-sandbox --disable-extensions --disable-plugins "http://213.171.31.215"
timeout /t 3 /nobreak >nul

REM Открываем админ-панель
echo 🔧 Открываю админ-панель...
start chrome --incognito --disable-web-security --disable-features=VizDisplayCompositor --no-first-run --disable-cache --disable-application-cache --disable-offline-load-stale-cache --disable-gpu-sandbox --disable-extensions --disable-plugins "http://213.171.31.215/admin/project-launches"
timeout /t 2 /nobreak >nul

echo.
echo ✅ ГОТОВО! Сайт открыт в приватном режиме Chrome!
echo.
echo 🎯 ЧТО ВЫ ДОЛЖНЫ УВИДЕТЬ:
echo    🌈 РОЗОВО-ФИОЛЕТОВО-ГОЛУБОЙ фон
echo    ✨ Заголовок "НОВЫЙ ДИЗАЙН 2026!"
echo    💫 Анимации пульсации и bounce
echo    🎪 Яркие цветные карточки
echo.
echo 📱 Если Chrome не установлен, попробую Firefox...
start firefox -private-window "http://213.171.31.215" >nul 2>&1
timeout /t 2 /nobreak >nul
start firefox -private-window "http://213.171.31.215/admin/project-launches" >nul 2>&1

echo.
echo 🔥 СУПЕР ЯРКИЙ ДИЗАЙН АКТИВЕН!
echo    Если не видите изменения - обновите страницу (F5)
echo.
pause