@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   ЗАГРУЗКА С ПАРОЛЕМ
echo ========================================
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

echo [1/3] Создание архива...
if exist next.tar.gz del /f /q next.tar.gz
tar -czf next.tar.gz .next
echo [OK] Архив создан
echo.

echo [2/3] Загрузка на VPS...
echo Используйте пароль: 12345678
echo.
pscp -pw 12345678 next.tar.gz root@130.49.213.197:/root/invest2026/
echo.

if errorlevel 1 (
    echo.
    echo ❌ Ошибка! Попробуйте вручную:
    echo.
    echo 1. Скачайте WinSCP: https://winscp.net/eng/download.php
    echo 2. Подключитесь к 130.49.213.197 (root / 12345678)
    echo 3. Загрузите папку .next в /root/invest2026/
    echo 4. Выполните: pm2 restart investpro
    echo.
    pause
    exit /b 1
)

echo [3/3] Распаковка и перезапуск...
plink -pw 12345678 root@130.49.213.197 "cd /root/invest2026 && rm -rf .next && tar -xzf next.tar.gz && rm next.tar.gz && pm2 restart investpro"
echo.

echo ========================================
echo   ГОТОВО!
echo ========================================
echo.
echo Проверьте: http://130.49.213.197/dashboard/investments
echo.

if exist next.tar.gz del /f /q next.tar.gz

pause
