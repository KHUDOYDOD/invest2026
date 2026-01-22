@echo off
chcp 65001 >nul
echo ========================================
echo 🔌 ПОДКЛЮЧЕНИЕ К VPS
echo ========================================
echo.
echo IP: 130.49.213.197
echo User: root
echo Password: 12345678
echo.
echo После подключения выполните:
echo.
echo   cd /root/invest2026
echo   git pull origin main
echo   npm run build
echo   pm2 restart investpro
echo   pm2 status
echo.
echo ========================================
echo.
pause
ssh root@130.49.213.197
