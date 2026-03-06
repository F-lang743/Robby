# Developer Guide - Robby Truck Assistant

## Overview

Robby is a React Native mobile application designed as a voice-controlled assistant for truck drivers. This guide provides comprehensive information for developers working on the project.

## Architecture

### Technology Stack

- **React Native 0.72.6**: Cross-platform mobile framework
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **react-native-voice**: Speech-to-text (STT)
- **react-native-tts**: Text-to-speech (TTS)
- **react-native-maps**: Map visualization
- **react-native-geolocation-service**: GPS tracking
- **AsyncStorage**: Local data persistence

### Project Structure

```
Robby/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx        # Custom button component
│   │   └── VoiceButton.tsx   # Voice input button
│   ├── contexts/             # React Context providers
│   │   └── VoiceContext.tsx  # Voice recognition state management
│   ├── screens/              # App screens
│   │   ├── HomeScreen.tsx    # Main dashboard with voice commands
│   │   ├── TruckStopsScreen.tsx
│   │   ├── NavigationScreen.tsx
│   │   ├── MileageTrackerScreen.tsx
│   │   ├── FuelFinderScreen.tsx
│   │   ├── NotesScreen.tsx
│   │   └── EmailScreen.tsx
│   ├── services/             # Business logic layer
│   │   ├── LocationService.ts      # GPS and distance calculations
│   │   ├── TruckStopService.ts     # Truck stop data management
│   │   ├── FuelService.ts          # Fuel price data
│   │   ├── MileageService.ts       # Mileage tracking with AsyncStorage
│   │   └── NotesService.ts         # Voice notes persistence
│   └── types/                # TypeScript type definitions
│       └── index.ts          # Shared types
├── __tests__/                # Test files
├── android/                  # Android native code
├── ios/                      # iOS native code
├── App.tsx                   # Root component
└── index.js                  # Entry point
```

## Development Setup

### Prerequisites

1. **Node.js** 18 or higher
2. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

3. **For iOS Development:**
   - macOS with Xcode 14+
   - CocoaPods
   ```bash
   sudo gem install cocoapods
   ```

4. **For Android Development:**
   - Android Studio
   - Java JDK 11 or higher
   - Android SDK (API 33)

### Installation

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/F-lang743/Robby.git
   cd Robby
   npm install
   ```

2. For iOS, install CocoaPods:
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. Start Metro bundler:
   ```bash
   npm start
   ```

4. Run on device/simulator:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Key Features Implementation

### 1. Voice Recognition

The `VoiceContext` provides centralized voice recognition:

```typescript
const {isListening, result, startListening, stopListening, speak} = useVoice();
```

**Usage in screens:**
```typescript
<VoiceButton
  onResult={handleVoiceCommand}
  prompt="What would you like to do?"
/>
```

### 2. Location Services

GPS tracking and distance calculations:

```typescript
import {LocationService} from '../services/LocationService';

// Get current location
const location = await LocationService.getCurrentLocation();

// Calculate distance between two points
const distance = LocationService.calculateDistance(from, to);

// Watch position changes
const watchId = LocationService.watchPosition(callback);
```

### 3. Data Persistence

Using AsyncStorage for offline-first architecture:

```typescript
import {MileageService} from '../services/MileageService';

// Save mileage entry
await MileageService.saveMileageEntry({
  date: new Date().toISOString(),
  startLocation: 'Denver',
  endLocation: 'Kansas City',
  miles: 600,
  paidMiles: 580
});

// Retrieve entries
const entries = await MileageService.getAllEntries();
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

Example component test:
```typescript
import {render, fireEvent} from '@testing-library/react-native';
import Button from '../src/components/Button';

test('button calls onPress when clicked', () => {
  const onPress = jest.fn();
  const {getByText} = render(
    <Button title="Test" onPress={onPress} />
  );
  
  fireEvent.press(getByText('Test'));
  expect(onPress).toHaveBeenCalled();
});
```

## Code Style

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix
```

### TypeScript

Always use TypeScript for type safety. Define interfaces for all data structures:

```typescript
interface TruckStop {
  id: string;
  name: string;
  location: Location;
  amenities: string[];
}
```

### Component Patterns

1. **Functional Components**: Use function components with hooks
2. **Props Interfaces**: Define TypeScript interfaces for all props
3. **Hooks**: Use React hooks for state and side effects
4. **Context**: Use Context API for global state (e.g., VoiceContext)

## Voice Command Patterns

Voice commands are parsed using natural language patterns:

```typescript
const handleVoiceCommand = (command: string) => {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('truck stop')) {
    // Navigate to truck stops
  } else if (lowerCommand.includes('navigate')) {
    // Navigate to navigation
  }
};
```

## MVP Limitations & Future Work

### Current Limitations

1. **Mock Data**: Truck stops and fuel prices use hardcoded mock data
2. **Navigation**: Shows UI only, no actual routing algorithms
3. **Email**: Simulates sending, not connected to email service
4. **No Authentication**: No user accounts or cloud sync

### Planned Integrations

1. **External APIs**:
   - GasBuddy API for real fuel prices
   - Google Maps / Apple Maps for navigation
   - Trucker Path API for truck stop data
   - SendGrid / AWS SES for email

2. **Features**:
   - User authentication
   - Cloud data sync
   - Offline mode with sync
   - Weather and traffic alerts
   - Integration with freight platforms

## Permissions

### Android (`AndroidManifest.xml`)

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### iOS (`Info.plist`)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Robby needs location for navigation and truck stops</string>
<key>NSMicrophoneUsageDescription</key>
<string>Robby needs microphone for voice commands</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Robby uses speech recognition for hands-free operation</string>
```

## Debugging

### React Native Debugger

1. Enable Debug mode: Shake device or Cmd+D (iOS) / Cmd+M (Android)
2. Select "Debug"
3. Open Chrome DevTools at `http://localhost:8081/debugger-ui`

### Logs

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Run linter and tests
4. Submit pull request

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
   ```bash
   npm start -- --reset-cache
   ```

2. **iOS build fails**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build fails**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/)
- [Jest Testing](https://jestjs.io/docs/getting-started)

## Support

For questions or issues:
- Open a GitHub issue
- Contact the development team
