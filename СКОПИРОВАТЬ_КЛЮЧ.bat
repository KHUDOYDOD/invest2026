@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    📋 КОПИРОВАНИЕ SSH КЛЮЧА
echo ═══════════════════════════════════════════════════════
echo.
echo Публичный ключ будет скопирован в буфер обмена!
echo.
echo После этого вставьте его на VPS сервере.
echo.
pause

type kiro_vps_key.pub | clip

echo.
echo ✅ Ключ скопирован в буфер обмена!
echo.
echo ═══════════════════════════════════════════════════════
echo    ЧТО ДЕЛАТЬ ДАЛЬШЕ:
echo ═══════════════════════════════════════════════════════
echo.
echo 1. Подключитесь к VPS:
echo    ssh root@213.171.31.215
echo.
echo 2. Выполните команды:
echo    mkdir -p ~/.ssh
echo    chmod 700 ~/.ssh
echo    nano ~/.ssh/authorized_keys
echo.
echo 3. Вставьте ключ (Ctrl+V или правая кнопка мыши)
echo.
echo 4. Сохраните файл:
echo    Ctrl+X, затем Y, затем Enter
echo.
echo 5. Установите права:
echo    chmod 600 ~/.ssh/authorized_keys
echo.
echo 6. Напишите мне "готово"
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo Открыть инструкцию? (Y/N)
set /p choice=Ваш выбор: 

if /i "%choice%"=="Y" (
    notepad ЗАГРУЗИТЕ_КЛЮЧ_НА_VPS.md
)

echo.
pause
