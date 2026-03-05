/// A fuel station with pricing information.
class FuelStation {
  const FuelStation({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.regularPriceCents,
    this.dieselPriceCents,
    this.truckParking = false,
    this.hasScales = false,
    this.fetchedAt,
  });

  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;

  /// Regular unleaded price in cents.
  final int regularPriceCents;

  /// Diesel price in cents – most relevant for truck drivers.
  final int? dieselPriceCents;

  /// Whether the station offers truck parking.
  final bool truckParking;

  /// Whether the station has truck weigh scales.
  final bool hasScales;

  /// When this data was fetched (used to validate cache freshness).
  final DateTime? fetchedAt;

  double get regularPriceDollars => regularPriceCents / 100.0;
  double? get dieselPriceDollars =>
      dieselPriceCents != null ? dieselPriceCents! / 100.0 : null;

  bool get isCacheStale {
    if (fetchedAt == null) return true;
    return DateTime.now().difference(fetchedAt!) > const Duration(hours: 2);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'regularPriceCents': regularPriceCents,
        'dieselPriceCents': dieselPriceCents,
        'truckParking': truckParking,
        'hasScales': hasScales,
        'fetchedAt': fetchedAt?.toIso8601String(),
      };

  factory FuelStation.fromJson(Map<String, dynamic> json) => FuelStation(
        id: json['id'] as String,
        name: json['name'] as String,
        address: json['address'] as String,
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        regularPriceCents: json['regularPriceCents'] as int,
        dieselPriceCents: json['dieselPriceCents'] as int?,
        truckParking: json['truckParking'] as bool? ?? false,
        hasScales: json['hasScales'] as bool? ?? false,
        fetchedAt: json['fetchedAt'] != null
            ? DateTime.parse(json['fetchedAt'] as String)
            : null,
      );
}
