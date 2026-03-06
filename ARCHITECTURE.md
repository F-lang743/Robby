# Robby Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROBBY MOBILE APP                        │
│                   (React Native + TypeScript)                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ HomeScreen   │  │ TruckStops   │  │ Navigation   │        │
│  │              │  │   Screen     │  │   Screen     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Mileage     │  │  FuelFinder  │  │    Notes     │        │
│  │  Tracker     │  │   Screen     │  │   Screen     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│  ┌──────────────┐                                               │
│  │    Email     │                                               │
│  │   Screen     │                                               │
│  └──────────────┘                                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           REUSABLE COMPONENTS                            │  │
│  │  • Button (Custom styled button)                        │  │
│  │  • VoiceButton (Microphone with voice recognition)      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTEXT LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              VOICE CONTEXT                              │   │
│  │  • Speech-to-Text (react-native-voice)                 │   │
│  │  • Text-to-Speech (react-native-tts)                   │   │
│  │  • State: isListening, result, error                   │   │
│  │  • Actions: startListening, stopListening, speak       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ LocationService  │  │ TruckStopService │                   │
│  │ • getCurrentLoc  │  │ • findNearby     │                   │
│  │ • watchPosition  │  │ • search         │                   │
│  │ • calcDistance   │  │ • getDetails     │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │  FuelService     │  │ MileageService   │                   │
│  │ • findCheapest   │  │ • saveEntry      │                   │
│  │ • alongRoute     │  │ • getAllEntries  │                   │
│  │                  │  │ • getTotalMiles  │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                  │
│  ┌──────────────────┐                                          │
│  │  NotesService    │                                          │
│  │ • saveNote       │                                          │
│  │ • getAllNotes    │                                          │
│  │ • searchNotes    │                                          │
│  └──────────────────┘                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐│
│  │  AsyncStorage   │  │   Mock Data     │  │  External APIs ││
│  │  (Local)        │  │   (MVP)         │  │  (Future)      ││
│  │                 │  │                 │  │                ││
│  │ • Mileage       │  │ • Truck Stops   │  │ • GasBuddy    ││
│  │ • Notes         │  │ • Fuel Prices   │  │ • Google Maps ││
│  │                 │  │                 │  │ • Trucker Path││
│  │                 │  │                 │  │ • SendGrid    ││
│  └─────────────────┘  └─────────────────┘  └────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NATIVE MODULES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Voice     │  │     GPS      │  │     Maps     │        │
│  │  Recognition │  │  Geolocation │  │   MapView    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PLATFORM                                  │
│                      iOS / Android                               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Example: Voice Command

```
1. User taps microphone button
   ↓
2. VoiceButton triggers VoiceContext.startListening()
   ↓
3. react-native-voice starts listening
   ↓
4. User says "find truck stops"
   ↓
5. Speech recognized → result passed to VoiceButton
   ↓
6. VoiceButton calls onResult callback
   ↓
7. Screen receives transcribed text
   ↓
8. Screen parses command → navigates to TruckStopsScreen
   ↓
9. VoiceContext.speak() provides audio feedback
   ↓
10. User hears "Opening truck stops finder"
```

## Data Flow Example: Mileage Tracking

```
1. User opens Mileage Tracker
   ↓
2. User says "drove 250 miles from Denver to Kansas City"
   ↓
3. VoiceButton captures transcription
   ↓
4. Screen parses natural language:
   - miles: 250
   - startLocation: Denver
   - endLocation: Kansas City
   ↓
5. Screen calls MileageService.saveMileageEntry()
   ↓
6. MileageService:
   - Generates unique ID
   - Adds timestamp
   - Saves to AsyncStorage
   ↓
7. Screen refreshes to show new entry
   ↓
8. VoiceContext.speak("Mileage saved")
```

## Component Communication

