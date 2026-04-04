@echo off
echo ========================================
echo   ОТКРЫТИЕ САЙТА ПО IP АДРЕСУ
echo ========================================
echo.
echo Открываю сайт: http://213.171.31.215
echo.
echo Если не открылось автоматически:
echo 1. Скопируйте: http://213.171.31.215
echo 2. Откройте НОВОЕ окно инкогнито (Ctrl+Shift+N)
echo 3. Вставьте адрес в адресную строку
echo.
pause

REM Открываем в браузере по умолчанию
start http://213.171.31.215

REM Также открываем в Chrome в режиме инкогнито (если установлен)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo Открываю в Chrome (инкогнито)...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --incognito http://213.171.31.215
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo Открываю в Chrome (инкогнито)...
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --incognito http://213.171.31.215
)

echo.
echo ========================================
echo   САЙТ ДОЛЖЕН ОТКРЫТЬСЯ
echo ========================================
echo.
echo Если видишь ошибку:
echo - Очисти кэш браузера (Ctrl+Shift+Delete)
echo - Попробуй другой браузер
echo - Проверь, что не используешь VPN
echo.
pause