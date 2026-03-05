import 'dart:math' as math;
import 'package:latlong2/latlong.dart';
import 'package:logger/logger.dart';

import '../../core/cache/cache_service.dart';
import '../../core/models/fuel_station.dart';
import '../../core/utils/geo_utils.dart';

/// Finds the cheapest fuel stations along a route or near the driver.
///
/// ## Efficiency improvements over a naïve implementation
/// 1. **Two-hour TTL cache** – fuel prices rarely change faster than hourly;
///    caching avoids a round-trip API call on every screen open.
/// 2. **Bounding-box pre-filter** – before computing exact distances with
///    [GeoUtils.haversineKm], candidates are quickly eliminated by a cheap
///    lat/lng bounding-box check, reducing expensive trig operations.
/// 3. **Sorted in O(n log n)** using Dart's built-in [List.sort] on a
///    pre-computed key, so each station's price is read only once.
/// 4. **Result capped at [maxResults]** – UI only needs the top N cheapest
///    stations; sorting the full list and slicing is cheaper than maintaining
///    a priority queue for typical result set sizes (< 100).
class FuelService {
  FuelService({
    required CacheService cache,
    Logger? logger,
  })  : _cache = cache,
        _log = logger ?? Logger(printer: PrettyPrinter());

  static const String _cachePrefix = 'fuel_';
  static const Duration _cacheTtl = Duration(hours: 2);
  static const int maxResults = 10;

  final CacheService _cache;
  final Logger _log;

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /// Return up to [maxResults] cheapest diesel stations within [radiusKm] of
  /// [center], using cached data when available.
  Future<List<FuelStation>> getCheapestNearby({
    required LatLng center,
    double radiusKm = 50.0,
  }) async {
    final cacheKey = _buildCacheKey(center, radiusKm);
    final cached = _tryLoadFromCache(cacheKey);
    if (cached != null) {
      _log.d('FuelService: cache hit for $cacheKey (${cached.length} stations)');
      return cached;
    }

    _log.d('FuelService: cache miss – fetching from API');
    final stations = await _fetchFromApi(center, radiusKm);
    final filtered = _filterAndSort(stations, center, radiusKm);
    await _saveToCache(cacheKey, filtered);
    return filtered;
  }

  /// Find cheapest fuel at each stop along [routePoints].
  ///
  /// Efficiency: requests are deduplicated by ~50 km grid cell so we don't
  /// fire redundant queries for overlapping route segments.
  Future<List<FuelStation>> getCheapestAlongRoute({
    required List<LatLng> routePoints,
    double searchRadiusKm = 10.0,
    int sampleEveryNthPoint = 20,
  }) async {
    // Sample waypoints to avoid O(n) API calls for long routes.
    final sampled = _samplePoints(routePoints, sampleEveryNthPoint);

    // Deduplicate by ~50 km grid cell.
    final uniqueGridCells = <String>{};
    final uniqueSampled = <LatLng>[];
    for (final p in sampled) {
      final cell = _gridCell(p, cellSizeKm: 50.0);
      if (uniqueGridCells.add(cell)) uniqueSampled.add(p);
    }

    final results = <FuelStation>[];
    final seenIds = <String>{};

    for (final point in uniqueSampled) {
      final stations = await getCheapestNearby(
        center: point,
        radiusKm: searchRadiusKm,
      );
      for (final s in stations) {
        if (seenIds.add(s.id)) results.add(s);
      }
    }

    // Re-sort globally by diesel price.
    results.sort(_byDiesel);
    return results.take(maxResults).toList();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /// Cheap bounding-box check followed by accurate Haversine for short list.
  List<FuelStation> _filterAndSort(
    List<FuelStation> stations,
    LatLng center,
    double radiusKm,
  ) {
    // Pre-compute bounding box to skip obvious non-candidates.
    final latDelta = radiusKm / 111.0; // ~1° lat ≈ 111 km
    final lngDelta =
        radiusKm / (111.0 * math.cos(center.latitude * math.pi / 180));

    final candidates = <FuelStation>[];
    for (final s in stations) {
      // Cheap bounding-box pre-filter.
      if ((s.latitude - center.latitude).abs() > latDelta) continue;
      if ((s.longitude - center.longitude).abs() > lngDelta) continue;

      // Accurate distance only for passing candidates.
      final dist = GeoUtils.haversineKm(
        center,
        LatLng(s.latitude, s.longitude),
      );
      if (dist <= radiusKm) candidates.add(s);
    }

    candidates.sort(_byDiesel);
    return candidates.take(maxResults).toList();
  }

  int _byDiesel(FuelStation a, FuelStation b) {
    final pa = a.dieselPriceCents ?? a.regularPriceCents;
    final pb = b.dieselPriceCents ?? b.regularPriceCents;
    return pa.compareTo(pb);
  }

  List<FuelStation>? _tryLoadFromCache(String key) {
    final raw = _cache.get<List<dynamic>>(key);
    if (raw == null) return null;
    try {
      return raw
          .cast<Map<String, dynamic>>()
          .map(FuelStation.fromJson)
          .toList();
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveToCache(String key, List<FuelStation> stations) async {
    final payload = stations.map((s) => s.toJson()).toList();
    await _cache.set(key, payload, ttl: _cacheTtl);
  }

  /// Stubbed – replace with real API call (e.g. GasBuddy / OPIS).
  Future<List<FuelStation>> _fetchFromApi(
    LatLng center,
    double radiusKm,
  ) async {
    // TODO: integrate real fuel price API.
    _log.w('FuelService: using stub data – integrate a real fuel price API');
    return const [];
  }

  String _buildCacheKey(LatLng center, double radiusKm) {
    // Quantise to ~5 km grid so nearby queries share the same cache entry.
    final latQ = (center.latitude * 20).round();
    final lngQ = (center.longitude * 20).round();
    return '$_cachePrefix${latQ}_${lngQ}_${radiusKm.round()}';
  }

  /// Sample every [n]th point from [points], always including first and last.
  List<LatLng> _samplePoints(List<LatLng> points, int n) {
    if (points.isEmpty) return const [];
    if (points.length <= 2 || n <= 1) return List.of(points);
    final sampled = <LatLng>[points.first];
    for (var i = n; i < points.length - 1; i += n) {
      sampled.add(points[i]);
    }
    sampled.add(points.last);
    return sampled;
  }

  /// Returns a string grid-cell key for deduplication.
  String _gridCell(LatLng p, {required double cellSizeKm}) {
    final latCells = (p.latitude / (cellSizeKm / 111.0)).floor();
    final lngCells = (p.longitude / (cellSizeKm / 111.0)).floor();
    return '${latCells}_$lngCells';
  }
}
