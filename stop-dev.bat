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

REM Write netstat output to a temp file first to avoid pipe-deadlock
REM in for /f when there are many connections.
set "TMPNET=%TEMP%\stop-dev-netstat.txt"
netstat -ano > "%TMPNET%" 2>nul

echo Stopping Go backend (port 3000)...
for /f "tokens=5" %%a in ('"%SystemRoot%\System32\findstr.exe" ":3000 " "%TMPNET%" ^| "%SystemRoot%\System32\findstr.exe" "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1 && echo   killed PID %%a
)

echo Stopping frontend dev server (port 5173)...
for /f "tokens=5" %%a in ('"%SystemRoot%\System32\findstr.exe" ":5173 " "%TMPNET%" ^| "%SystemRoot%\System32\findstr.exe" "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1 && echo   killed PID %%a
)

del "%TMPNET%" >nul 2>&1

echo.
echo ============================================
echo   All development services stopped.
echo ============================================
echo.
pause
