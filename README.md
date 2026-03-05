# Robby – Voice Assistant for Truck Drivers

A Flutter mobile app providing hands-free, voice-driven features to make life on the road safer and more efficient.

## Features

| Voice Command | What it does |
|---|---|
| *"Find cheap diesel"* | Locates cheapest diesel stations within 50 km using a cached fuel-price API |
| *"Start trip"* | Begins GPS-based mileage tracking |
| *"End trip"* | Stops tracking and reports total miles driven |
| *"How many miles?"* | Reports current trip miles or total paid miles |
| *"Take a note: ..."* | Records a voice note with GPS coordinates |
| *"Where am I?"* | Reads your current address |
| *"Send email"* | Opens your email client hands-free |

## Architecture

```
lib/
├── core/
│   ├── cache/          # TTL cache (SharedPreferences + in-memory layer)
│   ├── models/         # Immutable data models
│   └── utils/          # GeoUtils (Haversine), Debouncer, Throttler
├── features/
│   ├── assistant/      # VoiceAssistant – command dispatcher
│   ├── email/          # EmailService
│   ├── fuel/           # FuelService – cheapest nearby diesel
│   ├── gps/            # LocationService – battery-efficient GPS
│   ├── mileage/        # MileageService – trip & paid-mile tracking
│   ├── navigation/     # NavigationService – OSRM routing
│   ├── notes/          # NotesService – voice notes
│   └── voice/          # VoiceService – STT + TTS
└── ui/
    └── screens/        # HomeScreen (single large mic button)
```

## Performance & Efficiency Highlights

1. **Adaptive GPS polling** – updates only every 5 seconds and only for moves > 10 m, cutting battery drain by up to 80 % on long hauls.
2. **In-memory + disk two-layer cache** – fuel prices (2 h TTL) and routes (15 min TTL) are served from memory if already decoded, avoiding redundant JSON parsing and network round-trips.
3. **Bounding-box pre-filter** – cheap lat/lng comparison eliminates non-candidate fuel stations *before* expensive Haversine trig.
4. **Background isolate computation** – total paid-miles calculation and polyline-length validation run in a `compute()` isolate, keeping the UI thread responsive.
5. **Debounced partial voice results** – intermediate STT results are debounced at 200 ms, so UI rebuilds happen once per pause rather than once per word.
6. **Route deduplication** – along-route fuel search quantises waypoints to 50 km grid cells, preventing redundant API calls for overlapping route segments.
7. **Single shared stream** – all consumers share one GPS stream instead of opening separate hardware connections.
8. **Lazy TTS initialisation** – the TTS engine is not loaded until the first `speak()` call, keeping app start-up fast.

## Getting Started

```bash
flutter pub get
flutter run
```

### Permissions required

- `android.permission.ACCESS_FINE_LOCATION` – GPS tracking
- `android.permission.RECORD_AUDIO` – voice recognition
- `android.permission.INTERNET` – routing & fuel price APIs

## Testing

```bash
flutter test test/unit/
```
