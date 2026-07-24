@echo off
REM ============================================================
REM  stop-dev.bat - multi-service dev-mode stopper
REM  Kills processes by port (3000, 5173) rather than by image
REM  name. This catches both the Go backend and the node/bun
REM  dev server regardless of process name.
REM  Usage: double-click
REM ============================================================
cd /d "%~dp0"
title Dev Mode - Stopper

echo ============================================
echo   Development Mode Stopper
echo ============================================
echo.

set "_NET=%TEMP%\_sd_netstat.txt"
set "_PORT=%TEMP%\_sd_port.txt"
set "_LIS=%TEMP%\_sd_listen.txt"

REM Dump full netstat to temp file (avoids pipe deadlock)
netstat -ano > "%_NET%" 2>nul

echo Stopping Go backend (port 3000)...
findstr ":3000 " "%_NET%" > "%_PORT%" 2>nul
findstr "LISTENING" "%_PORT%" > "%_LIS%" 2>nul
for /f "tokens=5" %%a in (%_LIS%) do (
    taskkill /F /PID %%a >nul 2>&1 && echo   killed PID %%a
)

echo Stopping frontend dev server (port 5173)...
findstr ":5173 " "%_NET%" > "%_PORT%" 2>nul
findstr "LISTENING" "%_PORT%" > "%_LIS%" 2>nul
for /f "tokens=5" %%a in (%_LIS%) do (
    taskkill /F /PID %%a >nul 2>&1 && echo   killed PID %%a
)

REM Cleanup temp files
del "%_NET%" "%_PORT%" "%_LIS%" >nul 2>&1

echo.
echo ============================================
echo   All development services stopped.
echo ============================================
echo.
pause
