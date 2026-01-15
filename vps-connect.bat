@echo off
chcp 65001 >nul
echo ========================================
echo ПОДКЛЮЧЕНИЕ К VPS
echo ========================================
echo.
echo IP: 130.49.213.197
echo.

REM Проверяем наличие SSH ключа
if exist "%USERPROFILE%\.ssh\id_rsa_vps" (
    echo Подключаемся с SSH ключом (без пароля)...
    ssh -i "%USERPROFILE%\.ssh\id_rsa_vps" root@130.49.213.197
) else (
    echo Введите пароль когда попросит...
    echo.
    echo Совет: Запустите setup-ssh-key.bat для подключения без пароля!
    echo.
    ssh root@130.49.213.197
)

pause
