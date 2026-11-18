@echo off
chcp 65001 >nul
setlocal
set SCRIPT=%~dp0restore-next-install.ps1
echo 正在请求管理员权限以还原 DSH NEXT ...
powershell -NoProfile -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','%SCRIPT%'"
endlocal
