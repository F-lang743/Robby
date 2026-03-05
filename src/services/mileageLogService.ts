import { MileageLogEntry, GpsCoordinate } from '../models/TruckStop';
import { calculateStraightLineDistanceMiles } from '../utils/gpsDistanceCalculator';

/**
 * Calculates the total compensable (paid) miles across all log entries for a
 * given time window.
 *
 * @param mileageLogEntries       - All entries to summarise.
 * @param periodStartTimestampUtc - ISO-8601 start of the reporting period.
 * @param periodEndTimestampUtc   - ISO-8601 end of the reporting period.
 * @returns Sum of paid miles driven within the reporting period.
 */
export function calculateTotalPaidMilesForPeriod(
  mileageLogEntries: MileageLogEntry[],
  periodStartTimestampUtc: string,
  periodEndTimestampUtc: string,
): number {
  const periodStartDate = new Date(periodStartTimestampUtc);
  const periodEndDate = new Date(periodEndTimestampUtc);

  const entriesWithinReportingPeriod = mileageLogEntries.filter(
    (logEntry) => {
      const tripStartDate = new Date(logEntry.tripStartTimestampUtc);
      return (
        tripStartDate >= periodStartDate && tripStartDate <= periodEndDate
      );
    },
  );

  return entriesWithinReportingPeriod
    .filter((logEntry) => logEntry.isEligibleForCompensation)
    .reduce(
      (accumulatedPaidMiles, logEntry) =>
        accumulatedPaidMiles + logEntry.paidMilesDriven,
      0,
    );
}

/**
 * Creates a new mileage log entry when the driver begins a trip.
 *
 * @param tripStartLocation           - GPS position when the trip started.
 * @param tripStartTimestampUtc       - ISO-8601 timestamp of departure.
 * @param isEligibleForCompensation   - Whether this leg qualifies for paid miles.
 * @returns A partially-complete log entry awaiting end-of-trip data.
 */
export function createMileageLogEntryForTripStart(
  tripStartLocation: GpsCoordinate,
  tripStartTimestampUtc: string,
  isEligibleForCompensation: boolean,
): Omit<MileageLogEntry, 'tripEndLocation' | 'tripEndTimestampUtc'> {
  return {
    logEntryId: generateUniqueLogEntryId(),
    tripStartLocation,
    distanceDrivenMiles: 0,
    paidMilesDriven: 0,
    tripStartTimestampUtc,
    isEligibleForCompensation,
  };
}

/**
 * Completes an in-progress mileage log entry when the driver ends a trip.
 *
 * @param inProgressLogEntry  - The entry created at trip start.
 * @param tripEndLocation     - GPS position when the trip ended.
 * @param tripEndTimestampUtc - ISO-8601 timestamp of arrival.
 * @returns A fully-populated mileage log entry ready for storage.
 */
export function completeMileageLogEntryAtTripEnd(
  inProgressLogEntry: Omit<
    MileageLogEntry,
    'tripEndLocation' | 'tripEndTimestampUtc'
  >,
  tripEndLocation: GpsCoordinate,
  tripEndTimestampUtc: string,
): MileageLogEntry {
  const distanceDrivenMiles = calculateStraightLineDistanceMiles(
    inProgressLogEntry.tripStartLocation,
    tripEndLocation,
  );

  const paidMilesDriven = inProgressLogEntry.isEligibleForCompensation
    ? distanceDrivenMiles
    : 0;

  return {
    ...inProgressLogEntry,
    tripEndLocation,
    tripEndTimestampUtc,
    distanceDrivenMiles,
    paidMilesDriven,
  };
}

/**
 * Generates a unique identifier for a new mileage log entry.
 */
function generateUniqueLogEntryId(): string {
  return `mileage-log-${crypto.randomUUID()}`;
}
