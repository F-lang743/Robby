/// A mileage log entry recorded during a trip.
class MileageEntry {
  const MileageEntry({
    required this.id,
    required this.startLatitude,
    required this.startLongitude,
    required this.endLatitude,
    required this.endLongitude,
    required this.distanceKm,
    required this.startTime,
    required this.endTime,
    this.isPaid = false,
    this.loadId,
    this.notes,
  });

  final String id;
  final double startLatitude;
  final double startLongitude;
  final double endLatitude;
  final double endLongitude;

  /// Accumulated trip distance in kilometres.
  final double distanceKm;

  final DateTime startTime;
  final DateTime endTime;

  /// Whether this mileage is compensated by a load/carrier.
  final bool isPaid;

  /// Optional load or dispatch identifier.
  final String? loadId;

  final String? notes;

  double get distanceMiles => distanceKm * 0.621371;
  Duration get duration => endTime.difference(startTime);

  Map<String, dynamic> toJson() => {
        'id': id,
        'startLatitude': startLatitude,
        'startLongitude': startLongitude,
        'endLatitude': endLatitude,
        'endLongitude': endLongitude,
        'distanceKm': distanceKm,
        'startTime': startTime.toIso8601String(),
        'endTime': endTime.toIso8601String(),
        'isPaid': isPaid,
        'loadId': loadId,
        'notes': notes,
      };

  factory MileageEntry.fromJson(Map<String, dynamic> json) => MileageEntry(
        id: json['id'] as String,
        startLatitude: (json['startLatitude'] as num).toDouble(),
        startLongitude: (json['startLongitude'] as num).toDouble(),
        endLatitude: (json['endLatitude'] as num).toDouble(),
        endLongitude: (json['endLongitude'] as num).toDouble(),
        distanceKm: (json['distanceKm'] as num).toDouble(),
        startTime: DateTime.parse(json['startTime'] as String),
        endTime: DateTime.parse(json['endTime'] as String),
        isPaid: json['isPaid'] as bool? ?? false,
        loadId: json['loadId'] as String?,
        notes: json['notes'] as String?,
      );
}
