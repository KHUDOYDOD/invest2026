@echo off
chcp 65001 >nul
echo ========================================
echo   НАСТРОЙКА SSH КЛЮЧА (БЕЗ ПАРОЛЯ)
echo ========================================
echo.
echo Этот скрипт настроит SSH ключ для подключения без пароля
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0setup-ssh-key.ps1"

pause
