@echo off
echo 🚨 БЫСТРОЕ ИСПРАВЛЕНИЕ ОШИБКИ 500
echo.

echo 1️⃣ Подключаемся к серверу...
ssh -i vps_new_key -o StrictHostKeyChecking=no root11@213.171.31.215 "cd /home/root11/invest2026 && pm2 logs --lines 10"

echo.
echo 2️⃣ Перезапускаем сервер...
ssh -i vps_new_key -o StrictHostKeyChecking=no root11@213.171.31.215 "cd /home/root11/invest2026 && pm2 restart all"

echo.
echo 3️⃣ Проверяем статус...
ssh -i vps_new_key -o StrictHostKeyChecking=no root11@213.171.31.215 "cd /home/root11/invest2026 && pm2 status"

echo.
echo 4️⃣ Тестируем сайт...
ssh -i vps_new_key -o StrictHostKeyChecking=no root11@213.171.31.215 "curl -I http://localhost:3000"

echo.
echo ✅ Готово! Проверьте сайт: http://213.171.31.215
pause