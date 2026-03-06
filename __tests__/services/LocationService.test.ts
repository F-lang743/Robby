import {LocationService} from '../../src/services/LocationService';
import {Location} from '../../src/types';

describe('LocationService', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two locations', () => {
      const from: Location = {latitude: 39.7392, longitude: -104.9903}; // Denver
      const to: Location = {latitude: 41.1400, longitude: -104.8202}; // Cheyenne
      
      const distance = LocationService.calculateDistance(from, to);
      
      // Distance between Denver and Cheyenne is approximately 100 miles
      expect(distance).toBeGreaterThan(90);
      expect(distance).toBeLessThan(110);
    });

    it('returns 0 for same location', () => {
      const location: Location = {latitude: 40.0, longitude: -105.0};
      
      const distance = LocationService.calculateDistance(location, location);
      
      expect(distance).toBe(0);
    });
  });
});
