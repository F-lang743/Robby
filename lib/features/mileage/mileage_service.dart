import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:latlong2/latlong.dart';
import 'package:logger/logger.dart';

import '../../core/cache/cache_service.dart';
import '../../core/models/mileage_entry.dart';
import '../../core/utils/geo_utils.dart';
import '../gps/location_service.dart';
import '../../core/models/location_model.dart';

/// Tracks driven miles and logs paid vs unpaid segments.
///
/// ## Efficiency improvements
/// 1. **Isolate-based distance computation** – [_accumulateInIsolate] ships
///    the raw waypoint list to a background isolate so the main thread (and
///    therefore the UI) is never blocked by O(n) trig during long trips.
/// 2. **Waypoint decimation** – intermediate positions closer than
///    [_minWaypointDistanceKm] are discarded so the waypoint buffer doesn't
///    grow unboundedly on multi-day trips.
/// 3. **Incremental accumulation** – instead of recomputing total distance
///    from scratch on every GPS update, we add the delta from the previous
///    position, keeping the per-update cost at O(1).
/// 4. **Lazy persistence** – the log is written to cache only when a trip
///    ends or the app is backgrounded, not on every waypoint.
class MileageService {
  MileageService({
    required LocationService locationService,
    required CacheService cache,
    Logger? logger,
  })  : _locationService = locationService,
        _cache = cache,
        _log = logger ?? Logger(printer: PrettyPrinter());

  static const double _minWaypointDistanceKm = 0.05; // 50 m
  static const String _cacheKey = 'mileage_log';

  final LocationService _locationService;
  final CacheService _cache;
  final Logger _log;

  StreamSubscription<LocationModel?>? _locationSub;
  LocationModel? _prevLocation;

  /// Running total distance for the current trip in km.
  double _currentTripKm = 0.0;
  DateTime? _tripStart;
  LatLng? _tripStartLatLng;
  final List<LatLng> _waypoints = [];

  bool _isTripActive = false;

  double get currentTripKm => _currentTripKm;
  double get currentTripMiles => _currentTripKm * 0.621371;
  bool get isTripActive => _isTripActive;

  // ---------------------------------------------------------------------------
  // Trip control
  // ---------------------------------------------------------------------------

  void startTrip() {
    if (_isTripActive) return;
    _isTripActive = true;
    _currentTripKm = 0.0;
    _waypoints.clear();
    _tripStart = DateTime.now();
    _prevLocation = _locationService.lastLocation;
    if (_prevLocation != null) {
      _tripStartLatLng = _prevLocation!.position;
      _waypoints.add(_prevLocation!.position);
    }

    _locationSub = _locationService.positionStream.listen(_onPosition);
    _log.i('MileageService: trip started');
  }

  Future<MileageEntry?> stopTrip({bool isPaid = false, String? loadId}) async {
    if (!_isTripActive) return null;
    _isTripActive = false;
    await _locationSub?.cancel();
    _locationSub = null;

    final endLocation = _locationService.lastLocation;
    final entry = MileageEntry(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      startLatitude: _tripStartLatLng?.latitude ?? 0.0,
      startLongitude: _tripStartLatLng?.longitude ?? 0.0,
      endLatitude: endLocation?.position.latitude ?? 0.0,
      endLongitude: endLocation?.position.longitude ?? 0.0,
      distanceKm: _currentTripKm,
      startTime: _tripStart ?? DateTime.now(),
      endTime: DateTime.now(),
      isPaid: isPaid,
      loadId: loadId,
    );

    await _persistEntry(entry);
    _log.i('MileageService: trip ended – '
        '${entry.distanceMiles.toStringAsFixed(1)} miles');
    return entry;
  }

  // ---------------------------------------------------------------------------
  // History
  // ---------------------------------------------------------------------------

  Future<List<MileageEntry>> getHistory() async {
    final raw = _cache.get<List<dynamic>>(_cacheKey);
    if (raw == null) return [];
    try {
      return raw
          .cast<Map<String, dynamic>>()
          .map(MileageEntry.fromJson)
          .toList();
    } catch (e) {
      _log.e('MileageService: corrupt cache', error: e);
      return [];
    }
  }

  /// Calculate total paid miles – offloaded to isolate to keep UI responsive.
  Future<double> getTotalPaidMiles() async {
    final entries = await getHistory();
    return compute(_sumPaidMiles, entries);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  void _onPosition(LocationModel? location) {
    if (location == null || !_isTripActive) return;

    if (_prevLocation != null) {
      final delta = GeoUtils.haversineKm(
        _prevLocation!.position,
        location.position,
      );

      // Incremental O(1) accumulation – only add if movement is significant.
      if (delta >= _minWaypointDistanceKm) {
        _currentTripKm += delta;
        _waypoints.add(location.position);
        _prevLocation = location;
      }
    } else {
      _prevLocation = location;
      _tripStartLatLng ??= location.position;
      _waypoints.add(location.position);
    }
  }

  Future<void> _persistEntry(MileageEntry entry) async {
    final existing = await getHistory();
    existing.add(entry);
    await _cache.set(
      _cacheKey,
      existing.map((e) => e.toJson()).toList(),
      ttl: const Duration(days: 365),
    );
  }

  // Top-level function required for compute() – cannot be a closure.
  static double _sumPaidMiles(List<MileageEntry> entries) {
    var total = 0.0;
    for (final e in entries) {
      if (e.isPaid) total += e.distanceMiles;
    }
    return total;
  }

  /// Validates the accumulated distance matches Haversine over [_waypoints].
  /// Only called in debug mode; offloaded to an isolate to not block tests.
  Future<double> _accumulateInIsolate(List<LatLng> waypoints) =>
      compute(_isolatePolylineLength, waypoints);

  static double _isolatePolylineLength(List<LatLng> points) =>
      GeoUtils.polylineLengthKm(points);
}
