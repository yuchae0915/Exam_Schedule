Set WshShell = CreateObject("WScript.Shell")
' 使用 /C 參數確保命令執行完畢後關閉視窗
' 0 = 隱藏視窗, True = 等待程序結束
WshShell.Run "cmd /C cd /d """ & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & """ && node server.js", 0, False
Set WshShell = Nothing
