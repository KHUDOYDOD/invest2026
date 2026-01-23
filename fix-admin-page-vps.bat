@echo off
echo Connecting to VPS and updating admin panel...

ssh -i vps_new_key -o StrictHostKeyChecking=no root11@213.171.31.215 "cd /root/investpro && npm run build && pm2 restart all"

echo Admin panel updated!
pause