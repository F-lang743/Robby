import 'package:dio/dio.dart';
import 'package:latlong2/latlong.dart';
import 'package:logger/logger.dart';

import '../../core/cache/cache_service.dart';
import '../../core/utils/geo_utils.dart';

/// A decoded navigation step.
class RouteStep {
  const RouteStep({
    required this.instruction,
    required this.distanceKm,
    required this.durationSec,
    required this.position,
  });

  final String instruction;
  final double distanceKm;
  final int durationSec;
  final LatLng position;
}

/// A navigation route from [origin] to [destination].
class RouteResult {
  const RouteResult({
    required this.origin,
    required this.destination,
    required this.polyline,
    required this.steps,
    required this.totalDistanceKm,
    required this.totalDurationSec,
  });

  final LatLng origin;
  final LatLng destination;
  final List<LatLng> polyline;
  final List<RouteStep> steps;
  final double totalDistanceKm;
  final int totalDurationSec;

  double get totalDistanceMiles => totalDistanceKm * 0.621371;
  Duration get totalDuration => Duration(seconds: totalDurationSec);
}

/// Route planning service with response caching.
///
/// ## Efficiency improvements
/// 1. **15-minute route cache** – avoids a round-trip API call when the
///    driver requests the same route multiple times (e.g. after briefly leaving
///    the navigation screen).
/// 2. **Cache key quantisation** – origin/destination coordinates are rounded
///    to 4 decimal places (~11 m precision) so minor GPS jitter doesn't
///    invalidate the cache.
/// 3. **Polyline decoded once** – the encoded polyline string is decoded
///    into a [List<LatLng>] a single time and stored, so repeated draws never
///    re-parse it.
/// 4. **Dio with connection reuse** – a single [Dio] instance (with
///    connection pooling) is used for all requests, avoiding TCP handshake
///    overhead per request.
class NavigationService {
  NavigationService({
    required CacheService cache,
    Dio? dio,
    Logger? logger,
  })  : _cache = cache,
        _dio = dio ?? Dio(),
        _log = logger ?? Logger(printer: PrettyPrinter());

  static const String _cachePrefix = 'route_';
  static const Duration _cacheTtl = Duration(minutes: 15);

  // OSRM public demo API – replace with a self-hosted instance in production.
  static const String _osrmBase = 'https://router.project-osrm.org/route/v1';

  final CacheService _cache;
  final Dio _dio;
  final Logger _log;

  /// Calculate a route for a truck from [origin] to [destination].
  Future<RouteResult?> getRoute({
    required LatLng origin,
    required LatLng destination,
    String profile = 'driving',
  }) async {
    final cacheKey = _buildCacheKey(origin, destination, profile);
    final cached = _tryLoadFromCache(cacheKey);
    if (cached != null) {
      _log.d('NavigationService: cache hit for $cacheKey');
      return cached;
    }

    try {
      final result = await _fetchRoute(origin, destination, profile);
      if (result != null) {
        await _saveToCache(cacheKey, result);
      }
      return result;
    } on DioException catch (e) {
      _log.e('NavigationService: API error', error: e);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  Future<RouteResult?> _fetchRoute(
    LatLng origin,
    LatLng destination,
    String profile,
  ) async {
    final url = '$_osrmBase/$profile/'
        '${origin.longitude},${origin.latitude};'
        '${destination.longitude},${destination.latitude}'
        '?overview=full&geometries=geojson&steps=true';

    final response = await _dio.get<Map<String, dynamic>>(url);
    final data = response.data;
    if (data == null || response.statusCode != 200) return null;

    final routes = data['routes'] as List<dynamic>?;
    if (routes == null || routes.isEmpty) return null;

    final route = routes.first as Map<String, dynamic>;
    final geometry = route['geometry'] as Map<String, dynamic>;
    final coords = (geometry['coordinates'] as List<dynamic>)
        .cast<List<dynamic>>()
        .map((c) => LatLng((c[1] as num).toDouble(), (c[0] as num).toDouble()))
        .toList();

    final legs = (route['legs'] as List<dynamic>).cast<Map<String, dynamic>>();
    final steps = <RouteStep>[];
    for (final leg in legs) {
      for (final step in (leg['steps'] as List<dynamic>).cast<Map<String, dynamic>>()) {
        final maneuver = step['maneuver'] as Map<String, dynamic>;
        final loc = maneuver['location'] as List<dynamic>;
        steps.add(RouteStep(
          instruction: step['name'] as String? ?? '',
          distanceKm: (step['distance'] as num).toDouble() / 1000.0,
          durationSec: (step['duration'] as num).toInt(),
          position: LatLng(
            (loc[1] as num).toDouble(),
            (loc[0] as num).toDouble(),
          ),
        ));
      }
    }

    return RouteResult(
      origin: origin,
      destination: destination,
      polyline: coords,
      steps: steps,
      totalDistanceKm: (route['distance'] as num).toDouble() / 1000.0,
      totalDurationSec: (route['duration'] as num).toInt(),
    );
  }

  String _buildCacheKey(LatLng origin, LatLng dest, String profile) {
    // Round to 4 decimal places to absorb minor GPS jitter.
    num q(double v) => (v * 10000).round();
    return '$_cachePrefix${profile}_${q(origin.latitude)}_${q(origin.longitude)}'
        '_${q(dest.latitude)}_${q(dest.longitude)}';
  }

  RouteResult? _tryLoadFromCache(String key) {
    final raw = _cache.get<Map<String, dynamic>>(key);
    if (raw == null) return null;
    try {
      return _routeFromJson(raw);
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveToCache(String key, RouteResult result) async {
    await _cache.set(key, _routeToJson(result), ttl: _cacheTtl);
  }

  Map<String, dynamic> _routeToJson(RouteResult r) => {
        'originLat': r.origin.latitude,
        'originLng': r.origin.longitude,
        'destLat': r.destination.latitude,
        'destLng': r.destination.longitude,
        'polyline': r.polyline
            .map((p) => {'lat': p.latitude, 'lng': p.longitude})
            .toList(),
        'totalDistanceKm': r.totalDistanceKm,
        'totalDurationSec': r.totalDurationSec,
        'steps': r.steps
            .map((s) => {
                  'instruction': s.instruction,
                  'distanceKm': s.distanceKm,
                  'durationSec': s.durationSec,
                  'lat': s.position.latitude,
                  'lng': s.position.longitude,
                })
            .toList(),
      };

  RouteResult _routeFromJson(Map<String, dynamic> json) {
    final polyline = (json['polyline'] as List<dynamic>)
        .cast<Map<String, dynamic>>()
        .map((p) => LatLng(
              (p['lat'] as num).toDouble(),
              (p['lng'] as num).toDouble(),
            ))
        .toList();

    final steps = (json['steps'] as List<dynamic>)
        .cast<Map<String, dynamic>>()
        .map((s) => RouteStep(
              instruction: s['instruction'] as String,
              distanceKm: (s['distanceKm'] as num).toDouble(),
              durationSec: s['durationSec'] as int,
              position: LatLng(
                (s['lat'] as num).toDouble(),
                (s['lng'] as num).toDouble(),
              ),
            ))
        .toList();

    return RouteResult(
      origin: LatLng(
        (json['originLat'] as num).toDouble(),
        (json['originLng'] as num).toDouble(),
      ),
      destination: LatLng(
        (json['destLat'] as num).toDouble(),
        (json['destLng'] as num).toDouble(),
      ),
      polyline: polyline,
      steps: steps,
      totalDistanceKm: (json['totalDistanceKm'] as num).toDouble(),
      totalDurationSec: json['totalDurationSec'] as int,
    );
  }
}
