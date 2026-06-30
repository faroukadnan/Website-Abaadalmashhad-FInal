@echo off
set "SCRIPT_DIR=%~dp0"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
copy /Y "%SCRIPT_DIR%start-website-autostart.bat" "%STARTUP_DIR%\Abaad Al Mashhad Server.bat" >nul
echo.
echo Done. The website server will start automatically when Windows starts.
echo.
echo Computer URL: http://localhost:3000/index.html
echo Phone URL 1:  http://DESKTOP-Farouk2025:3000/index.html
echo Phone URL 2:  http://192.168.0.211:3000/index.html
echo.
pause
