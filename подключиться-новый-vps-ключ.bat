@echo off
chcp 65001 >nul
echo ========================================
echo 🔗 ПОДКЛЮЧЕНИЕ К НОВОМУ VPS ПО КЛЮЧУ
echo ========================================
echo.

set SSH_KEY_PATH=%USERPROFILE%\.ssh\id_rsa_new_vps

if not exist "%SSH_KEY_PATH%" (
    echo ❌ SSH ключ не найден!
    echo Сначала запустите: создать-ключ-новый-vps.bat
    pause
    exit /b 1
)

echo IP: 45.155.205.43
echo Логин: root11
echo Ключ: %SSH_KEY_PATH%
echo.
echo Подключаемся...
echo.

ssh -i "%SSH_KEY_PATH%" root11@45.155.205.43

echo.
echo Соединение закрыто.
pause