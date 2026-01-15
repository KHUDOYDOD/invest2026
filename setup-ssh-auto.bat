@echo off
chcp 65001 >nul
echo ========================================
echo АВТОМАТИЧЕСКАЯ НАСТРОЙКА SSH
echo ========================================
echo.
echo Запускаем автоматическую настройку...
echo.

powershell -ExecutionPolicy Bypass -File setup-ssh-auto.ps1

pause
