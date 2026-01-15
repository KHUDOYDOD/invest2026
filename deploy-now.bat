@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ НА VPS
echo ========================================
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

echo [1/3] Удаление старой .next на VPS...
echo 12345678 | plink -batch -pw 12345678 root@130.49.213.197 "rm -rf /root/invest2026/.next"

echo.
echo [2/3] Копирование новой .next на VPS...
echo Это может занять 1-2 минуты...
pscp -batch -pw 12345678 -r .next root@130.49.213.197:/root/invest2026/

if errorlevel 1 (
    echo.
    echo ❌ Ошибка при копировании!
    echo.
    echo РЕШЕНИЕ:
    echo 1. Скачайте WinSCP: https://winscp.net/eng/download.php
    echo 2. Подключитесь к VPS (130.49.213.197, root, 12345678)
    echo 3. Удалите папку /root/invest2026/.next
    echo 4. Загрузите папку .next с компьютера
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Перезапуск приложения...
echo 12345678 | plink -batch -pw 12345678 root@130.49.213.197 "cd /root/invest2026 && pm2 restart investpro"

echo.
echo Ждем 3 секунды...
timeout /t 3 /nobreak >nul

echo.
echo Проверка статуса...
echo 12345678 | plink -batch -pw 12345678 root@130.49.213.197 "pm2 status"

echo.
echo ========================================
echo ✅ ГОТОВО! Сайт обновлен
echo ========================================
echo.
echo 🌐 Откройте: http://130.49.213.197/dashboard/investments
echo.
echo Попробуйте создать инвестицию - должно работать!
echo.
pause
