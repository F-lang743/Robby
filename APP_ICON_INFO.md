# 🚛 Robby Truck Icon

## What Is This?

This is your **home screen app icon** - a blue truck that appears on your phone!

## How to Use It

1. **Install the app** on your phone (iOS or Android)
2. **Look for the blue truck icon** on your home screen
3. **Tap the truck icon** to open the Robby app
4. That's it! 🎉

## What It Looks Like

The icon is a **white truck on a blue background** with:
- Large trailer (the back part of the truck)
- Cab (where the driver sits) with a blue windshield
- Three black wheels with gray rims
- Simple, clean design that's easy to spot

## Icon Sizes Created

### Android (mipmap folders)
- **mdpi**: 48x48px - for older/smaller screens
- **hdpi**: 72x72px - for medium density screens
- **xhdpi**: 96x96px - for high density screens
- **xxhdpi**: 144x144px - for extra high density screens
- **xxxhdpi**: 192x192px - for newest high-res screens

Both regular (`ic_launcher.png`) and round (`ic_launcher_round.png`) versions are included.

### iOS (AppIcon.appiconset)
Multiple sizes from 20pt to 1024pt for:
- iPhone (all sizes)
- iPad (all sizes)  
- App Store listing (1024x1024)

## How It Works

When you install Robby on your device:

1. **On Android**: The system reads the `AndroidManifest.xml` which points to the truck icons in the mipmap folders
2. **On iOS**: The system reads the `Info.plist` and loads icons from `Images.xcassets/AppIcon.appiconset`
3. **On your home screen**: The truck icon appears with the name "Robby - Truck Assistant"
4. **When you tap it**: Your phone launches the Robby app!

## Installation

The icons are automatically included when you build and install the app:

```bash
# Run the one-button launcher
./open-app.sh   # Mac/Linux
# or
open-app.bat    # Windows

# Choose platform 1 (iOS) or 2 (Android)
# The app will be installed on your device/emulator with the truck icon!
```

## Testing the Icon

After installing:
1. Check your device home screen
2. You should see a **blue square icon with a white truck**
3. Tap it to open Robby
4. The icon will also appear in:
   - Recent apps list
   - App drawer (Android)
   - App Library (iOS)
   - Settings > Apps

## Icon File Locations

- **Android icons**: `/android/app/src/main/res/mipmap-*/ic_launcher*.png`
- **iOS icons**: `/ios/Robby/Images.xcassets/AppIcon.appiconset/`
- **Source SVG**: The original design is in the project history

## Customization

Want to change the icon? You'll need to:
1. Create a new 1024x1024 PNG image
2. Use the same generation scripts to create all sizes
3. Replace the files in the mipmap and AppIcon.appiconset folders
4. Rebuild and reinstall the app

---

**That's your truck icon! Just tap it on your home screen to open Robby!** 🚛📱
