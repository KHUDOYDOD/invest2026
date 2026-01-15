@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   АВТОМАТИЧЕСКИЙ ДЕПЛОЙ АДМИНА
echo ========================================
echo.
echo Запускаем PowerShell скрипт...
echo.

powershell -ExecutionPolicy Bypass -File "автоматический-деплой.ps1"

echo.
echo ========================================
echo ГОТОВО!
echo ========================================
echo.
echo Админ панель: http://130.49.213.197/admin
echo.
echo Данные для входа:
echo   Username: Admin
echo   Password: X11021997x
echo.
pause
