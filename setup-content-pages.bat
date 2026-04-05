@echo off
echo ========================================
echo Создание таблиц для страниц контента
echo ========================================
echo.

node scripts/create-pages-tables.js

echo.
echo ========================================
echo Готово!
echo ========================================
echo.
echo Теперь вы можете:
echo 1. Открыть /admin/content-management для управления
echo 2. Посетить страницы: /team /careers /contacts /terms /privacy /about /blog
echo.
pause
