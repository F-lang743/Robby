import 'package:flutter_test/flutter_test.dart';
import 'package:latlong2/latlong.dart';

import 'package:robby/core/utils/geo_utils.dart';

void main() {
  group('GeoUtils', () {
    // Known reference: New York City → Los Angeles ≈ 3940 km
    const nyc = LatLng(40.7128, -74.0060);
    const la = LatLng(34.0522, -118.2437);

    test('haversineKm returns approximate NYC–LA distance', () {
      final km = GeoUtils.haversineKm(nyc, la);
      // Accepted tolerance: ±1 % of known value (~3940 km)
      expect(km, closeTo(3940, 40));
    });

    test('haversineMiles is consistent with haversineKm', () {
      final km = GeoUtils.haversineKm(nyc, la);
      final miles = GeoUtils.haversineMiles(nyc, la);
      expect(miles, closeTo(km * 0.621371, 0.1));
    });

    test('haversineKm returns 0 for identical points', () {
      expect(GeoUtils.haversineKm(nyc, nyc), 0.0);
    });

    test('polylineLengthKm returns 0 for single point', () {
      expect(GeoUtils.polylineLengthKm([nyc]), 0.0);
    });

    test('polylineLengthKm returns 0 for empty list', () {
      expect(GeoUtils.polylineLengthKm([]), 0.0);
    });

    test('polylineLengthKm accumulates segments correctly', () {
      // Three collinear-ish points: NYC → midpoint → LA
      final mid = LatLng((nyc.latitude + la.latitude) / 2,
          (nyc.longitude + la.longitude) / 2);
      final total = GeoUtils.polylineLengthKm([nyc, mid, la]);
      final direct = GeoUtils.haversineKm(nyc, la);
      // Polyline via midpoint should be slightly longer than the direct path.
      expect(total, greaterThanOrEqualTo(direct));
      // But not by more than 1 % on such a short detour.
      expect(total, lessThan(direct * 1.01));
    });

    test('bearingDeg returns roughly east for two same-latitude points', () {
      const a = LatLng(40.0, 0.0);
      const b = LatLng(40.0, 10.0); // due east
      final bearing = GeoUtils.bearingDeg(a, b);
      // True east bearing at mid-latitudes varies slightly; accept ±5°.
      expect(bearing, closeTo(90, 5));
    });
  });
}
