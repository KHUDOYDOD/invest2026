@echo off
chcp 65001 >nul
echo ========================================
echo 🔗 ТЕСТ ПОДКЛЮЧЕНИЯ К НОВОМУ VPS
echo ========================================
echo.

REM Сохраняем SSH ключ во временный файл
set TEMP_KEY=%TEMP%\temp_ssh_key
echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDlrPioUIApFWh0Q4ar9aBR1ZLxnMSQ9KgGnDTJCeUJetKpGMDyYncDmy74MhPdqGaaVX580q+drm82yRhJfEaDXbLft2tlRc+gnAetiOgZaZFT9weaIWvlzr/KzZEIxjOd/hEaYiKIqr2pfBGaYl4EY9tYeCzPqhDVsYHBcO7+lA5kTHHLVZhjdNKKkq5DfwSIytdBcKCjv+uXevIBoN7yvhuc1hXUpM/KkIgvhnPayijZRrsE3kReyobaA+VEgNjajLg3tVWdtuJiuKpT60JP0GNiaMydBa5RygdwMgTPGPzU4nYiPRTYSB41cf2/DrR2RilmKImZTj3q6US53rMf > "%TEMP_KEY%"

echo IP: 45.155.205.43
echo Логин: root11
echo.
echo Тестируем подключение...

ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root11@45.155.205.43 "echo 'SSH подключение работает!' && whoami && uname -a"

if errorlevel 1 (
    echo.
    echo ❌ Подключение не удалось!
    echo Возможные причины:
    echo 1. SSH ключ не добавлен на сервер
    echo 2. Сервер недоступен
    echo 3. Неправильные данные для входа
) else (
    echo.
    echo ✅ Подключение успешно!
)

del "%TEMP_KEY%" 2>nul
echo.
pause