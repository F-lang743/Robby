import 'package:flutter_test/flutter_test.dart';
import 'package:latlong2/latlong.dart';

import 'package:robby/core/models/fuel_station.dart';
import 'package:robby/core/models/mileage_entry.dart';
import 'package:robby/core/models/note_model.dart';
import 'package:robby/core/models/location_model.dart';

void main() {
  group('FuelStation', () {
    const station = FuelStation(
      id: 's1',
      name: 'Pilot Travel Center',
      address: '123 Highway Rd',
      latitude: 35.0,
      longitude: -90.0,
      regularPriceCents: 349,
      dieselPriceCents: 389,
    );

    test('price conversions are correct', () {
      expect(station.regularPriceDollars, closeTo(3.49, 0.001));
      expect(station.dieselPriceDollars, closeTo(3.89, 0.001));
    });

    test('round-trips through JSON', () {
      final json = station.toJson();
      final restored = FuelStation.fromJson(json);
      expect(restored.id, station.id);
      expect(restored.name, station.name);
      expect(restored.dieselPriceCents, station.dieselPriceCents);
    });

    test('isCacheStale is true without fetchedAt', () {
      expect(station.isCacheStale, isTrue);
    });

    test('isCacheStale is false for recent fetchedAt', () {
      final fresh = FuelStation(
        id: 's2',
        name: 'TA',
        address: '456 Road',
        latitude: 35.0,
        longitude: -90.0,
        regularPriceCents: 340,
        fetchedAt: DateTime.now(),
      );
      expect(fresh.isCacheStale, isFalse);
    });
  });

  group('MileageEntry', () {
    final entry = MileageEntry(
      id: 'e1',
      startLatitude: 35.0,
      startLongitude: -90.0,
      endLatitude: 36.0,
      endLongitude: -91.0,
      distanceKm: 150.0,
      startTime: DateTime(2026, 1, 1, 8, 0),
      endTime: DateTime(2026, 1, 1, 10, 30),
      isPaid: true,
    );

    test('distanceMiles conversion is correct', () {
      expect(entry.distanceMiles, closeTo(93.2, 0.1));
    });

    test('duration is correct', () {
      expect(entry.duration, const Duration(hours: 2, minutes: 30));
    });

    test('round-trips through JSON', () {
      final json = entry.toJson();
      final restored = MileageEntry.fromJson(json);
      expect(restored.id, entry.id);
      expect(restored.distanceKm, entry.distanceKm);
      expect(restored.isPaid, isTrue);
    });
  });

  group('NoteModel', () {
    final note = NoteModel(
      id: 'n1',
      text: 'Pick up load at dock 4',
      createdAt: DateTime(2026, 1, 1, 9, 0),
      latitude: 35.0,
      longitude: -90.0,
    );

    test('hasLocation is true when coordinates present', () {
      expect(note.hasLocation, isTrue);
    });

    test('hasLocation is false without coordinates', () {
      final noLoc = NoteModel(
        id: 'n2',
        text: 'Test',
        createdAt: DateTime.now(),
      );
      expect(noLoc.hasLocation, isFalse);
    });

    test('round-trips through JSON', () {
      final json = note.toJson();
      final restored = NoteModel.fromJson(json);
      expect(restored.id, note.id);
      expect(restored.text, note.text);
      expect(restored.latitude, note.latitude);
    });
  });

  group('LocationModel', () {
    final loc = LocationModel(
      position: const LatLng(40.7128, -74.0060),
      speed: 90.0,
      heading: 180.0,
      timestamp: DateTime(2026, 1, 1, 12, 0),
      address: '123 Main St, New York',
    );

    test('round-trips through JSON', () {
      final json = loc.toJson();
      final restored = LocationModel.fromJson(json);
      expect(restored.position.latitude, loc.position.latitude);
      expect(restored.speed, loc.speed);
      expect(restored.address, loc.address);
    });

    test('copyWith preserves fields and updates address', () {
      final updated = loc.copyWith(address: 'New Address');
      expect(updated.address, 'New Address');
      expect(updated.speed, loc.speed);
    });
  });
}
