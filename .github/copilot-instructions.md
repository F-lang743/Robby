# Copilot Instructions for Robby

Robby is a voice-based AI assistant mobile app for truck drivers that provides hands-free GPS navigation, fuel price lookup, mileage tracking, voice note-taking, and email sending features.

## Naming Conventions

### Variables

Use **full, self-explanatory names** that make the intent obvious without needing comments.

```
// ❌ Avoid
let d = 0;
let n = "";
let arr = [];
let tmp = getVal();
let x, y;

// ✅ Prefer
let distanceDrivenMiles = 0;
let driverName = "";
let nearbyTruckStops = [];
let currentFuelPricePerGallon = getFuelPrice();
let currentLatitude, currentLongitude;
```

### Functions / Methods

Name every function as a **verb phrase** that clearly states what it does and what it returns.

```
// ❌ Avoid
function handle() {}
function process(d) {}
function getData() {}
function upd(loc) {}
function calc(m, r) {}

// ✅ Prefer
function handleVoiceCommandInput(spokenText) {}
function processGpsCoordinateUpdate(rawCoordinate) {}
function fetchNearbyTruckStops(userLocation, radiusMiles) {}
function updateDriverCurrentLocation(newLocation) {}
function calculateEstimatedFuelCostForRoute(distanceMiles, fuelEfficiencyMpg) {}
```

### Boolean Variables

Prefix booleans with `is`, `has`, `can`, `should`, or `did` to make their meaning immediately clear.

```
// ❌ Avoid
let voice = false;
let gps = true;
let loaded = false;

// ✅ Prefer
let isVoiceRecognitionActive = false;
let isGpsPermissionGranted = true;
let hasRouteDataLoaded = false;
let canSendEmailHandsFree = true;
let shouldDisplayFuelStopAlert = false;
```

### Constants

Use `SCREAMING_SNAKE_CASE` for module-level constants; give them names that explain their **purpose**, not their value.

```
// ❌ Avoid
const R = 6371;
const T = 30000;
const N = 10;

// ✅ Prefer
const EARTH_RADIUS_KILOMETERS = 6371;
const VOICE_COMMAND_TIMEOUT_MILLISECONDS = 30000;
const MAX_NEARBY_TRUCK_STOPS_TO_DISPLAY = 10;
```

### Parameters

Parameters follow the same rules as variables. Avoid single-letter names except in well-known mathematical contexts (e.g., `x`, `y` for 2-D coordinates).

```
// ❌ Avoid
function findFuel(l, r, t) {}

// ✅ Prefer
function findCheapestFuelStationOnRoute(routeCoordinates, searchRadiusMiles, fuelType) {}
```

### Files and Modules

Name files after the **feature or domain concept** they implement, not after generic roles.

```
// ❌ Avoid
utils.js / helpers.ts / manager.dart / service.dart

// ✅ Prefer
gpsRouteCalculator.ts
fuelPriceService.ts
voiceCommandParser.ts
mileageLogRepository.dart
truckStopSearchService.dart
```

## Code Style Guidelines

- Write code that reads like plain English wherever possible.
- Prefer longer, unambiguous names over short abbreviations.
- When a name feels hard to write, reconsider whether the function or variable has too many responsibilities.
- Add a JSDoc / Dart doc / docstring only when the name alone is not sufficient to convey intent.
- Avoid prefixes like `my`, `the`, or `data` that add noise without meaning (e.g., prefer `driverLocation` over `myLocation` or `locationData`).

## Domain Vocabulary

Use consistent terminology drawn from the trucking domain throughout the codebase.

| Concept | Preferred term |
|---|---|
| Driver's real-time position | `currentDriverLocation` |
| A place to stop for the night | `truckStop` |
| Miles actually driven (compensated) | `paidMilesDriven` |
| Cost per unit of diesel | `dieselPricePerGallon` |
| Spoken input from the driver | `voiceCommandText` |
| Parsed intent from voice input | `recognizedVoiceIntent` |
| A hands-free audio reply | `textToSpeechResponse` |
