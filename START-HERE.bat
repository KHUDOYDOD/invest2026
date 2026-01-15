@echo off
cls
echo.
echo ========================================================
echo.
echo     SSH WITHOUT PASSWORD - AUTO SETUP
echo.
echo ========================================================
echo.
echo.
echo What will happen:
echo    1. Create SSH key
echo    2. You enter password ONE TIME: 12345678
echo    3. Done! No more password needed!
echo.
echo.
echo Takes 30 seconds
echo.
echo.
pause

REM Run setup
call setup-ssh-simple.bat

echo.
echo.
echo ========================================================
echo.
echo     DONE!
echo.
echo     Now all commands work WITHOUT PASSWORD:
echo.
echo     - obnovit-sayt.bat
echo     - vps-logs.bat
echo     - vps-connect.bat
echo     - proverit-sayt.bat
echo.
echo ========================================================
echo.
echo.
pause
