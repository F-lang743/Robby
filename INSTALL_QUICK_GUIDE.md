# Quick Start Guide for Robby

## Installation on Your Phone

Follow these simple steps to install Robby on your phone:

### Prerequisites
- Node.js installed on your computer
- USB cable to connect your phone
- For iOS: Mac computer with Xcode installed
- For Android: Android Studio installed with USB debugging enabled on your phone

### Installation Steps

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/F-lang743/Robby.git
   cd Robby
   ```

2. **Connect your phone via USB**

3. **Run the one-button launcher:**

   **Windows:**
   ```bash
   open-app.bat
   ```

   **Mac/Linux:**
   ```bash
   ./open-app.sh
   ```

4. **Choose your platform:**
   - Enter `1` for iOS
   - Enter `2` for Android

5. **Wait for installation:**
   - The script will automatically:
     - Install all dependencies
     - Start the Metro bundler
     - Build the app
     - Install it on your connected device

6. **Find the app:**
   - Look for the Robby icon (blue truck) on your phone's home screen
   - Tap to open and start using!

## Troubleshooting

### Android
- Make sure USB debugging is enabled on your phone
- Check that your phone is connected: `adb devices`
- If prompted on your phone, allow USB debugging

### iOS
- Make sure your Mac has Xcode installed
- You may need to trust your computer on your iPhone
- You may need to register your device in Xcode

### Common Issues
- **"package.json not found"**: Make sure you're in the Robby directory
- **"Node.js is not installed"**: Install Node.js from https://nodejs.org/
- **Dependencies fail to install**: Check your internet connection

## Getting Help

If you encounter any issues, please:
1. Check the main README.md for more detailed instructions
2. Make sure all prerequisites are installed
3. Try running the commands manually (see README.md)
