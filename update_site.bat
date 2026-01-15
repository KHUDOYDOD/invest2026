@echo off
chcp 65001 >nul
echo ========================================
echo   ОБНОВЛЕНИЕ САЙТА НА VPS
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0update_site.ps1"

pause
