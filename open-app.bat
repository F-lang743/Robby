@echo off
REM Robby App - One-Button Launcher for Windows
REM Just double-click this file or run: open-app.bat

echo ================================================================
echo   🚛 ROBBY TRUCK ASSISTANT - ONE-BUTTON LAUNCHER 🎤
echo ================================================================
echo.

cd /d "%~dp0"

REM Step 1: Check and install dependencies
echo 📦 Step 1: Checking dependencies...
if not exist "node_modules\" (
    echo    Installing dependencies (this takes ~2 minutes)...
    call npm install --legacy-peer-deps
    echo    ✅ Dependencies installed!
) else (
    echo    ✅ Dependencies already installed!
)
echo.

REM Step 2: Start Metro bundler
echo 🚀 Step 2: Starting Metro bundler...
echo    Starting Metro in background...
start /B npm start > nul 2>&1
timeout /t 10 /nobreak > nul
echo    ✅ Metro bundler started!
echo.

REM Step 3: Choose platform
echo 📱 Step 3: Choose your platform:
echo    1) Android (requires Android Studio + Emulator/Device)
echo    2) Just keep Metro running (I'll launch manually)
echo.
set /p choice="Enter choice (1 or 2): "
echo.

if "%choice%"=="1" (
    echo 🤖 Launching Android app...
    echo    Make sure Android emulator is running or device is connected!
    call npm run android
) else (
    echo ✅ Metro bundler is running on port 8081
    echo.
    echo To launch the app, open a NEW command prompt and run:
    echo    cd %~dp0
    echo    npm run android
    echo.
    echo Press Ctrl+C to stop Metro when done.
    pause
)

echo.
echo ================================================================
echo   🎉 DONE! 🎉
echo ================================================================
pause
