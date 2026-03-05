/**
 * Represents a physical truck stop facility along a route.
 */
export interface TruckStop {
  truckStopId: string;
  truckStopName: string;
  streetAddress: string;
  cityName: string;
  stateAbbreviation: string;
  latitudeDecimalDegrees: number;
  longitudeDecimalDegrees: number;
  dieselPricePerGallon: number | null;
  hasShowers: boolean;
  hasRestaurant: boolean;
  hasParkingForSemiTrucks: boolean;
  distanceFromDriverMiles: number;
}

/**
 * Represents a GPS coordinate pair.
 */
export interface GpsCoordinate {
  latitudeDecimalDegrees: number;
  longitudeDecimalDegrees: number;
}

/**
 * Represents a single mileage log entry recorded during a trip.
 */
export interface MileageLogEntry {
  logEntryId: string;
  tripStartLocation: GpsCoordinate;
  tripEndLocation: GpsCoordinate;
  distanceDrivenMiles: number;
  paidMilesDriven: number;
  tripStartTimestampUtc: string;
  tripEndTimestampUtc: string;
  isEligibleForCompensation: boolean;
}

/**
 * Represents a voice note recorded by the driver while on the road.
 */
export interface VoiceNote {
  noteId: string;
  transcribedNoteText: string;
  recordedAtTimestampUtc: string;
  audioFileUri: string | null;
}
