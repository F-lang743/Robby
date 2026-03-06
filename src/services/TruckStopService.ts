import {TruckStop, Location} from '../types';
import {LocationService} from './LocationService';

export class TruckStopService {
  // Mock data for demonstration
  private static mockTruckStops: TruckStop[] = [
    {
      id: '1',
      name: "Love's Travel Stop",
      address: '1234 Highway 40, Denver, CO',
      location: {latitude: 39.7392, longitude: -104.9903},
      amenities: ['Fuel', 'Parking', 'Showers', 'Restaurant', 'WiFi'],
    },
    {
      id: '2',
      name: 'Pilot Flying J',
      address: '5678 Interstate 80, Cheyenne, WY',
      location: {latitude: 41.1400, longitude: -104.8202},
      amenities: ['Fuel', 'Parking', 'Showers', 'Store'],
    },
    {
      id: '3',
      name: 'TA Travel Center',
      address: '9012 Route 66, Albuquerque, NM',
      location: {latitude: 35.0844, longitude: -106.6504},
      amenities: ['Fuel', 'Parking', 'Showers', 'Restaurant', 'Laundry', 'WiFi'],
    },
    {
      id: '4',
      name: 'Petro Stopping Center',
      address: '3456 I-70, Kansas City, MO',
      location: {latitude: 39.0997, longitude: -94.5786},
      amenities: ['Fuel', 'Parking', 'Showers', 'Restaurant'],
    },
  ];

  static async findNearbyTruckStops(
    currentLocation: Location,
    radiusMiles: number = 50,
  ): Promise<TruckStop[]> {
    // In a real app, this would call an API like Google Places or a truck stop API
    // For now, we'll use mock data with distance calculations

    const stopsWithDistance = this.mockTruckStops.map(stop => ({
      ...stop,
      distance: LocationService.calculateDistance(currentLocation, stop.location),
    }));

    return stopsWithDistance
      .filter(stop => stop.distance! <= radiusMiles)
      .sort((a, b) => a.distance! - b.distance!);
  }

  static async searchTruckStops(query: string): Promise<TruckStop[]> {
    // Simple text search in mock data
    const lowerQuery = query.toLowerCase();
    return this.mockTruckStops.filter(
      stop =>
        stop.name.toLowerCase().includes(lowerQuery) ||
        stop.address.toLowerCase().includes(lowerQuery) ||
        stop.amenities.some(amenity =>
          amenity.toLowerCase().includes(lowerQuery),
        ),
    );
  }

  static async getTruckStopDetails(stopId: string): Promise<TruckStop | null> {
    return this.mockTruckStops.find(stop => stop.id === stopId) || null;
  }
}
