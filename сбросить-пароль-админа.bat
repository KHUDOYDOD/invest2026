@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   СБРОС ПАРОЛЯ АДМИНА
echo ========================================
echo.
echo Сбрасываем пароль для admin@example.com
echo Новый пароль: X11021997x
echo.
pause

node reset-admin-password-neon.js

echo.
echo ========================================
echo ГОТОВО!
echo ========================================
echo.
echo Данные для входа:
echo   Login:    admin
echo   Password: X11021997x
echo.
echo Админ панель:
echo   http://130.49.213.197/admin
echo.
pause
