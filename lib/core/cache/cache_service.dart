import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// A simple key-value cache backed by [SharedPreferences] with optional TTL.
///
/// Efficiency notes:
/// - Uses a single [SharedPreferences] instance shared across the app to avoid
///   repeated async initialisation overhead.
/// - Values are stored as JSON strings with an envelope containing the expiry
///   timestamp, so a single disk read is sufficient to validate freshness.
/// - The in-memory [_memoryCache] layer avoids repeated JSON decoding for
///   values read within the same session.
class CacheService {
  CacheService._();
  static final CacheService _instance = CacheService._();
  static CacheService get instance => _instance;

  SharedPreferences? _prefs;

  /// In-memory layer avoids repeated SharedPreferences decodes.
  final Map<String, _CacheEntry> _memoryCache = {};

  Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  SharedPreferences get _safePrefs {
    assert(_prefs != null, 'CacheService.init() must be called before use.');
    return _prefs!;
  }

  // ---------------------------------------------------------------------------
  // Write
  // ---------------------------------------------------------------------------

  /// Store [value] under [key] with an optional [ttl].
  Future<void> set<T>(
    String key,
    T value, {
    Duration ttl = const Duration(hours: 2),
  }) async {
    final expiry = DateTime.now().add(ttl);
    final entry = _CacheEntry(value: value, expiry: expiry);
    _memoryCache[key] = entry;
    await _safePrefs.setString(key, jsonEncode(entry.toJson()));
  }

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------

  /// Return the cached value for [key], or `null` if absent or expired.
  T? get<T>(String key) {
    // 1. Fast path: in-memory hit
    final memEntry = _memoryCache[key];
    if (memEntry != null) {
      if (!memEntry.isExpired) return memEntry.value as T?;
      _memoryCache.remove(key);
    }

    // 2. Slow path: disk
    final raw = _safePrefs.getString(key);
    if (raw == null) return null;

    try {
      final entry = _CacheEntry.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      if (entry.isExpired) {
        _safePrefs.remove(key); // clean up stale entry
        return null;
      }
      _memoryCache[key] = entry; // warm in-memory cache
      return entry.value as T?;
    } catch (_) {
      _safePrefs.remove(key);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Delete / clear
  // ---------------------------------------------------------------------------

  Future<void> remove(String key) async {
    _memoryCache.remove(key);
    await _safePrefs.remove(key);
  }

  Future<void> clear() async {
    _memoryCache.clear();
    await _safePrefs.clear();
  }

  /// Remove all entries that match [prefix].
  Future<void> removeByPrefix(String prefix) async {
    final keysToRemove = _safePrefs.getKeys()
        .where((k) => k.startsWith(prefix))
        .toList();
    _memoryCache.removeWhere((k, _) => k.startsWith(prefix));
    for (final key in keysToRemove) {
      await _safePrefs.remove(key);
    }
  }

  bool containsKey(String key) {
    if (_memoryCache.containsKey(key)) {
      return !_memoryCache[key]!.isExpired;
    }
    return _safePrefs.containsKey(key);
  }
}

class _CacheEntry {
  const _CacheEntry({required this.value, required this.expiry});

  final dynamic value;
  final DateTime expiry;

  bool get isExpired => DateTime.now().isAfter(expiry);

  Map<String, dynamic> toJson() => {
        'value': value,
        'expiry': expiry.toIso8601String(),
      };

  factory _CacheEntry.fromJson(Map<String, dynamic> json) => _CacheEntry(
        value: json['value'],
        expiry: DateTime.parse(json['expiry'] as String),
      );
}
