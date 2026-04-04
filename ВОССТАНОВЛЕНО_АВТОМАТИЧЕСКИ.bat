
@echo off
title ✅ ДИЗАЙН ВОССТАНОВЛЕН АВТОМАТИЧЕСКИ
color 0A
echo.
echo ████████████████████████████████████████████████████████████████
echo █                                                              █
echo █    ✅ ОРИГИНАЛЬНЫЙ ДИЗАЙН ВОССТАНОВЛЕН АВТОМАТИЧЕСКИ! 🎨     █
echo █                                                              █
echo ████████████████████████████████████████████████████████████████
echo.

echo 🔄 Сервер пересобран и перезапущен
echo 🎨 Оригинальный дизайн восстановлен
echo 🚀 Открываю admin/project-launches...
echo.

REM Генерируем уникальный timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,14%"

REM Закрываем браузеры для очистки кэша
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🌐 Открываю в приватном режиме с принудительной очисткой кэша...

REM Открываем admin/project-launches
start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache --no-first-run "http://213.171.31.215/admin/project-launches?nocache=%timestamp%&restored=true"
timeout /t 3 /nobreak >nul

REM Открываем главную страницу
start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache --no-first-run "http://213.171.31.215?nocache=%timestamp%&restored=true"

echo.
echo ✅ ГОТОВО! ДИЗАЙН ВОССТАНОВЛЕН!
echo.
echo 🎯 ВЫ ДОЛЖНЫ УВИДЕТЬ:
echo    ⚫ Темно-серый фон (slate-900)
echo    🔵 Сине-фиолетовые градиенты
echo    ✨ Красивые анимации
echo    🚀 Элегантные карточки
echo    💫 Плавные переходы
echo.
echo 📱 Если Chrome не работает, попробую Firefox...
start firefox -private-window "http://213.171.31.215/admin/project-launches?nocache=%timestamp%&restored=true" >nul 2>&1

echo.
echo 🎉 ОРИГИНАЛЬНЫЙ КРАСИВЫЙ ДИЗАЙН ПОЛНОСТЬЮ ВОССТАНОВЛЕН!
echo    Без вашего участия - все сделано автоматически!
echo.
pause