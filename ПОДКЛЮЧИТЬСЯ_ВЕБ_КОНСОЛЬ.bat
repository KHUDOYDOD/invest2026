@echo off
chcp 65001 >nul
echo ========================================
echo 🌐 ПОДКЛЮЧЕНИЕ ЧЕРЕЗ ВЕБ-КОНСОЛЬ
echo ========================================
echo.
echo Поскольку SSH требует специальный ключ,
echo используйте веб-консоль VPS:
echo.
echo 1. Откройте панель управления 4VPS
echo 2. Найдите сервер 213.171.31.215
echo 3. Нажмите "Консоль" или "Console"
echo 4. Войдите как root11 с паролем: $X11021997x$
echo.
echo ========================================
echo 📋 КОМАНДЫ ДЛЯ ВЫПОЛНЕНИЯ
echo ========================================
echo.
echo Скопируйте и выполните эти команды:
echo.

echo # Быстрая установка проекта
echo cd /root
echo wget -O install.sh https://raw.githubusercontent.com/KHUDOYDOD/invest2026/main/vps-auto-install-new.sh
echo chmod +x install.sh
echo ./install.sh

echo.
echo ИЛИ выполните команды вручную:
echo.

echo # 1. Обновление системы
echo apt update ^&^& apt upgrade -y
echo.

echo # 2. Установка Node.js
echo curl -fsSL https://deb.nodesource.com/setup_20.x ^| sudo -E bash -
echo apt-get install -y nodejs
echo.

echo # 3. Установка зависимостей
echo npm install -g pm2
echo apt-get install -y nginx git
echo.

echo # 4. Клонирование проекта
echo cd /root
echo git clone https://github.com/KHUDOYDOD/invest2026.git
echo cd invest2026
echo.

echo # 5. Установка зависимостей
echo npm install
echo.

echo # 6. Создание .env
echo cat ^> .env.production ^<^< 'EOF'
echo DATABASE_URL=postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-2026
echo NEXTAUTH_URL=http://213.171.31.215
echo JWT_SECRET=your-jwt-secret-key-here-change-this-in-production-2026
echo NODE_ENV=production
echo EOF
echo.

echo # 7. Сборка и запуск
echo npm run build
echo pm2 start npm --name investpro -- start
echo.

echo ========================================
echo ✅ ПОСЛЕ УСТАНОВКИ
echo ========================================
echo.
echo Сайт будет доступен:
echo 🌐 http://213.171.31.215
echo 🔧 http://213.171.31.215/admin/dashboard
echo.
echo Логин: admin
echo Пароль: X11021997x
echo.
pause