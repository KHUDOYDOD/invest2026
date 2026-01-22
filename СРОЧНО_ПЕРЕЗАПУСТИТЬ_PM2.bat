@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 СРОЧНЫЙ ПЕРЕЗАПУСК PM2
echo ========================================
echo.

echo Подключаемся к VPS и перезапускаем PM2...
echo Пароль: 12345678
echo.

REM Создаем временный файл с командами
echo cd /root/invest2026 > temp_commands.txt
echo pm2 status >> temp_commands.txt
echo pm2 restart investpro ^|^| NODE_OPTIONS='--max-old-space-size=768' pm2 start npm --name investpro --max-memory-restart 800M -- start >> temp_commands.txt
echo pm2 status >> temp_commands.txt
echo pm2 logs investpro --lines 10 >> temp_commands.txt

REM Выполняем команды
type temp_commands.txt | ssh root@130.49.213.197

REM Удаляем временный файл
del temp_commands.txt

echo.
echo ========================================
echo ✅ КОМАНДЫ ОТПРАВЛЕНЫ
echo ========================================
echo.
echo Проверьте сайт: http://130.49.213.197
echo.
pause