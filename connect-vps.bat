@echo off
echo Подключение к VPS...
echo.

REM Попробуем разные способы подключения
echo Попытка 1: Стандартное SSH подключение
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root11@45.155.205.43 "echo 'Подключение успешно'"

if not errorlevel 1 goto success

echo.
echo Попытка 2: SSH с отключенными ключами
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no root11@45.155.205.43 "echo 'Подключение успешно'"

if not errorlevel 1 goto success

echo.
echo Попытка 3: SSH с интерактивным вводом
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o PasswordAuthentication=yes root11@45.155.205.43

goto end

:success
echo ✅ Подключение успешно!
goto end

:end
pause