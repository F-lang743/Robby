import 'package:latlong2/latlong.dart';

/// Immutable snapshot of a driver's position.
class LocationModel {
  const LocationModel({
    required this.position,
    required this.speed,
    required this.heading,
    required this.timestamp,
    this.address,
  });

  final LatLng position;

  /// Speed in km/h.
  final double speed;

  /// Compass heading in degrees (0–360).
  final double heading;

  final DateTime timestamp;

  /// Reverse-geocoded street address (optional, filled lazily).
  final String? address;

  LocationModel copyWith({String? address}) => LocationModel(
        position: position,
        speed: speed,
        heading: heading,
        timestamp: timestamp,
        address: address ?? this.address,
      );

  Map<String, dynamic> toJson() => {
        'lat': position.latitude,
        'lng': position.longitude,
        'speed': speed,
        'heading': heading,
        'timestamp': timestamp.toIso8601String(),
        'address': address,
      };

  factory LocationModel.fromJson(Map<String, dynamic> json) => LocationModel(
        position: LatLng(
          (json['lat'] as num).toDouble(),
          (json['lng'] as num).toDouble(),
        ),
        speed: (json['speed'] as num).toDouble(),
        heading: (json['heading'] as num).toDouble(),
        timestamp: DateTime.parse(json['timestamp'] as String),
        address: json['address'] as String?,
      );

  @override
  String toString() =>
      'LocationModel(lat=${position.latitude}, lng=${position.longitude}, '
      'speed=$speed km/h, heading=$heading°)';
}
