@echo off
cd /d "%~dp0"
echo ==============================================
echo   Starting YouTube Clone (Development Mode)
echo ==============================================
echo.

echo [1/2] Clearing any stuck processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/2] Starting Next.js development server on http://localhost:3000 ...
echo [INFO] Please wait a moment until "Ready" appears.
echo.
start http://localhost:3000
call node node_modules\next\dist\bin\next dev --webpack -p 3000
