# 🚛 How to Open the Robby App

## Quick Answer

```bash
# 1. Install dependencies (one time, ~5 minutes)
npm install

# 2. Start Metro bundler (keep running)
npm start

# 3. Open new terminal, run the app
npm run ios        # For iOS
# OR
npm run android    # For Android
```

That's it! The app will open on your simulator/device.

---

## Detailed Instructions

### Prerequisites Needed

Before running the app, you need:

**For iOS:**
- macOS computer
- Xcode 14+ installed
- CocoaPods installed (`sudo gem install cocoapods`)
- iOS Simulator (comes with Xcode)

**For Android:**
- Android Studio installed
- Android SDK configured
- Android emulator created, OR
- Physical Android device with USB debugging

**For Both:**
- Node.js 18+ installed ✅ (already have v24.14.0)
- npm installed ✅ (already have v11.9.0)

### Step-by-Step Instructions

#### Step 1: Install Dependencies (First Time Only)

```bash
cd /home/runner/work/Robby/Robby
npm install
```

This installs all packages from `package.json` (~500MB, takes 3-5 minutes).

**For iOS only, also run:**
```bash
cd ios
pod install
cd ..
```

#### Step 2: Start Metro Bundler

Metro is the JavaScript bundler for React Native. It needs to run continuously.

```bash
npm start
```

**You'll see:**
```
                ######                ######
              ###     ####        ####     ###
            ##          ###    ###          ##
            ##             ####             ##
            ##             ####             ##
            ##           ##    ##           ##
            ##         ###      ###         ##
              ###     ####        ####     ###
                ######                ######


               Welcome to Metro
```

**Keep this terminal window open!** Leave it running.

#### Step 3: Open the App

**Open a NEW terminal window** and run:

**For iOS:**
```bash
cd /home/runner/work/Robby/Robby
npm run ios
```

**For Android:**
```bash
cd /home/runner/work/Robby/Robby
npm run android
```

#### Step 4: Grant Permissions

When the app first opens, it will request:

1. 📍 **Location Permission** - Tap "Allow" or "Allow While Using App"
   - Needed for: GPS navigation, finding truck stops, tracking mileage

2. 🎤 **Microphone Permission** - Tap "Allow"
   - Needed for: Voice commands, voice notes

3. 🗣️ **Speech Recognition** - Tap "Allow" (iOS)
   - Needed for: Converting speech to text

#### Step 5: Try Voice Commands!

Tap the microphone button and say:
- **"Find truck stops"** → Opens truck stop finder
- **"Navigate"** → Opens navigation screen
- **"Track mileage"** → Opens mileage tracker
- **"Find fuel"** → Opens fuel price finder
- **"Take a note"** → Opens voice notes
- **"Send email"** → Opens email composer

---

## Troubleshooting

### Metro won't start
```bash
npm start -- --reset-cache
```

### iOS app won't build
```bash
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

### Android app won't build
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### "Cannot find module" errors
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Port 8081 already in use
```bash
# Stop Metro and restart
npm start
```

### Simulator/Emulator not opening
**iOS:**
- Open Xcode
- Go to Xcode > Preferences > Locations
- Make sure Command Line Tools is set
- Open Simulator.app manually

**Android:**
- Open Android Studio
- Tools > AVD Manager
- Click "Play" button on an emulator
- Then run `npm run android`

---

## What You'll See

### Home Screen
The main dashboard with 6 feature cards:
- 🛣️ Truck Stops
- 🧭 Navigation
- 📊 Mileage Tracker
- ⛽ Fuel Finder
- 📝 Voice Notes
- ✉️ Email

Each has:
- Large, easy-to-tap button
- Voice activation
- Clear description

### Voice Button
Every screen has a microphone button at the bottom:
- Tap to start listening
- Speak your command
- Get audio feedback

### Navigation
Simple stack navigation:
- Tap back arrow to return
- Or use device back button (Android)
- Or swipe from left edge (iOS)

---

## Testing the Features

### 1. Find Truck Stops
- Say: "Find truck stops"
- See list sorted by distance
- Shows amenities: Fuel, Parking, Showers, etc.

### 2. Track Mileage
- Say: "Track mileage"
- Say: "Drove 250 miles from Denver to Kansas City, 230 paid"
- App parses and saves automatically
- View total miles at top

### 3. Voice Notes
- Say: "Take a note"
- Say your note content
- Tap "Save Note"
- Play back with text-to-speech

### 4. Navigation
- Opens GPS map
- Shows current location
- Calculate distances between points

### 5. Fuel Finder
- Shows cheapest diesel prices
- Sorted by price (mock data for MVP)

### 6. Email
- Compose email by voice
- Fields: To, Subject, Message
- Preview before sending

---

## Development Mode

### Hot Reload
Make code changes and see them instantly. No rebuild needed.

### Debug Menu
Press:
- **iOS**: `Cmd + D` (Mac) or shake device
- **Android**: `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux) or shake device

Options:
- Enable Fast Refresh
- Debug JS Remotely
- Show Inspector
- Toggle Performance Monitor

### Logs
```bash
# iOS logs
npx react-native log-ios

# Android logs
npx react-native log-android
```

---

## Production Build

### iOS Production Build
```bash
cd ios
xcodebuild -workspace RobbyTruckAssistant.xcworkspace \
  -scheme RobbyTruckAssistant \
  -configuration Release
```

### Android Production Build
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

## Current Limitations

### Simulators/Emulators
- **Microphone**: May not work fully in simulators
- **GPS**: Uses mock locations
- **Performance**: Slower than physical device

**For full testing, use a physical device!**

### MVP Mock Data
Currently using mock data for:
- Truck stop locations
- Fuel prices
- Email sending

These will be replaced with real APIs in production.

---

## Next Steps After Opening

1. ✅ **App opens successfully**
2. ⏭️ Test all 7 screens
3. ⏭️ Try voice commands
4. ⏭️ Test mileage tracking
5. ⏭️ Create voice notes
6. ⏭️ Check GPS functionality
7. ⏭️ Report any issues

---

## Need Help?

**Documentation:**
- `QUICKSTART.md` - Quick setup guide
- `DEVELOPER_GUIDE.md` - Development details
- `FEATURES.md` - Feature specifications
- `APP_VALIDATION.md` - What's been verified

**Support:**
- Open a GitHub issue
- Check troubleshooting section above
- Review error messages in Metro console

---

## Summary

**To open the app:**
1. `npm install` (first time)
2. `npm start` (keep running)
3. `npm run ios` or `npm run android` (new terminal)

**The app is ready to run!** 🚛🎤✅
