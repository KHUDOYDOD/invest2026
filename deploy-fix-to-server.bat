@echo off
echo 🚀 Обновляем код на сервере и исправляем API...

echo 📤 Копируем обновленные файлы на сервер...
scp -i vps_new_key .env.production root11@213.171.31.215:/home/root11/invest2026/
scp -i vps_new_key app/api/statistics/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/statistics/
scp -i vps_new_key app/api/investment-plans/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/investment-plans/
scp -i vps_new_key app/api/testimonials/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/testimonials/
scp -i vps_new_key app/api/user-activity/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/user-activity/
scp -i vps_new_key app/api/new-users/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/new-users/
scp -i vps_new_key app/api/investments/create/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/investments/create/
scp -i vps_new_key app/api/login/route.ts root11@213.171.31.215:/home/root11/invest2026/app/api/login/
scp -i vps_new_key server/db.ts root11@213.171.31.215:/home/root11/invest2026/server/
scp -i vps_new_key lib/database.ts root11@213.171.31.215:/home/root11/invest2026/lib/

echo 🔄 Перезапускаем приложение на сервере...
ssh -i vps_new_key root11@213.171.31.215 "cd /home/root11/invest2026 && pm2 restart investpro"

echo ✅ Обновление завершено!
echo 🌐 Проверьте сайт: http://213.171.31.215

pause