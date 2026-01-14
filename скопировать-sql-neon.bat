@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   КОПИРОВАНИЕ SQL ДЛЯ NEON В БУФЕР ОБМЕНА
echo ═══════════════════════════════════════════════════════════
echo.

type neon-database-setup.sql | clip

echo ✅ SQL скопирован в буфер обмена!
echo.
echo Теперь:
echo 1. Откройте https://console.neon.tech
echo 2. Создайте проект: invest2026
echo 3. Регион: Europe (Frankfurt)
echo 4. Откройте SQL Editor
echo 5. Нажмите Ctrl+V чтобы вставить SQL
echo 6. Нажмите "Run" для выполнения
echo.
echo После выполнения скопируйте Connection String
echo.
pause
