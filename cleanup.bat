@echo off
echo 正在清理殘留進程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cmd.exe >nul 2>&1
echo 清理完成！
timeout /t 1 /nobreak >nul