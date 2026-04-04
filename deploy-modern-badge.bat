@echo off
chcp 65001 >nul
echo ========================================
echo  ДЕПЛОЙ СОВРЕМЕННОЙ ПЛАШКИ
echo ========================================
echo.
echo Обновляю компонент ProjectLaunches...
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

echo [1/3] Сборка проекта...
call npm run build
if errorlevel 1 (
    echo ❌ Ошибка сборки!
    pause
    exit /b 1
)

echo.
echo [2/3] Копирование на сервер 213.171.31.215...
echo (Введите пароль: $X11021997x$)
echo.

scp -i vps_new_key -o StrictHostKeyChecking=no -r .next root11@213.171.31.215:/home/root11/invest2026/
if errorlevel 1 (
    echo ❌ Ошибка копирования! Пробуем с паролем...
    echo Вам нужно ввести пароль вручную: $X11021997x$
    scp -r .next root11@213.171.31.215:/home/root11/invest2026/
)

echo.
echo [3/3] Перезапуск приложения...
ssh -i vps_new_key -o StrictHostKeyChecking=no root11@213.171.31.215 "cd /home/root11/invest2026 && pm2 restart investpro"

echo.
echo ========================================
echo ✅ ГОТОВО!
echo ========================================
echo.
echo Проверьте сайт: http://213.171.31.215
echo.
pause
