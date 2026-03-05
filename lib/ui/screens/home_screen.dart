import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/cache/cache_service.dart';
import '../../features/assistant/voice_assistant.dart';
import '../../features/email/email_service.dart';
import '../../features/fuel/fuel_service.dart';
import '../../features/gps/location_service.dart';
import '../../features/mileage/mileage_service.dart';
import '../../features/navigation/navigation_service.dart';
import '../../features/notes/notes_service.dart';
import '../../features/voice/voice_service.dart';

/// Riverpod providers –  created once, shared across the widget tree.
final _voiceServiceProvider = Provider<VoiceService>((ref) {
  final service = VoiceService();
  ref.onDispose(service.dispose);
  return service;
});

final _locationServiceProvider = Provider<LocationService>((ref) {
  final service = LocationService();
  ref.onDispose(service.dispose);
  return service;
});

final _cacheProvider = Provider<CacheService>((ref) => CacheService.instance);

final _fuelServiceProvider = Provider<FuelService>((ref) {
  return FuelService(cache: ref.watch(_cacheProvider));
});

final _navigationServiceProvider = Provider<NavigationService>((ref) {
  return NavigationService(cache: ref.watch(_cacheProvider));
});

final _notesServiceProvider = Provider<NotesService>((ref) {
  return NotesService(
    voiceService: ref.watch(_voiceServiceProvider),
    cache: ref.watch(_cacheProvider),
  );
});

final _emailServiceProvider = Provider<EmailService>((ref) => EmailService());

final _mileageServiceProvider = Provider<MileageService>((ref) {
  return MileageService(
    locationService: ref.watch(_locationServiceProvider),
    cache: ref.watch(_cacheProvider),
  );
});

final assistantProvider = Provider<VoiceAssistant>((ref) {
  final assistant = VoiceAssistant(
    voice: ref.watch(_voiceServiceProvider),
    location: ref.watch(_locationServiceProvider),
    fuel: ref.watch(_fuelServiceProvider),
    navigation: ref.watch(_navigationServiceProvider),
    notes: ref.watch(_notesServiceProvider),
    email: ref.watch(_emailServiceProvider),
    mileage: ref.watch(_mileageServiceProvider),
  );
  ref.onDispose(assistant.stop);
  return assistant;
});

/// Home screen – a single large mic button that activates the assistant.
///
/// Design principle: minimal on-screen elements to reduce driver distraction.
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with WidgetsBindingObserver {
  VoiceAssistant? _assistant;
  bool _isReady = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initAssistant();
  }

  Future<void> _initAssistant() async {
    final voice = ref.read(_voiceServiceProvider);
    await voice.init();
    if (mounted) setState(() => _isReady = true);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Pause GPS and voice when the app goes to background to save battery.
    if (state == AppLifecycleState.paused) {
      _assistant?.stop();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  Future<void> _toggleAssistant() async {
    final assistant = ref.read(assistantProvider);
    if (assistant.isActive) {
      await assistant.stop();
    } else {
      await assistant.start();
    }
    setState(() => _assistant = assistant);
  }

  @override
  Widget build(BuildContext context) {
    final assistant = ref.watch(assistantProvider);
    final isActive = assistant.isActive;

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(),
            // Status indicator
            Text(
              isActive ? 'Robby is listening…' : 'Tap to activate Robby',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: isActive ? Colors.greenAccent : Colors.white70,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),
            // Large mic button – easy to tap while driving.
            GestureDetector(
              onTap: _isReady ? _toggleAssistant : null,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isActive
                      ? const Color(0xFF1E88E5)
                      : Colors.white.withValues(alpha: 0.1),
                  boxShadow: isActive
                      ? [
                          BoxShadow(
                            color: const Color(0xFF1E88E5).withValues(alpha: 0.5),
                            blurRadius: 40,
                            spreadRadius: 10,
                          )
                        ]
                      : null,
                ),
                child: Icon(
                  isActive ? Icons.mic : Icons.mic_off,
                  size: 80,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 32),
            // Quick-action hints
            if (!isActive)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 8,
                  runSpacing: 8,
                  children: const [
                    _HintChip('Find cheap fuel'),
                    _HintChip('Start trip'),
                    _HintChip('How many miles?'),
                    _HintChip('Take a note'),
                    _HintChip('Where am I?'),
                  ],
                ),
              ),
            const Spacer(),
            if (!_isReady)
              const Padding(
                padding: EdgeInsets.all(16),
                child: LinearProgressIndicator(),
              ),
          ],
        ),
      ),
    );
  }
}

/// A small hint chip shown when the assistant is inactive.
class _HintChip extends StatelessWidget {
  const _HintChip(this.label);
  final String label;

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(label, style: const TextStyle(fontSize: 14)),
      backgroundColor: Colors.white10,
    );
  }
}
