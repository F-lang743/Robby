# 🚛 ONE-BUTTON APP LAUNCHER

## The Simplest Way to Open Robby

You asked for **one button to push** - here it is!

---

## 🎯 Just Run One Command

### On Mac/Linux:
```bash
./open-app.sh
```

### On Windows:
```batch
open-app.bat
```

Or just **double-click** the file!

---

## What It Does Automatically

The script handles **everything** for you:

1. ✅ **Checks dependencies** - Installs if missing
2. ✅ **Starts Metro bundler** - Runs the dev server
3. ✅ **Launches the app** - Opens on your device/emulator

**No manual steps. No multiple terminals. Just one command.**

---

## First Time Setup (One Time Only)

### For iOS (Mac only):
```bash
# Install CocoaPods (one time)
sudo gem install cocoapods

# Then run the launcher
./open-app.sh
```

### For Android (Any OS):
1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio > Tools > Device Manager
3. Create and start an emulator
4. Run: `./open-app.sh` or `open-app.bat`

---

## What the Script Asks You

When you run the script, it will ask:

```
Choose your platform:
  1) iOS (requires macOS + Xcode)
  2) Android (requires Android Studio + Emulator/Device)
  3) Just keep Metro running (I'll launch manually)

Enter choice (1, 2, or 3):
```

Just type `1`, `2`, or `3` and press Enter!

---

## What You'll See

After launching, the app opens with:

### 🏠 Home Screen
Six feature cards:
- 🛣️ **Truck Stops**
- 🧭 **Navigation**
- 📊 **Mileage Tracker**
- ⛽ **Fuel Finder**
- 📝 **Voice Notes**
- ✉️ **Email**

### 🎤 Voice Commands
Tap the microphone and say:
- "Find truck stops"
- "Navigate"
- "Track mileage"
- "Find fuel"
- "Take a note"
- "Send email"

---

## Stopping the App

**To stop Metro bundler:**
- Press `Ctrl + C` in the terminal
- Or run: `lsof -ti:8081 | xargs kill -9` (Mac/Linux)

**To close the app:**
- Just close it on your device/emulator like any app

---

## Troubleshooting

### "Permission denied" on Mac/Linux
```bash
chmod +x open-app.sh
./open-app.sh
```

### "Port 8081 already in use"
The script automatically kills old Metro processes. If issues persist:
```bash
lsof -ti:8081 | xargs kill -9  # Mac/Linux
# Or restart your computer
```

### Android emulator not starting
1. Open Android Studio
2. Tools > Device Manager
3. Click ▶️ on an emulator
4. Wait for it to fully boot
5. Run the script again

### iOS build errors
```bash
cd ios
pod install
cd ..
./open-app.sh
```

---

## Alternative: Manual Commands

If you prefer to run commands manually:

```bash
# Terminal 1 - Start Metro
npm install --legacy-peer-deps
npm start

# Terminal 2 - Launch app
npm run ios      # For iOS
# OR
npm run android  # For Android
```

---

## Summary

✅ **ONE SCRIPT** does everything
✅ **NO manual steps** required
✅ **WORKS on Mac, Linux, and Windows**

### Quick Start:

**Mac/Linux:** `./open-app.sh`
**Windows:** `open-app.bat` (double-click)

That's it! 🎉

---

## Files Created

- **open-app.sh** - Mac/Linux launcher script
- **open-app.bat** - Windows launcher script
- **ONE_BUTTON_LAUNCHER.md** - This file

---

Need help? Check the other guides:
- `HOW_TO_OPEN_APP.md` - Detailed manual instructions
- `QUICKSTART.md` - Quick start guide
- `APP_IS_RUNNING.md` - Current running status
