import 'dart:math' as math;
import 'package:latlong2/latlong.dart';

/// Pure utility functions that are safe to run inside [Isolate] / [compute].
///
/// All methods are static so they carry no state and can be sent across
/// isolate boundaries without serialisation overhead.
class GeoUtils {
  GeoUtils._();

  /// Earth radius in kilometres (mean).
  static const double _earthRadiusKm = 6371.0;

  /// Haversine great-circle distance between two coordinates in **kilometres**.
  ///
  /// Efficiency: purely arithmetic – O(1), no allocations.
  static double haversineKm(LatLng a, LatLng b) {
    final dLat = _toRad(b.latitude - a.latitude);
    final dLng = _toRad(b.longitude - a.longitude);
    final sinDLat = math.sin(dLat / 2);
    final sinDLng = math.sin(dLng / 2);
    final h = sinDLat * sinDLat +
        math.cos(_toRad(a.latitude)) *
            math.cos(_toRad(b.latitude)) *
            sinDLng *
            sinDLng;
    return 2 * _earthRadiusKm * math.asin(math.sqrt(h));
  }

  /// Haversine distance in **miles**.
  static double haversineMiles(LatLng a, LatLng b) =>
      haversineKm(a, b) * 0.621371;

  /// Initial bearing from [a] to [b] in degrees (0–360).
  static double bearingDeg(LatLng a, LatLng b) {
    final dLng = _toRad(b.longitude - a.longitude);
    final y = math.sin(dLng) * math.cos(_toRad(b.latitude));
    final x = math.cos(_toRad(a.latitude)) * math.sin(_toRad(b.latitude)) -
        math.sin(_toRad(a.latitude)) *
            math.cos(_toRad(b.latitude)) *
            math.cos(dLng);
    return (_toDeg(math.atan2(y, x)) + 360) % 360;
  }

  /// Returns the total distance of a polyline in kilometres.
  ///
  /// Runs in O(n) time with no extra heap allocations – suitable for running
  /// inside [compute] for long routes.
  static double polylineLengthKm(List<LatLng> points) {
    if (points.length < 2) return 0.0;
    var total = 0.0;
    for (var i = 0; i < points.length - 1; i++) {
      total += haversineKm(points[i], points[i + 1]);
    }
    return total;
  }

  static double _toRad(double deg) => deg * math.pi / 180;
  static double _toDeg(double rad) => rad * 180 / math.pi;
}
