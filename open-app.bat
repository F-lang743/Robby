@echo off
REM One-button launcher for Robby React Native App (Windows)
REM This script automatically installs dependencies, starts Metro, and launches the app

echo =====================================
echo   Robby App Launcher (Windows)
echo =====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Are you in the correct directory?
    pause
    exit /b 1
)

echo Step 1: Installing dependencies...
echo Running: npm install --legacy-peer-deps
echo.
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo =====================================
echo Dependencies installed successfully!
echo =====================================
echo.

REM Ask user to select platform
echo Please select your platform:
echo   1. iOS
echo   2. Android
echo.
set /p platform="Enter your choice (1 or 2): "

echo.
echo Step 2: Starting Metro bundler...
echo NOTE: Metro will start in a new window. Keep it running.
echo.
start "Metro Bundler" cmd /k "npm start"

REM Wait a few seconds for Metro to start
timeout /t 5 /nobreak >nul

if "%platform%"=="1" (
    echo.
    echo Selected: iOS
    echo.
    echo Step 3: Building and launching iOS app...
    echo Running: npm run ios
    echo.
    call npm run ios
    
) else if "%platform%"=="2" (
    echo.
    echo Selected: Android
    echo.
    echo Step 3: Building and launching Android app...
    echo Running: npm run android
    echo.
    call npm run android
    
) else (
    echo.
    echo ERROR: Invalid choice! Please enter 1 or 2.
    pause
    exit /b 1
)

echo.
echo =====================================
echo   App launched successfully!
echo =====================================
echo.
echo IMPORTANT: Keep the Metro bundler window open.
echo You can close this window now.
echo.
pause
