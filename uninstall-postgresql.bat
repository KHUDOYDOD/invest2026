@echo off
echo ========================================
echo   Удаление PostgreSQL
echo ========================================
echo.

echo ВНИМАНИЕ: Этот скрипт удалит PostgreSQL полностью!
echo Все данные будут потеряны!
echo.
pause

echo Остановка службы PostgreSQL...
net stop postgresql-X64-18

echo Удаление службы PostgreSQL...
sc delete postgresql-X64-18

echo Удаление папки PostgreSQL...
rmdir /s /q "C:\Program Files\PostgreSQL"

echo Очистка реестра...
reg delete "HKLM\SOFTWARE\PostgreSQL" /f 2>nul
reg delete "HKLM\SOFTWARE\Wow6432Node\PostgreSQL" /f 2>nul

echo.
echo PostgreSQL удален!
echo Теперь можете установить новую версию с https://www.postgresql.org/download/windows/
echo.
pause