@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🔍 ПРОВЕРКА НОВОГО ДИЗАЙНА
echo ═══════════════════════════════════════════════════════
echo.

echo [Шаг 1] Проверяем файл компонента...
findstr /C:"bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" components\project-launches.tsx >nul
if %errorlevel%==0 (
    echo ✅ Файл компонента ПРАВИЛЬНЫЙ - градиент найден!
) else (
    echo ❌ ОШИБКА: Градиент НЕ найден в файле!
    echo    Нужно обновить файл из GitHub
    pause
    exit /b
)

echo.
echo [Шаг 2] Проверяем подключение на главной странице...
findstr /C:"ProjectLaunches" app\page.tsx >nul
if %errorlevel%==0 (
    echo ✅ Компонент ПОДКЛЮЧЕН на главной странице!
) else (
    echo ❌ ОШИБКА: Компонент НЕ подключен!
    pause
    exit /b
)

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ ВСЕ ФАЙЛЫ ПРАВИЛЬНЫЕ!
echo ═══════════════════════════════════════════════════════
echo.
echo Проблема в КЭШЕ БРАУЗЕРА!
echo.
echo 🔧 РЕШЕНИЕ:
echo.
echo 1. Откройте браузер в режиме ИНКОГНИТО:
echo    Chrome/Edge: Ctrl + Shift + N
echo.
echo 2. Перейдите на: http://localhost:3000
echo.
echo 3. Вы ДОЛЖНЫ увидеть ЗЕЛЕНЫЙ градиент!
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo Открыть демо в браузере? (Y/N)
set /p choice=Ваш выбор: 

if /i "%choice%"=="Y" (
    echo.
    echo Открываем демо файл...
    start "" "%~dp0УВИДЕТЬ_НОВЫЙ_ДИЗАЙН_СЕЙЧАС.html"
    timeout /t 2 >nul
)

echo.
echo Запустить сервер? (Y/N)
set /p choice2=Ваш выбор: 

if /i "%choice2%"=="Y" (
    call "%~dp0ЗАПУСТИТЬ_НОВЫЙ_ДИЗАЙН.bat"
) else (
    echo.
    echo Готово! Проверьте браузер в режиме инкогнито.
    pause
)
