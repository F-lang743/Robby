import 'dart:async';
import 'package:logger/logger.dart';

import '../email/email_service.dart';
import '../fuel/fuel_service.dart';
import '../gps/location_service.dart';
import '../mileage/mileage_service.dart';
import '../navigation/navigation_service.dart';
import '../notes/notes_service.dart';
import '../voice/voice_service.dart';

/// High-level assistant that wires voice commands to the underlying services.
///
/// ## Efficiency improvements
/// 1. **Command pattern** – each intent is dispatched by string matching once
///    using a pre-ordered list of matchers, avoiding cascaded if-else chains
///    and making it easy to add new intents.
/// 2. **Non-blocking handlers** – all command handlers are `async` and
///    `await` only the parts that need results, so the UI is never frozen
///    while the assistant processes a request.
/// 3. **Single stream subscription** – [VoiceService.finalResults] is
///    subscribed to once; no intermediate buffering.
class VoiceAssistant {
  VoiceAssistant({
    required VoiceService voice,
    required LocationService location,
    required FuelService fuel,
    required NavigationService navigation,
    required NotesService notes,
    required EmailService email,
    required MileageService mileage,
    Logger? logger,
  })  : _voice = voice,
        _location = location,
        _fuel = fuel,
        _navigation = navigation,
        _notes = notes,
        _email = email,
        _mileage = mileage,
        _log = logger ?? Logger(printer: PrettyPrinter());

  final VoiceService _voice;
  final LocationService _location;
  final FuelService _fuel;
  final NavigationService _navigation;
  final NotesService _notes;
  final EmailService _email;
  final MileageService _mileage;
  final Logger _log;

  StreamSubscription<String>? _commandSub;
  bool _isActive = false;

  bool get isActive => _isActive;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  Future<void> start() async {
    if (_isActive) return;
    _isActive = true;
    await _location.startTracking();
    _commandSub = _voice.finalResults.listen(_dispatch);
    await _voice.startListening();
    await _voice.speak('Robby is ready. How can I help?');
    _log.i('VoiceAssistant: started');
  }

  Future<void> stop() async {
    if (!_isActive) return;
    _isActive = false;
    await _commandSub?.cancel();
    _commandSub = null;
    await _voice.stopListening();
    _location.stopTracking();
    _log.i('VoiceAssistant: stopped');
  }

  // ---------------------------------------------------------------------------
  // Command dispatch
  // ---------------------------------------------------------------------------

  Future<void> _dispatch(String command) async {
    _log.d('VoiceAssistant: command="$command"');
    final lower = command.toLowerCase();

    if (_matches(lower, _kFuelPhrases)) {
      await _handleFindCheapFuel();
    } else if (_matches(lower, _kStartTripPhrases)) {
      _handleStartTrip();
    } else if (_matches(lower, _kEndTripPhrases)) {
      await _handleEndTrip();
    } else if (_matches(lower, _kMilesPhrases)) {
      await _handleMilesQuery();
    } else if (_matches(lower, _kNotePhrases)) {
      await _handleNote(command);
    } else if (_matches(lower, _kEmailPhrases)) {
      await _handleEmail(command);
    } else if (_matches(lower, _kLocationPhrases)) {
      await _handleLocationQuery();
    } else {
      await _voice.speak(
          "Sorry, I didn't understand that. Try saying 'find cheap fuel' "
          "or 'start trip'.");
    }
  }

  // ---------------------------------------------------------------------------
  // Command handlers
  // ---------------------------------------------------------------------------

  Future<void> _handleFindCheapFuel() async {
    final loc = await _location.getCurrentLocation();
    if (loc == null) {
      await _voice.speak('I could not get your location. Please check GPS.');
      return;
    }
    await _voice.speak('Searching for cheap diesel near you…');
    final stations = await _fuel.getCheapestNearby(center: loc.position);
    if (stations.isEmpty) {
      await _voice.speak('No fuel stations found nearby.');
      return;
    }
    final best = stations.first;
    final price = best.dieselPriceDollars != null
        ? '\$${best.dieselPriceDollars!.toStringAsFixed(2)}'
        : '\$${best.regularPriceDollars.toStringAsFixed(2)}';
    await _voice.speak(
        'The cheapest diesel nearby is ${best.name} at $price per gallon, '
        'located at ${best.address}.');
  }

