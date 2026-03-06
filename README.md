# 🚛 Robby - Truck Assistant

A mobile voice-based AI assistant companion for truck drivers. Designed to provide helpful, hands-free features that make life on the road easier and more efficient.

## 📱 INSTALL ON YOUR PHONE - SUPER EASY!

**Want the Robby app with a blue truck icon on your home screen?**

### 🎯 3 Simple Steps:

1. **Connect your phone** to your computer with USB cable
2. **Run the installer:** `./open-app.sh` (Mac/Linux) or `open-app.bat` (Windows)
3. **Choose your platform:** Type `1` for iOS or `2` for Android

**That's it!** Wait 2-3 minutes and the blue truck icon will appear on your phone! 🚛

📖 **Detailed Guide:** See [INSTALL_ON_MY_PHONE.md](INSTALL_ON_MY_PHONE.md) or [INSTALL_QUICK_GUIDE.txt](INSTALL_QUICK_GUIDE.txt)

---

## 🎯 App Icon

**Blue truck icon on your home screen!** When you install Robby, you'll see a distinctive blue truck icon. Just tap it to open the app!

See [ICON_READY.md](ICON_READY.md) for details about the truck icon.

## 🚀 ONE-BUTTON QUICK START

**Want to open the app with just one command?**

### Mac/Linux:
```bash
./open-app.sh
```

### Windows:
```batch
open-app.bat
```

**That's it!** The script automatically installs dependencies, starts Metro, and launches the app.

See [ONE_BUTTON_LAUNCHER.md](ONE_BUTTON_LAUNCHER.md) for details.

## Features

### Core Functionality
- 🎤 **Voice Interface** - Hands-free control using voice commands
- 🛣️ **Truck Stops Finder** - Find nearby truck stops with amenities
- 🧭 **Navigation** - GPS-based route guidance and distance calculation
- 📊 **Mileage Tracker** - Track total miles and paid miles for each trip
- ⛽ **Fuel Finder** - Find the cheapest diesel fuel prices along your route
- 📝 **Voice Notes** - Take notes completely hands-free
- ✉️ **Email Sender** - Compose and send emails by voice

### Safety First
- All features accessible by voice commands
- Minimal driver distraction
- Large, easy-to-read interface
- Optimized for use while driving

## Technology Stack

- **Framework**: React Native 0.72.6
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Voice Recognition**: @react-native-voice/voice
- **Text-to-Speech**: react-native-tts
- **Maps**: react-native-maps
- **GPS**: react-native-geolocation-service
- **Storage**: AsyncStorage

## Prerequisites

- Node.js >= 18
- React Native development environment
  - For iOS: Xcode 14+, CocoaPods
  - For Android: Android Studio, Java JDK 11+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/F-lang743/Robby.git
cd Robby
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Start Metro bundler separately (if needed)
```bash
npm start
```

## Usage

### Voice Commands

The app responds to natural voice commands:

- **"Find truck stops"** - Opens the truck stops finder
- **"Navigate"** - Opens navigation
- **"Track mileage"** - Opens mileage tracker
- **"Find fuel"** - Opens fuel price finder
- **"Take a note"** - Opens voice notes
- **"Send email"** - Opens email composer

### Mileage Tracking

Example voice input:
```
"Drove 250 miles from Denver to Kansas City, 230 paid"
```

### Email Composition

Example voice input:
```
"Send to boss@company.com subject delivery update message all packages delivered on time"
```

## Development

### Project Structure

```
Robby/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Voice)
│   ├── screens/         # App screens
│   ├── services/        # Business logic and API services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── android/             # Android native code
├── ios/                 # iOS native code
└── App.tsx             # Root component
```

### Testing

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

## Permissions

The app requires the following permissions:

### Android
- `ACCESS_FINE_LOCATION` - For GPS and location services
- `RECORD_AUDIO` - For voice recognition

### iOS
- `NSLocationWhenInUseUsageDescription` - For location services
- `NSMicrophoneUsageDescription` - For voice recognition
- `NSSpeechRecognitionUsageDescription` - For speech recognition

## Future Enhancements

- Automatic log keeping for mileage and stops
- Predictive fuel stops based on route and fuel efficiency
- Integration with trucking/freight platforms
- Weather alerts and road conditions
- Real-time traffic updates
- Integration with GasBuddy API for fuel prices
- Integration with Google Maps/Apple Maps for routing
- Email service integration (SendGrid, Gmail API)
- Cloud sync for data backup

## MVP Status

This is the first version (MVP) of Robby. It demonstrates core features with mock data where external APIs would be used in production. Key integrations planned for future releases:

- **Fuel Prices**: GasBuddy API or similar
- **Navigation**: Google Maps API or Apple Maps
- **Truck Stops**: Trucker Path API or similar
- **Email**: SendGrid, AWS SES, or similar

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