```
┌─────────────────────────────────────────────────────────────┐
│                    React Navigation                         │
│  (Controls screen transitions)                              │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   VoiceContext                              │
│  (Provides voice capabilities to all screens)               │
└─────────────────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌───────────────┐       ┌───────────────┐
│   Screens     │       │  Components   │
│ (Consumers)   │       │  (Consumers)  │
└───────────────┘       └───────────────┘
          │                       │
          └───────────┬───────────┘
                      ▼
          ┌───────────────────┐
          │   Service Layer   │
          │ (Business Logic)  │
          └───────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    ┌──────────┐         ┌────────────┐
    │ Storage  │         │ Native APIs│
    └──────────┘         └────────────┘
```

## Key Design Patterns

### 1. Context API Pattern
```typescript
// VoiceContext provides voice capabilities app-wide
<VoiceProvider>
  <App />
</VoiceProvider>

// Any component can use voice
const {speak, startListening} = useVoice();
```

### 2. Service Layer Pattern
```typescript
// Screens call services, not APIs directly
const stops = await TruckStopService.findNearbyTruckStops(location);

// Services handle business logic
class TruckStopService {
  static async findNearbyTruckStops(location, radius) {
    // Business logic here
    return results;
  }
}
```

### 3. Component Composition
```typescript
// Reusable components composed together
<VoiceButton
  onResult={handleVoiceCommand}
  prompt="What would you like to do?"
/>

<Button
  title="Save"
  onPress={handleSave}
  loading={isSaving}
/>
```

## Technology Stack Mapping

```
┌─────────────────────────────────────────────────────────────┐
│ Framework: React Native 0.72.6                              │
│ Language: TypeScript 5.2.2                                  │
│ Navigation: React Navigation 6.x                            │
│ State: React Context + Hooks                                │
│ Storage: AsyncStorage                                       │
│ Voice Input: react-native-voice 3.2.4                       │
│ Voice Output: react-native-tts 4.1.0                        │
│ Maps: react-native-maps 1.7.1                               │
│ Location: react-native-geolocation-service 5.3.1            │
│ Testing: Jest + Testing Library                             │
│ Linting: ESLint + Prettier                                  │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
Robby/
├── src/
│   ├── components/          # Reusable UI
│   │   ├── Button.tsx
│   │   └── VoiceButton.tsx
│   │
│   ├── contexts/            # Global State
│   │   └── VoiceContext.tsx
│   │
│   ├── screens/             # App Screens
│   │   ├── HomeScreen.tsx
│   │   ├── TruckStopsScreen.tsx
│   │   ├── NavigationScreen.tsx
│   │   ├── MileageTrackerScreen.tsx
│   │   ├── FuelFinderScreen.tsx
│   │   ├── NotesScreen.tsx
│   │   └── EmailScreen.tsx
│   │
│   ├── services/            # Business Logic
│   │   ├── LocationService.ts
│   │   ├── TruckStopService.ts
│   │   ├── FuelService.ts
│   │   ├── MileageService.ts
│   │   └── NotesService.ts
│   │
│   └── types/               # TypeScript Types
│       └── index.ts
│
├── __tests__/               # Test Files
├── android/                 # Android Config
├── ios/                     # iOS Config
└── App.tsx                  # Root Component
```

## MVP Architecture Decisions

### ✅ What We Built
- **Service Layer**: Clean separation of concerns
- **Context API**: Simple, effective state management
- **AsyncStorage**: Fast local persistence
- **Mock Data**: Full UI/UX without API dependencies
- **TypeScript**: Type safety and better DX

### ⚠️ What's Deferred to Production
- **External APIs**: Will replace mock data
- **Authentication**: Not needed for MVP testing
- **Cloud Sync**: Local storage sufficient for MVP
- **Advanced Routing**: Basic GPS sufficient for MVP

## Scalability Considerations

### Current (MVP)
- All data stored locally
- Mock services return instantly
- No network requests
- Single-user focus

### Future (Production)
```
┌─────────────────┐
│  Mobile App     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Gateway   │ ← JWT Auth
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Cloud  │ │External│
│ Backend│ │  APIs  │
└────────┘ └────────┘
```

This MVP architecture provides a solid foundation for scaling to a production system with minimal refactoring.
