@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🎯 ОБНОВЛЕНИЕ VPS СЕРВЕРА
echo ═══════════════════════════════════════════════════════
echo.
echo Я не могу подключиться к серверу автоматически,
echo потому что нужен пароль.
echo.
echo Но я создал скрипт, который ВЫ можете запустить!
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo Выберите способ:
echo.
echo [1] Автоматическое обновление (рекомендуется)
echo [2] Обновление через PowerShell
echo [3] Показать команды для ручного обновления
echo [4] Выход
echo.
echo ═══════════════════════════════════════════════════════
echo.

set /p choice="Ваш выбор (1-4): "

if "%choice%"=="1" (
    cls
    echo.
    echo Запускаем автоматическое обновление...
    echo.
    call ОБНОВИТЬ_VPS_ПРЯМО_СЕЙЧАС.bat
    goto end
)

if "%choice%"=="2" (
    cls
    echo.
    echo Запускаем PowerShell скрипт...
    echo.
    powershell -ExecutionPolicy Bypass -File обновить-vps-powershell.ps1
    goto end
)

if "%choice%"=="3" (
    cls
    type КОМАНДЫ_ДЛЯ_VPS_ОБНОВЛЕНИЯ.txt
    echo.
    pause
    goto end
)

:end
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo После обновления:
echo.
echo 1. Откройте: http://213.171.31.215
echo 2. Очистите кэш: Ctrl + Shift + Delete
echo 3. Или откройте в инкогнито: Ctrl + Shift + N
echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
