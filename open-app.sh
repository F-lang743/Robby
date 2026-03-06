#!/bin/bash

# 🚛 Robby App - One-Button Launcher
# Just run: ./open-app.sh

set -e

echo "════════════════════════════════════════════════════════"
echo "  🚛 ROBBY TRUCK ASSISTANT - ONE-BUTTON LAUNCHER 🎤"
echo "════════════════════════════════════════════════════════"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Step 1: Check and install dependencies
echo "📦 Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies (this takes ~2 minutes)..."
    npm install --legacy-peer-deps --silent
    echo "   ✅ Dependencies installed!"
else
    echo "   ✅ Dependencies already installed!"
fi
echo ""

# Step 2: Start Metro bundler in background
echo "🚀 Step 2: Starting Metro bundler..."

# Kill any existing Metro process
if lsof -ti:8081 > /dev/null 2>&1; then
    echo "   Stopping existing Metro..."
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start Metro in background
echo "   Starting Metro bundler..."
npm start > /tmp/metro.log 2>&1 &
METRO_PID=$!
echo "   Metro starting (PID: $METRO_PID)..."

# Wait for Metro to be ready
echo "   Waiting for Metro to be ready..."
for i in {1..30}; do
    if lsof -ti:8081 > /dev/null 2>&1; then
        echo "   ✅ Metro bundler is ready!"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Step 3: Detect platform and launch app
echo "📱 Step 3: Launching app..."
echo ""
echo "Choose your platform:"
echo "  1) iOS (requires macOS + Xcode)"
echo "  2) Android (requires Android Studio + Emulator/Device)"
echo "  3) Just keep Metro running (I'll launch manually)"
echo ""
read -p "Enter choice (1, 2, or 3): " choice
echo ""

case $choice in
    1)
        echo "🍎 Launching iOS app..."
        # Check if on macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # Install pods if needed
            if [ ! -d "ios/Pods" ]; then
                echo "   Installing iOS pods..."
                cd ios && pod install && cd ..
            fi
            echo "   Building and launching iOS app..."
            npm run ios
        else
            echo "   ⚠️  iOS requires macOS. Metro is running on port 8081."
            echo "   You can run 'npm run ios' on a Mac to see the app."
        fi
        ;;
    2)
        echo "🤖 Launching Android app..."
        echo "   Make sure you have:"
        echo "   - Android Studio installed"
        echo "   - An emulator running OR device connected"
        echo ""
        echo "   Building and launching Android app..."
        npm run android
        ;;
    3)
        echo "✅ Metro bundler is running on port 8081"
        echo ""
        echo "To launch the app, open a NEW terminal and run:"
        echo "   cd $SCRIPT_DIR"
        echo "   npm run ios      # For iOS"
        echo "   npm run android  # For Android"
        echo ""
        echo "Press Ctrl+C to stop Metro when done."
        wait $METRO_PID
        ;;
    *)
        echo "Invalid choice. Metro is running on port 8081."
        echo "Run 'npm run ios' or 'npm run android' manually."
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════"
echo "  🎉 DONE! 🎉"
echo "════════════════════════════════════════════════════════"
