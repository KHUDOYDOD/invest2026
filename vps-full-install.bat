@echo off
chcp 65001 >nul
cls
echo ========================================
echo УСТАНОВКА НА НОВЫЙ VPS
echo ========================================
echo.
echo [1/6] Установка Node.js...
ssh root@130.49.213.197 "curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs"

echo.
echo [2/6] Установка PM2, Nginx, Git...
ssh root@130.49.213.197 "npm install -g pm2 && apt install -y nginx git"

echo.
echo [3/6] Клонирование проекта...
ssh root@130.49.213.197 "cd /root && git clone https://github.com/KHUDOYDOD/invest2026.git"

echo.
echo [4/6] Создание .env файла...
ssh root@130.49.213.197 "cd /root/invest2026 && echo 'DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' > .env.production && echo 'NEXTAUTH_SECRET='$(openssl rand -base64 32) >> .env.production && echo 'NEXTAUTH_URL=http://130.49.213.197' >> .env.production && echo 'NODE_ENV=production' >> .env.production"

echo.
echo [5/6] Установка зависимостей...
ssh root@130.49.213.197 "cd /root/invest2026 && npm install --production"

echo.
echo Теперь нужно скопировать .next с вашего компьютера...
echo.
pause
