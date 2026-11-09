@echo off
cd /d "%~dp0"
echo ==============================================
echo        Starting YouTube Clone
echo ==============================================
echo.

if not exist ".next" (
    echo [1/2] Building production bundle...
    call node node_modules\next\dist\bin\next build --webpack
    if errorlevel 1 (
        echo [ERROR] Build failed.
        pause
        exit /b %errorlevel%
    )
)

echo [2/2] Launching server on http://localhost:3000 ...
start http://localhost:3000
node server.js
