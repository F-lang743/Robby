#!/bin/bash

# One-button launcher for Robby React Native App (Mac/Linux)
# This script automatically installs dependencies, starts Metro, and launches the app

echo "====================================="
echo "  Robby App Launcher (Mac/Linux)"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "Are you in the correct directory?"
    exit 1
fi

echo "Step 1: Installing dependencies..."
echo "Running: npm install --legacy-peer-deps"
echo ""
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "====================================="
echo "Dependencies installed successfully!"
echo "====================================="
echo ""

# Function to start Metro bundler in a new terminal
start_metro() {
    echo "Step 2: Starting Metro bundler..."
    echo "NOTE: Metro will start in the background. Keep it running."
    echo ""
    
    # Start Metro in a new terminal window (works on macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && npm start"'
    else
        # For Linux, try to use gnome-terminal, xterm, or konsole
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd '$(pwd)' && npm start; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd '$(pwd)' && npm start" &
        elif command -v konsole &> /dev/null; then
            konsole -e "cd '$(pwd)' && npm start" &
        else
            echo "WARNING: Could not open a new terminal window."
            echo "Please run 'npm start' in a separate terminal."
            read -p "Press Enter when Metro is running..."
        fi
    fi
    
    # Wait a few seconds for Metro to start
    sleep 5
}

# Ask user to select platform
echo "Please select your platform:"
echo "  1. iOS"
echo "  2. Android"
echo ""
read -p "Enter your choice (1 or 2): " platform

if [ "$platform" = "1" ]; then
    echo ""
    echo "Selected: iOS"
    echo ""
    start_metro
    
    echo ""
    echo "Step 3: Building and launching iOS app..."
    echo "Running: npm run ios"
    echo ""
    npm run ios
    
elif [ "$platform" = "2" ]; then
    echo ""
    echo "Selected: Android"
    echo ""
    start_metro
    
    echo ""
    echo "Step 3: Building and launching Android app..."
    echo "Running: npm run android"
    echo ""
    npm run android
    
else
    echo ""
    echo "ERROR: Invalid choice! Please enter 1 or 2."
    exit 1
fi

echo ""
echo "====================================="
echo "  App launched successfully!"
echo "====================================="
echo ""
echo "IMPORTANT: Keep the Metro bundler window open."
echo ""
