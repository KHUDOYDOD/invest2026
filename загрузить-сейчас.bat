@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   ЗАГРУЗКА ИСПРАВЛЕНИЯ НА VPS
echo ========================================
echo.

cd C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main

REM Проверяем SSH ключ
set SSH_KEY=%USERPROFILE%\.ssh\id_rsa_vps
if exist "%SSH_KEY%" (
    echo [OK] SSH ключ найден
    set SSH_CMD=ssh -i "%SSH_KEY%"
    set SCP_CMD=scp -i "%SSH_KEY%"
) else (
    echo [!] SSH ключ не найден
    set SSH_CMD=ssh
    set SCP_CMD=scp
)

echo.
echo [1/5] Создание архива...
if exist next.tar.gz del /f /q next.tar.gz
tar -czf next.tar.gz .next
echo [OK] Архив создан

echo.
echo [2/5] Удаление старой версии на VPS...
%SSH_CMD% root@130.49.213.197 "rm -rf /root/invest2026/.next /root/invest2026/next.tar.gz"
echo [OK] Удалено

echo.
echo [3/5] Загрузка архива на VPS...
%SCP_CMD% next.tar.gz root@130.49.213.197:/root/invest2026/
echo [OK] Загружено

echo.
echo [4/5] Распаковка на VPS...
%SSH_CMD% root@130.49.213.197 "cd /root/invest2026 && tar -xzf next.tar.gz && rm next.tar.gz"
echo [OK] Распаковано

echo.
echo [5/5] Перезапуск приложения...
%SSH_CMD% root@130.49.213.197 "cd /root/invest2026 && pm2 restart investpro"
echo [OK] Перезапущено

echo.
echo Ждем 3 секунды...
timeout /t 3 /nobreak >nul

echo.
echo Проверка статуса...
%SSH_CMD% root@130.49.213.197 "pm2 status"

echo.
echo ========================================
echo   ГОТОВО! ИСПРАВЛЕНИЕ ЗАГРУЖЕНО
echo ========================================
echo.
echo Теперь попробуйте создать инвестицию
echo http://130.49.213.197
echo.

REM Удаляем локальный архив
if exist next.tar.gz del /f /q next.tar.gz

pause
