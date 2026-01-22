@echo off
chcp 65001 >nul
echo ========================================
echo 🔑 ДОБАВЛЕНИЕ SSH КЛЮЧЕЙ НА СЕРВЕР
echo ========================================
echo.
echo Добавим оба ключа на сервер для подключения:
echo.
echo 1. Откройте веб-консоль VPS (root11 / $X11021997x$)
echo 2. Выполните эти команды:
echo.

(
echo # Создание директории для SSH ключей
echo mkdir -p ~/.ssh
echo chmod 700 ~/.ssh
echo.
echo # Добавление ключа Kiro
echo echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDaYvbwt5YFAmopCMWhWnBgrLRbG+GRGMlccRdvONrIR8JqUmv+l7dD8z1R1YjsRp4OJwGQdik8HKtrch2hSTyT9SnsR1Ed0rNEL0eJTaD56Nxhp3CIV5bsD5Ywqy4DQC5ek4h/voHjPItCGIeecRj3mPEpsrjAdWxhQ3iVSs+t0EF2oLhjeLF+flgfzxI/GLcTsbP7t+q2NQ8pRGbxztu2OE61vI8Z5/pt1hMXGkRrvprhASg4pYargFzcqZ4SASXuGq1MZ2KD7ht0L3h0FhP56IufD52lrHvgGGxZd7RgGdvOFh6PkUqlJ6yYyGQBvAgZaUzQTvAKRow4c7GKvgBu0XKzeZ7xSMW0I2Ty4+nmc5DyVkPCPTuiMLttKdRL3bSIfKWJqTiT2GQZzK5fg5mefujUz2ca/aHra98Sa+/SjnisJIAI+rXGchS/5cZU2E0LjKZh8t3RDAfm/3SbvADSYzlQDsf/qP7z4BcJGjF8Uuxjl2dP5TUiFeAi+i5rvvkQc90Fbz3eUfJ9FFHs3SQ6AxqLWSN1qSPDi5Fwog+K84Ld6IC2zijiQlGxcXrOy8rnK9E/9kt6xlrr5K85db2Iiqn3+z5z58u7e9LZTliSntIXMHlIaDD7PGfrAEk/AgFR+inpmCZxdojLKs+TLFL9weuns5rGBfQCH/bd/dOiRw==" ^>^> ~/.ssh/authorized_keys
echo.
echo # Добавление вашего ключа
echo echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6pcBo5Y2V1BJB1e3cf+iYCOelJRkihfYMIaAlbIiC6xXYD8FPGiGZAs74B+GpVpYL0lxuchYpaR1V40PeTJQ1hbal3IbQ+e7Ze4Tuzsm/pnWY5l5vfxgJq6rzb6KbCdHilNWeTpYJShkePaHjEqf0fI3Zrxu0NDPS+/ii0zvdiJ7TxhyMel4MB6LXzSi2XtOYYvDNzM+O9Z7XXfFLW6Yqn/DiwmO1KbqXmVnywOD1La8/aoPevlBxwoliWCBai5oKLlmqxwg9ss4xmOPcetPoezio1yL8ko7GjuDeIncnpU/Wa8xW2E+5T01NKvwJhLeGtYUiRnz+iEkS7he1nyVf" ^>^> ~/.ssh/authorized_keys
echo.
echo # Установка правильных прав доступа
echo chmod 600 ~/.ssh/authorized_keys
echo.
echo # Проверка
echo echo "SSH ключи добавлены!"
echo cat ~/.ssh/authorized_keys
) | clip

echo ✅ Команды скопированы в буфер обмена!
echo.
echo После выполнения команд на сервере:
echo 1. Я смогу подключиться автоматически
echo 2. Вы сможете подключаться со своим ключом
echo 3. Мы установим проект автоматически
echo.
pause