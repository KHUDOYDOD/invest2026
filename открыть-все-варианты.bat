@echo off
chcp 65001 >nul
echo ========================================
echo 🌐 ОТКРЫТИЕ ВСЕХ ВАРИАНТОВ ХОСТИНГА
echo ========================================
echo.

echo 🚀 Вариант 1: Cloudflare Pages (РЕКОМЕНДУЕТСЯ)
echo - Бесплатно навсегда
echo - Автоматические обновления
echo - Глобальная CDN
start https://pages.cloudflare.com

timeout /t 3 /nobreak >nul

echo.
echo 🚀 Вариант 2: Netlify
echo - Простой drag & drop
echo - Быстрый деплой
start https://netlify.com

timeout /t 3 /nobreak >nul

echo.
echo 🚀 Вариант 3: Vercel
echo - Оптимизирован для Next.js
echo - Автоматический деплой
start https://vercel.com

timeout /t 3 /nobreak >nul

echo.
echo 🚀 Вариант 4: GitHub репозиторий
echo - Исходный код проекта
start https://github.com/KHUDOYDOD/invest2026

echo.
echo 💡 РЕКОМЕНДАЦИЯ:
echo Используйте Cloudflare Pages - это самый надежный вариант!
echo.
echo 📋 Инструкция:
echo 1. Выберите Cloudflare Pages
echo 2. Подключите GitHub репозиторий
echo 3. Добавьте переменные окружения
echo 4. Нажмите Deploy
echo.
pause