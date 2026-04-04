@echo off
title 🎨 СУПЕР ЯРКИЙ ДИЗАЙН ГОТОВ!
color 0E
echo.
echo ████████████████████████████████████████████████████████████████
echo █                                                              █
echo █    🎨 СУПЕР ЯРКИЙ ДИЗАЙН ГОТОВ! БОЛЬШЕ НЕ ГРУСТНО! 🌈       █
echo █                                                              █
echo ████████████████████████████████████████████████████████████████
echo.

echo 🎉 СОЗДАН СУПЕР ЯРКИЙ ДИЗАЙН:
echo    🌈 Розово-фиолетово-синий градиент
echo    ✨ Желто-оранжевые кнопки
echo    💫 Анимации bounce и pulse
echo    🎪 Яркие цвета везде
echo    🚀 Супер заголовки с эмодзи
echo.

REM Генерируем timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,14%"

echo 🔄 Закрываю браузеры для очистки кэша...
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🌈 Открываю СУПЕР ЯРКИЙ дизайн...

REM Открываем admin/project-launches
start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache --no-first-run "http://213.171.31.215/admin/project-launches?bright=true&nocache=%timestamp%"
timeout /t 3 /nobreak >nul

REM Открываем главную страницу
start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache --no-first-run "http://213.171.31.215?bright=true&nocache=%timestamp%"

echo.
echo ✅ ГОТОВО! СУПЕР ЯРКИЙ ДИЗАЙН ОТКРЫТ!
echo.
echo 🎯 ВЫ УВИДИТЕ:
echo    🌈 РОЗОВО-ФИОЛЕТОВО-СИНИЙ фон
echo    🟡 ЖЕЛТО-ОРАНЖЕВЫЕ кнопки
echo    ✨ АНИМАЦИИ bounce и pulse
echo    🎪 ЯРКИЕ цвета ВЕЗДЕ
echo    🚀 СУПЕР заголовки с ЭМОДЗИ
echo    💫 МАГИЧЕСКИЕ переходы
echo.
echo 📱 Если Chrome не работает, попробую Firefox...
start firefox -private-window "http://213.171.31.215/admin/project-launches?bright=true&nocache=%timestamp%" >nul 2>&1
timeout /t 2 /nobreak >nul
start firefox -private-window "http://213.171.31.215?bright=true&nocache=%timestamp%" >nul 2>&1

echo.
echo 🎉 СУПЕР ЯРКИЙ ДИЗАЙН АКТИВЕН!
echo    Больше никакой грусти - только РАДОСТЬ! 🌈
echo.
pause