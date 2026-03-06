# Quick Start Guide - Robby Truck Assistant

This guide will help you get the app running on your device as quickly as possible.

## Prerequisites Check

Before starting, ensure you have:

### Required Software
- ✅ **Node.js 18+** (you have Node.js - check with `node --version`)
- ✅ **npm or yarn** (comes with Node.js)
- ⚠️ **For iOS**: macOS with Xcode 14+ and CocoaPods
- ⚠️ **For Android**: Android Studio, Java JDK 11+, Android SDK

### Device/Emulator
- iOS Simulator (requires macOS and Xcode)
- Android Emulator (from Android Studio)
- Physical iOS device (requires Apple Developer account)
- Physical Android device (requires USB debugging enabled)

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# In the project root directory
npm install
```

This will install all the required packages (~500MB).

### Step 2: Platform-Specific Setup

#### For iOS (macOS only)
```bash
cd ios
pod install
cd ..
```

#### For Android
No additional setup needed if Android Studio is configured.

### Step 3: Start Metro Bundler

```bash
npm start
```

Keep this terminal window open. Metro Bundler will serve your JavaScript code.

### Step 4: Run the App

**In a NEW terminal window:**

#### iOS:
```bash
npm run ios
```

This will:
- Build the iOS app
- Launch the iOS Simulator
- Install and run Robby

#### Android:
```bash
npm run android
```

This will:
- Build the Android APK
- Launch/connect to an Android device or emulator
- Install and run Robby

## First Launch

When the app opens for the first time:

1. **Grant Permissions**: The app will request:
   - 📍 Location access (for GPS features)
   - 🎤 Microphone access (for voice commands)
   - 🗣️ Speech recognition (for voice-to-text)

2. **Test Voice Commands**: Tap the microphone button and say:
   - "Find truck stops"
   - "Navigate"
   - "Track mileage"

## Troubleshooting

### Metro Bundler won't start
```bash
npm start -- --reset-cache
```

### iOS build fails
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### "Command not found: react-native"
```bash
npm install -g react-native-cli
```

### Port 8081 already in use
```bash
# Kill the process using port 8081
lsof -ti:8081 | xargs kill
# Then restart Metro
npm start
```

## Development Mode Features

### Hot Reload
- Make code changes and see them instantly
- Changes to JavaScript files update automatically
- No need to rebuild the app

### Debug Menu
- **iOS**: Press `Cmd + D` or shake the device
- **Android**: Press `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux) or shake the device

From the debug menu you can:
- Enable Fast Refresh
- Start Remote JS Debugging
- Show Inspector
- Show Performance Monitor

## Testing Voice Features

### Voice Commands to Try:
1. **"Find truck stops"** - Opens truck stop finder
2. **"Navigate"** - Opens navigation screen
3. **"Track mileage"** - Opens mileage tracker
4. **"Find fuel"** - Opens fuel price finder
5. **"Take a note"** - Opens voice notes
6. **"Send email"** - Opens email composer

### Mileage Tracking Example:
Say: *"Drove 250 miles from Denver to Kansas City, 230 paid"*

The app will parse and save this automatically.

## Running on Physical Device

### iOS Device:
1. Connect iPhone via USB
2. Open `ios/RobbyTruckAssistant.xcworkspace` in Xcode
3. Select your device from the device dropdown
4. Click "Run" or press `Cmd + R`

### Android Device:
1. Enable Developer Options and USB Debugging on your Android device
2. Connect via USB
3. Run: `npm run android`
4. The app will install automatically

## Production Build

### iOS:
```bash
cd ios
xcodebuild -workspace RobbyTruckAssistant.xcworkspace -scheme RobbyTruckAssistant -configuration Release
```

### Android:
```bash
cd android
./gradlew assembleRelease
```

The APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## Next Steps

After getting the app running:

1. **Read the Documentation**:
   - `FEATURES.md` - Complete feature list
   - `DEVELOPER_GUIDE.md` - Development details
   - `ARCHITECTURE.md` - System architecture

2. **Run Tests**:
   ```bash
   npm test
   ```

3. **Check Code Quality**:
   ```bash
   npm run lint
   ```

## Need Help?

- Check `DEVELOPER_GUIDE.md` for detailed development information
- See `CONTRIBUTING.md` for contribution guidelines
- Open an issue on GitHub for bugs or questions

## Environment Variables (Optional)

Create a `.env` file in the root directory for API keys (when integrating external APIs):

```env
GOOGLE_MAPS_API_KEY=your_key_here
GASBUDDY_API_KEY=your_key_here
SENDGRID_API_KEY=your_key_here
```

## What's Working Right Now

✅ **Fully Functional**:
- Voice recognition and commands
- GPS location tracking
- All screen navigation
- Mileage tracking with storage
- Voice notes with storage
- UI and voice feedback

⚠️ **Uses Mock Data** (for MVP):
- Truck stop data
- Fuel prices
- Email sending

These will be replaced with real API calls in production.

## Common Issues and Solutions

### 1. "Unable to resolve module"
```bash
npm install
npm start -- --reset-cache
```

### 2. Microphone not working in simulator
Simulators may have limited microphone support. Test on a real device for full voice functionality.

### 3. GPS not working
Simulators use mock locations. For real GPS testing, use a physical device.

### 4. "Build failed" on iOS
Make sure CocoaPods are installed:
```bash
sudo gem install cocoapods
cd ios && pod install && cd ..
```

---

**You're ready to go!** 🚛🎤

Start with: `npm install && npm start`, then `npm run ios` or `npm run android` in a new terminal.
