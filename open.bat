@echo off
cd /d "%~dp0"
echo ====================================
echo Exam Schedule Server Starting...
echo ====================================
echo.

REM Stop all existing Node.js servers first
echo [INFO] Stopping existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Start hidden Node.js server
start /min "" wscript.exe "start_hidden.vbs"

REM Wait 3 seconds for server to start
echo [INFO] Waiting for server to start...
timeout /t 3 /nobreak >nul

REM Auto-open browser
start "" "http://localhost:8000/index.html"

echo [OK] Server started in background
echo [OK] Browser will open automatically
echo.
echo Tips:
echo  - Server runs in background (no window)
echo  - Auto-shutdown when all tabs closed
echo.
pause