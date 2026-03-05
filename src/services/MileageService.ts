import AsyncStorage from '@react-native-async-storage/async-storage';
import {MileageEntry} from '../types';

const MILEAGE_STORAGE_KEY = '@mileage_entries';

export class MileageService {
  static async saveMileageEntry(entry: Omit<MileageEntry, 'id'>): Promise<MileageEntry> {
    const newEntry: MileageEntry = {
      ...entry,
      id: Date.now().toString(),
    };

    const entries = await this.getAllEntries();
    entries.push(newEntry);
    await AsyncStorage.setItem(MILEAGE_STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  }

  static async getAllEntries(): Promise<MileageEntry[]> {
    try {
      const data = await AsyncStorage.getItem(MILEAGE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading mileage entries:', error);
      return [];
    }
  }

  static async getEntriesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<MileageEntry[]> {
    const entries = await this.getAllEntries();
    return entries.filter(
      entry => entry.date >= startDate && entry.date <= endDate,
    );
  }

  static async getTotalMiles(): Promise<{total: number; paid: number}> {
    const entries = await this.getAllEntries();
    const total = entries.reduce((sum, entry) => sum + entry.miles, 0);
    const paid = entries.reduce((sum, entry) => sum + entry.paidMiles, 0);
    return {total, paid};
  }

  static async deleteEntry(id: string): Promise<void> {
    const entries = await this.getAllEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(MILEAGE_STORAGE_KEY, JSON.stringify(filtered));
  }

  static async updateEntry(id: string, updates: Partial<MileageEntry>): Promise<void> {
    const entries = await this.getAllEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      entries[index] = {...entries[index], ...updates};
      await AsyncStorage.setItem(MILEAGE_STORAGE_KEY, JSON.stringify(entries));
    }
  }
}
