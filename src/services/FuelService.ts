import {FuelStation, Location} from '../types';
import {LocationService} from './LocationService';

export class FuelService {
  // Mock data for demonstration
  private static mockFuelStations: FuelStation[] = [
    {
      id: '1',
      name: "Love's Travel Stop",
      address: '1234 Highway 40, Denver, CO',
      location: {latitude: 39.7392, longitude: -104.9903},
      price: 3.89,
      diesel: true,
    },
    {
      id: '2',
      name: 'Pilot Flying J',
      address: '5678 Interstate 80, Cheyenne, WY',
      location: {latitude: 41.1400, longitude: -104.8202},
      price: 3.75,
      diesel: true,
    },
    {
      id: '3',
      name: 'TA Travel Center',
      address: '9012 Route 66, Albuquerque, NM',
      location: {latitude: 35.0844, longitude: -106.6504},
      price: 3.95,
      diesel: true,
    },
    {
      id: '4',
      name: 'Petro Stopping Center',
      address: '3456 I-70, Kansas City, MO',
      location: {latitude: 39.0997, longitude: -94.5786},
      price: 3.82,
      diesel: true,
    },
    {
      id: '5',
      name: 'Shell Gas Station',
      address: '7890 Main St, Oklahoma City, OK',
      location: {latitude: 35.4676, longitude: -97.5164},
      price: 4.05,
      diesel: true,
    },
  ];

  static async findCheapestFuel(
    currentLocation: Location,
    radiusMiles: number = 50,
  ): Promise<FuelStation[]> {
    // In a real app, this would call an API like GasBuddy or similar
    // For now, we'll use mock data

    const stationsWithDistance = this.mockFuelStations.map(station => ({
      ...station,
      distance: LocationService.calculateDistance(
        currentLocation,
        station.location,
      ),
    }));

    return stationsWithDistance
      .filter(station => station.distance! <= radiusMiles && station.diesel)
      .sort((a, b) => a.price - b.price);
  }

  static async findFuelStationsAlongRoute(
    route: Location[],
    radiusMiles: number = 5,
  ): Promise<FuelStation[]> {
    // Find stations near any point along the route
    const nearbyStations: FuelStation[] = [];
    const addedIds = new Set<string>();

    for (const point of route) {
      const stations = await this.findCheapestFuel(point, radiusMiles);
      stations.forEach(station => {
        if (!addedIds.has(station.id)) {
          nearbyStations.push(station);
          addedIds.add(station.id);
        }
      });
    }

    return nearbyStations.sort((a, b) => a.price - b.price);
  }
}
