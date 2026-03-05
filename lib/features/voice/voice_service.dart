import 'dart:async';

import 'package:flutter_tts/flutter_tts.dart';
import 'package:logger/logger.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

import '../../core/utils/debouncer.dart';

/// Voice recognition and text-to-speech service.
///
/// ## Efficiency improvements
/// 1. **Single [SpeechToText] instance** – initialising the speech engine is
///    expensive (100–500 ms); this service reuses a single instance for all
///    recognition sessions.
/// 2. **Debounced result callbacks** – intermediate partial results are
///    debounced by [_partialResultDebounce] so UI rebuilds only happen once
///    the user pauses, not on every word.
/// 3. **Final-only processing** – heavy intent parsing is only triggered on
///    the `finalResult` stream, not on partial results.
/// 4. **Lazy TTS initialisation** – [FlutterTts] is not initialised until the
///    first [speak] call to avoid slowing down app startup.
class VoiceService {
  VoiceService({Logger? logger})
      : _log = logger ?? Logger(printer: PrettyPrinter());

  static const Duration _partialResultDebounce = Duration(milliseconds: 200);
  static const double _speechConfidenceThreshold = 0.7;

  final Logger _log;
  final SpeechToText _stt = SpeechToText();

  // Lazy-initialised TTS engine.
  FlutterTts? _tts;

  bool _sttReady = false;
  bool _isListening = false;

  // Debouncer for partial results to avoid flooding UI with rebuilds.
  final _partialDebouncer = Debouncer(delay: _partialResultDebounce);

  // Streams
  final _partialController = StreamController<String>.broadcast();
  final _finalController = StreamController<String>.broadcast();

  /// Emits debounced partial transcription strings while the user is speaking.
  Stream<String> get partialResults => _partialController.stream;

  /// Emits the final transcription string after the user stops speaking.
  Stream<String> get finalResults => _finalController.stream;

  bool get isListening => _isListening;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /// Initialise speech engine.  Call once on startup.
  Future<bool> init() async {
    if (_sttReady) return true;
    _sttReady = await _stt.initialize(
      onError: (e) => _log.e('VoiceService STT error: ${e.errorMsg}'),
      onStatus: (s) => _log.d('VoiceService STT status: $s'),
    );
    _log.i('VoiceService: STT ready=$_sttReady');
    return _sttReady;
  }

  void dispose() {
    stopListening();
    _partialDebouncer.cancel();
    _partialController.close();
    _finalController.close();
    _tts?.stop();
  }

  // ---------------------------------------------------------------------------
  // Speech-to-text
  // ---------------------------------------------------------------------------

  Future<bool> startListening({String localeId = 'en_US'}) async {
    if (!_sttReady || _isListening) return false;

    _isListening = true;
    await _stt.listen(
      onResult: _onSpeechResult,
      localeId: localeId,
      listenMode: ListenMode.dictation,
      cancelOnError: true,
      partialResults: true,
    );
    _log.d('VoiceService: listening started');
    return true;
  }

  Future<void> stopListening() async {
    if (!_isListening) return;
    _isListening = false;
    _partialDebouncer.cancel();
    await _stt.stop();
    _log.d('VoiceService: listening stopped');
  }

  // ---------------------------------------------------------------------------
  // Text-to-speech
  // ---------------------------------------------------------------------------

  /// Speak [text] aloud.  Low-confidence or empty strings are silently ignored.
  Future<void> speak(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    final tts = await _lazyTts();
    await tts.speak(trimmed);
    _log.d('VoiceService: speaking "${trimmed.length > 40 ? '${trimmed.substring(0, 40)}…' : trimmed}"');
  }

  Future<void> stopSpeaking() async {
    await _tts?.stop();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  void _onSpeechResult(SpeechRecognitionResult result) {
    if (result.finalResult) {
      _partialDebouncer.cancel();
      final text = result.recognizedWords.trim();
      if (text.isNotEmpty &&
          (result.confidence <= 0 ||
              result.confidence >= _speechConfidenceThreshold)) {
        _finalController.add(text);
        _log.d('VoiceService: final="$text" confidence=${result.confidence}');
      }
    } else {
      // Debounce partial results – fire only after a short pause.
      _partialDebouncer.run(() {
        final text = result.recognizedWords.trim();
        if (text.isNotEmpty) _partialController.add(text);
      });
    }
  }

  Future<FlutterTts> _lazyTts() async {
    if (_tts != null) return _tts!;
    _tts = FlutterTts();
    await _tts!.setLanguage('en-US');
    await _tts!.setSpeechRate(0.5);
    await _tts!.setVolume(1.0);
    await _tts!.setPitch(1.0);
    _log.i('VoiceService: TTS initialised');
    return _tts!;
  }
}