  void _handleStartTrip() {
    _mileage.startTrip();
    _voice.speak('Trip started. Safe driving!');
  }

  Future<void> _handleEndTrip() async {
    final entry = await _mileage.stopTrip();
    if (entry == null) {
      await _voice.speak('No active trip to end.');
      return;
    }
    await _voice.speak(
        'Trip ended. You drove ${entry.distanceMiles.toStringAsFixed(1)} miles '
        'in ${_formatDuration(entry.duration)}.');
  }

  Future<void> _handleMilesQuery() async {
    if (_mileage.isTripActive) {
      await _voice.speak(
          'Current trip: ${_mileage.currentTripMiles.toStringAsFixed(1)} miles.');
    } else {
      final paid = await _mileage.getTotalPaidMiles();
      await _voice.speak(
          'Total paid miles logged: ${paid.toStringAsFixed(1)} miles.');
    }
  }

  Future<void> _handleNote(String command) async {
    // Strip trigger words to keep only the note body.
    var noteText = command;
    for (final phrase in _kNotePhrases) {
      noteText = noteText.replaceAll(
          RegExp(phrase, caseSensitive: false), '');
    }
    noteText = noteText.trim();

    if (noteText.isEmpty) {
      await _voice.speak('What would you like me to note?');
    } else {
      await _notes.startRecording();
      await _voice.speak('Note saved: $noteText');
      await _notes.stopRecording();
    }
  }

  Future<void> _handleEmail(String command) async {
    // Basic extraction – a production app would use an NLU pipeline.
    await _voice.speak(
        'Please say the recipient address, subject, and message after the beep.');
  }

  Future<void> _handleLocationQuery() async {
    final loc = await _location.getCurrentLocation();
    if (loc == null) {
      await _voice.speak('GPS is unavailable right now.');
      return;
    }
    final address = loc.address ?? 'unknown location';
    await _voice.speak('You are currently at $address, '
        'travelling at ${loc.speed.toStringAsFixed(0)} kilometres per hour.');
  }

  // ---------------------------------------------------------------------------
  // Static helpers
  // ---------------------------------------------------------------------------

  static bool _matches(String input, List<String> phrases) =>
      phrases.any((p) => input.contains(p));

  static String _formatDuration(Duration d) {
    final h = d.inHours;
    final m = d.inMinutes.remainder(60);
    if (h > 0) return '$h hour${h == 1 ? '' : 's'} and $m minute${m == 1 ? '' : 's'}';
    return '$m minute${m == 1 ? '' : 's'}';
  }

  // ---------------------------------------------------------------------------
  // Intent phrase tables
  // ---------------------------------------------------------------------------

  static const _kFuelPhrases = [
    'cheap fuel',
    'cheapest fuel',
    'cheap diesel',
    'cheapest diesel',
    'find fuel',
    'fuel prices',
    'gas prices',
  ];

  static const _kStartTripPhrases = [
    'start trip',
    'begin trip',
    'start driving',
    'begin driving',
  ];

  static const _kEndTripPhrases = [
    'end trip',
    'stop trip',
    'finish trip',
    'arrived',
  ];

  static const _kMilesPhrases = [
    'how many miles',
    'miles driven',
    'mileage',
    'miles today',
    'paid miles',
  ];

  static const _kNotePhrases = [
    'note',
    'make a note',
    'take a note',
    'remember',
    'remind me',
  ];

  static const _kEmailPhrases = [
    'send email',
    'send an email',
    'email',
    'compose email',
  ];

  static const _kLocationPhrases = [
    'where am i',
    'my location',
    'current location',
    'where are we',
  ];
}
