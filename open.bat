@echo off
cd /d "%~dp0"

REM 停止舊的 Node.js 進程
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM 啟動隱藏的 Node.js 伺服器
start /min "" wscript.exe "start_hidden.vbs"

REM 等待伺服器啟動
timeout /t 3 /nobreak >nul

REM 自動開啟瀏覽器
start "" "http://localhost:8000/index.html"
