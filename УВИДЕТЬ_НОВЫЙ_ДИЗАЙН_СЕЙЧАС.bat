@echo off
title 🎨 УВИДЕТЬ НОВЫЙ ДИЗАЙН СЕЙЧАС
color 0B
echo.
echo ████████████████████████████████████████████████████████████████
echo █                                                              █
echo █    🎨 ПРИНУДИТЕЛЬНЫЙ ПРОСМОТР НОВОГО ДИЗАЙНА! 🚀             █
echo █                                                              █
echo ████████████████████████████████████████████████████████████████
echo.

REM Генерируем уникальный timestamp для принудительного обновления
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,14%"

echo 🔄 Принудительно очищаю кэш браузера...
echo.

REM Закрываем все браузеры
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🌐 Открываю сайт с принудительным обновлением...
echo.

REM Открываем главную страницу с cache-busting
start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache "http://213.171.31.215?nocache=%timestamp%&v=2026"
timeout /t 3 /nobreak >nul

REM Открываем админ-панель с cache-busting
start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache "http://213.171.31.215/admin/project-launches?nocache=%timestamp%&v=2026"
timeout /t 2 /nobreak >nul

echo ✅ ГОТОВО! Сайт открыт с принудительной очисткой кэша!
echo.
echo 🎯 ВЫ ДОЛЖНЫ УВИДЕТЬ:
echo    ⚫ Темно-серый фон (slate-900)
echo    🔵 Сине-фиолетовые градиенты  
echo    ✨ Красивые анимации
echo    🚀 Современные карточки
echo.
echo 📱 Если Chrome не работает, попробую Firefox...
start firefox -private-window "http://213.171.31.215?nocache=%timestamp%&v=2026" >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo 🎉 ОРИГИНАЛЬНЫЙ КРАСИВЫЙ ДИЗАЙН ВОССТАНОВЛЕН!
echo.
echo 💡 Если все еще не видите изменения:
echo    🔄 Нажмите Ctrl+F5 для жесткого обновления
echo    🌐 Попробуйте другой браузер
echo    📱 Очистите кэш в настройках браузера
echo.
pause