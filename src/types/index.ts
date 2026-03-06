export interface Location {
  latitude: number;
  longitude: number;
}

export interface TruckStop {
  id: string;
  name: string;
  address: string;
  location: Location;
  amenities: string[];
  distance?: number;
}

export interface FuelStation {
  id: string;
  name: string;
  address: string;
  location: Location;
  price: number;
  diesel: boolean;
  distance?: number;
}

export interface MileageEntry {
  id: string;
  date: string;
  startLocation: string;
  endLocation: string;
  miles: number;
  paidMiles: number;
  notes?: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  transcription: string;
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  aliases?: string[];
}
