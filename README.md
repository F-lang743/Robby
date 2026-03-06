# Robby

Robby is a React Native mobile application.

## Quick Start

### One-Button Launcher

The easiest way to run the app is using the one-button launcher scripts:

#### Windows
```bash
open-app.bat
```

#### Mac/Linux
```bash
./open-app.sh
```

These scripts will:
1. Install dependencies automatically (using `npm install --legacy-peer-deps`)
2. Start the Metro bundler in a separate window
3. Prompt you to select your platform (iOS or Android)
4. Build and launch the app on your selected platform

### Manual Installation

If you prefer to run commands manually:

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Metro bundler** (keep this running):
   ```bash
   npm start
   ```

3. **In a new terminal, launch the app:**
   
   For iOS:
   ```bash
   npm run ios
   ```
   
   For Android:
   ```bash
   npm run android
   ```

## Requirements

- Node.js (latest LTS version recommended)
- npm
- For iOS: Xcode and CocoaPods (Mac only)
- For Android: Android Studio and Android SDK

## Installing on a Physical Device

1. Connect your phone via USB
2. Run `./open-app.sh` (Mac/Linux) or `open-app.bat` (Windows)
3. Choose your platform:
   - 1 = iOS
   - 2 = Android

The app will be built and installed on your connected device.
