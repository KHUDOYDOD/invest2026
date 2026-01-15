@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set VPS_IP=130.49.213.197
set VPS_USER=root
set VPS_PASSWORD=12345678
set SSH_DIR=%USERPROFILE%\.ssh
set KEY_FILE=%SSH_DIR%\id_rsa_vps

echo ========================================
echo АВТОМАТИЧЕСКАЯ НАСТРОЙКА SSH
echo ========================================
echo.

REM Создаём .ssh директорию
if not exist "%SSH_DIR%" (
    echo [1/4] Создаём .ssh директорию...
    mkdir "%SSH_DIR%"
) else (
    echo [1/4] Директория .ssh существует
)

REM Генерируем ключ
echo [2/4] Генерируем SSH ключ...
if exist "%KEY_FILE%" del /f /q "%KEY_FILE%" >nul 2>&1
if exist "%KEY_FILE%.pub" del /f /q "%KEY_FILE%.pub" >nul 2>&1

ssh-keygen -t rsa -b 4096 -f "%KEY_FILE%" -N "" -q

if errorlevel 1 (
    echo ❌ Ошибка создания ключа
    pause
    exit /b 1
)
echo ✅ Ключ создан

REM Копируем ключ на VPS
echo [3/4] Копируем ключ на VPS...
echo.
echo ВНИМАНИЕ: Сейчас нужно ввести пароль ОДИН РАЗ: 12345678
echo.

type "%KEY_FILE%.pub" | ssh %VPS_USER%@%VPS_IP% "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh && echo 'Ключ добавлен!'"

if errorlevel 1 (
    echo.
    echo ❌ Ошибка копирования ключа
    echo Проверьте пароль и попробуйте снова
    pause
    exit /b 1
)

echo ✅ Ключ скопирован

REM Проверяем подключение
echo [4/4] Проверяем подключение...
ssh -i "%KEY_FILE%" %VPS_USER%@%VPS_IP% "echo 'Подключение без пароля работает!' && hostname"

if errorlevel 1 (
    echo.
    echo ⚠️ Что-то пошло не так
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ ГОТОВО!
echo ========================================
echo.
echo 🎉 Теперь все скрипты работают БЕЗ ПАРОЛЯ!
echo.
echo Можете использовать:
echo   - обновить-сайт.bat
echo   - vps-logs.bat
echo   - vps-connect.bat
echo   - проверить-сайт.bat
echo.
pause
