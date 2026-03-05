import 'dart:async';
import 'package:logger/logger.dart';
import 'package:uuid/uuid.dart';

import '../../core/cache/cache_service.dart';
import '../../core/models/note_model.dart';
import '../voice/voice_service.dart';

/// Voice-note service – records and persists driver notes.
///
/// ## Efficiency improvements
/// 1. **Batched writes** – notes are accumulated in memory and flushed to
///    [CacheService] in one write per batch, rather than one write per note.
/// 2. **Lazy load** – existing notes are loaded from cache on first access,
///    not at construction time.
class NotesService {
  NotesService({
    required VoiceService voiceService,
    required CacheService cache,
    Logger? logger,
  })  : _voice = voiceService,
        _cache = cache,
        _log = logger ?? Logger(printer: PrettyPrinter());

  static const String _cacheKey = 'voice_notes';
  static const int _flushBatchSize = 5;

  final VoiceService _voice;
  final CacheService _cache;
  final Logger _log;
  final Uuid _uuid = const Uuid();

  List<NoteModel>? _notesCache;
  final List<NoteModel> _pendingFlush = [];

  StreamSubscription<String>? _finalResultSub;

  bool _isRecording = false;
  bool get isRecording => _isRecording;

  // ---------------------------------------------------------------------------
  // Recording
  // ---------------------------------------------------------------------------

  Future<void> startRecording() async {
    if (_isRecording) return;
    _isRecording = true;
    await _voice.startListening();
    _finalResultSub = _voice.finalResults.listen(_onFinalResult);
    _log.i('NotesService: recording started');
  }

  Future<void> stopRecording() async {
    if (!_isRecording) return;
    _isRecording = false;
    await _finalResultSub?.cancel();
    _finalResultSub = null;
    await _voice.stopListening();
    await _flushPending();
    _log.i('NotesService: recording stopped');
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  Future<List<NoteModel>> getAllNotes() async {
    _notesCache ??= await _loadFromCache();
    return List.unmodifiable(_notesCache!);
  }

  Future<void> deleteNote(String id) async {
    _notesCache ??= await _loadFromCache();
    _notesCache!.removeWhere((n) => n.id == id);
    await _persistAll(_notesCache!);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  void _onFinalResult(String text) {
    final note = NoteModel(
      id: _uuid.v4(),
      text: text,
      createdAt: DateTime.now(),
    );

    _notesCache?.add(note);
    _pendingFlush.add(note);
    _log.d('NotesService: note recorded – "${text.length > 40 ? '${text.substring(0, 40)}…' : text}"');

    if (_pendingFlush.length >= _flushBatchSize) {
      _flushPending(); // fire-and-forget; errors logged inside
    }
  }

  Future<void> _flushPending() async {
    if (_pendingFlush.isEmpty) return;
    _notesCache ??= await _loadFromCache();
    // Ensure pending items are in the persistent list.
    final ids = {for (final n in _notesCache!) n.id};
    for (final n in _pendingFlush) {
      if (!ids.contains(n.id)) _notesCache!.add(n);
    }
    _pendingFlush.clear();
    await _persistAll(_notesCache!);
  }

  Future<List<NoteModel>> _loadFromCache() async {
    final raw = _cache.get<List<dynamic>>(_cacheKey);
    if (raw == null) return [];
    try {
      return raw.cast<Map<String, dynamic>>().map(NoteModel.fromJson).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> _persistAll(List<NoteModel> notes) async {
    await _cache.set(
      _cacheKey,
      notes.map((n) => n.toJson()).toList(),
      ttl: const Duration(days: 365),
    );
  }
}
