import {MileageService} from '../../src/services/MileageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('MileageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveMileageEntry', () => {
    it('saves a new mileage entry', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      
      const entry = await MileageService.saveMileageEntry({
        date: '2024-01-01',
        startLocation: 'Denver',
        endLocation: 'Kansas City',
        miles: 600,
        paidMiles: 580,
      });

      expect(entry.id).toBeDefined();
      expect(entry.miles).toBe(600);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getTotalMiles', () => {
    it('calculates total and paid miles', async () => {
      const mockEntries = [
        {id: '1', date: '2024-01-01', startLocation: 'A', endLocation: 'B', miles: 100, paidMiles: 90},
        {id: '2', date: '2024-01-02', startLocation: 'B', endLocation: 'C', miles: 200, paidMiles: 180},
      ];
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockEntries));
      
      const totals = await MileageService.getTotalMiles();
      
      expect(totals.total).toBe(300);
      expect(totals.paid).toBe(270);
    });
  });
});
