@echo off
chcp 65001 >nul
echo ========================================
echo 🔑 ДОБАВЛЕНИЕ SSH КЛЮЧА НА СЕРВЕР
echo ========================================
echo.
echo Чтобы я мог подключиться к серверу автоматически,
echo добавьте мой публичный ключ на сервер.
echo.
echo 1. Откройте веб-консоль VPS (root11 / $X11021997x$)
echo 2. Выполните эти команды:
echo.

echo mkdir -p ~/.ssh
echo chmod 700 ~/.ssh
echo echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDaYvbwt5YFAmopCMWhWnBgrLRbG+GRGMlccRdvONrIR8JqUmv+l7dD8z1R1YjsRp4OJwGQdik8HKtrch2hSTyT9SnsR1Ed0rNEL0eJTaD56Nxhp3CIV5bsD5Ywqy4DQC5ek4h/voHjPItCGIeecRj3mPEpsrjAdWxhQ3iVSs+t0EF2oLhjeLF+flgfzxI/GLcTsbP7t+q2NQ8pRGbxztu2OE61vI8Z5/pt1hMXGkRrvprhASg4pYargFzcqZ4SASXuGq1MZ2KD7ht0L3h0FhP56IufD52lrHvgGGxZd7RgGdvOFh6PkUqlJ6yYyGQBvAgZaUzQTvAKRow4c7GKvgBu0XKzeZ7xSMW0I2Ty4+nmc5DyVkPCPTuiMLttKdRL3bSIfKWJqTiT2GQZzK5fg5mefujUz2ca/aHra98Sa+/SjnisJIAI+rXGchS/5cZU2E0LjKZh8t3RDAfm/3SbvADSYzlQDsf/qP7z4BcJGjF8Uuxjl2dP5TUiFeAi+i5rvvkQc90Fbz3eUfJ9FFHs3SQ6AxqLWSN1qSPDi5Fwog+K84Ld6IC2zijiQlGxcXrOy8rnK9E/9kt6xlrr5K85db2Iiqn3+z5z58u7e9LZTliSntIXMHlIaDD7PGfrAEk/AgFR+inpmCZxdojLKs+TLFL9weuns5rGBfQCH/bd/dOiRw==" ^>^> ~/.ssh/authorized_keys
echo chmod 600 ~/.ssh/authorized_keys
echo echo "SSH ключ добавлен! Теперь Kiro может подключиться автоматически."
echo.

echo ========================================
echo 📋 КОМАНДЫ ДЛЯ КОПИРОВАНИЯ
echo ========================================

(
echo mkdir -p ~/.ssh
echo chmod 700 ~/.ssh
echo echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDaYvbwt5YFAmopCMWhWnBgrLRbG+GRGMlccRdvONrIR8JqUmv+l7dD8z1R1YjsRp4OJwGQdik8HKtrch2hSTyT9SnsR1Ed0rNEL0eJTaD56Nxhp3CIV5bsD5Ywqy4DQC5ek4h/voHjPItCGIeecRj3mPEpsrjAdWxhQ3iVSs+t0EF2oLhjeLF+flgfzxI/GLcTsbP7t+q2NQ8pRGbxztu2OE61vI8Z5/pt1hMXGkRrvprhASg4pYargFzcqZ4SASXuGq1MZ2KD7ht0L3h0FhP56IufD52lrHvgGGxZd7RgGdvOFh6PkUqlJ6yYyGQBvAgZaUzQTvAKRow4c7GKvgBu0XKzeZ7xSMW0I2Ty4+nmc5DyVkPCPTuiMLttKdRL3bSIfKWJqTiT2GQZzK5fg5mefujUz2ca/aHra98Sa+/SjnisJIAI+rXGchS/5cZU2E0LjKZh8t3RDAfm/3SbvADSYzlQDsf/qP7z4BcJGjF8Uuxjl2dP5TUiFeAi+i5rvvkQc90Fbz3eUfJ9FFHs3SQ6AxqLWSN1qSPDi5Fwog+K84Ld6IC2zijiQlGxcXrOy8rnK9E/9kt6xlrr5K85db2Iiqn3+z5z58u7e9LZTliSntIXMHlIaDD7PGfrAEk/AgFR+inpmCZxdojLKs+TLFL9weuns5rGBfQCH/bd/dOiRw==" ^>^> ~/.ssh/authorized_keys
echo chmod 600 ~/.ssh/authorized_keys
echo echo "SSH ключ добавлен!"
) | clip

echo ✅ Команды скопированы в буфер обмена!
echo.
echo После выполнения этих команд на сервере,
echo я смогу подключиться автоматически и установить проект.
echo.
pause