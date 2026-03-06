#!/bin/bash

# Robby Truck Assistant - Setup Script
# This script helps set up the development environment

set -e

echo "🚛 Setting up Robby Truck Assistant..."
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) is installed"
echo ""

# Install npm dependencies
echo "Installing npm dependencies..."
npm install
echo "✅ npm dependencies installed"
echo ""

# iOS setup (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Setting up iOS dependencies..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo "⚠️  CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
    
    # Install iOS pods
    echo "Installing iOS Pods..."
    cd ios
    pod install
    cd ..
    echo "✅ iOS dependencies installed"
    echo ""
else
    echo "ℹ️  Skipping iOS setup (not on macOS)"
    echo ""
fi

# Android setup check
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge 11 ]; then
        echo "✅ Java $JAVA_VERSION is installed (required for Android)"
    else
        echo "⚠️  Java 11+ recommended for Android development"
    fi
else
    echo "⚠️  Java not found - required for Android development"
fi
echo ""

# Success message
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  • For iOS: npm run ios"
echo "  • For Android: npm run android"
echo "  • Start Metro: npm start"
echo ""
echo "See DEVELOPER_GUIDE.md for more information"
