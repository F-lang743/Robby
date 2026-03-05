import { GpsCoordinate, TruckStop } from '../models/TruckStop';
import {
  calculateStraightLineDistanceMiles,
  isLocationWithinRadiusMiles,
} from '../utils/gpsDistanceCalculator';

const MAX_TRUCK_STOPS_TO_RETURN = 10;

/**
 * Extracts the GPS coordinate from a truck stop record.
 */
function extractCoordinateFromTruckStop(truckStop: TruckStop): GpsCoordinate {
  return {
    latitudeDecimalDegrees: truckStop.latitudeDecimalDegrees,
    longitudeDecimalDegrees: truckStop.longitudeDecimalDegrees,
  };
}

/**
 * Filters and sorts a list of truck stops by proximity to the driver's current
 * location, returning only those within the specified search radius.
 *
 * @param driverCurrentLocation    - The driver's present GPS position.
 * @param allAvailableTruckStops   - Full list of truck stops to search through.
 * @param searchRadiusMiles        - Maximum distance to include a stop.
 * @returns Up to {@link MAX_TRUCK_STOPS_TO_RETURN} nearby truck stops, each
 *          annotated with their distance from the driver, sorted nearest-first.
 */
export function findNearbyTruckStopsSortedByDistance(
  driverCurrentLocation: GpsCoordinate,
  allAvailableTruckStops: TruckStop[],
  searchRadiusMiles: number,
): TruckStop[] {
  const truckStopsWithinRadius = allAvailableTruckStops
    .filter((truckStop) =>
      isLocationWithinRadiusMiles(
        driverCurrentLocation,
        extractCoordinateFromTruckStop(truckStop),
        searchRadiusMiles,
      ),
    )
    .map((truckStop) => ({
      ...truckStop,
      distanceFromDriverMiles: calculateStraightLineDistanceMiles(
        driverCurrentLocation,
        extractCoordinateFromTruckStop(truckStop),
      ),
    }));

  truckStopsWithinRadius.sort(
    (firstStop, secondStop) =>
      firstStop.distanceFromDriverMiles - secondStop.distanceFromDriverMiles,
  );

  return truckStopsWithinRadius.slice(0, MAX_TRUCK_STOPS_TO_RETURN);
}

/**
 * Finds the truck stop with the lowest diesel price within a given radius of
 * the driver's current location.
 *
 * @param driverCurrentLocation  - The driver's present GPS position.
 * @param allAvailableTruckStops - Full list of truck stops to search.
 * @param searchRadiusMiles      - Maximum search distance in miles.
 * @returns The cheapest fuel stop, or `null` if none are found in range.
 */
export function findCheapestDieselFuelStopNearDriver(
  driverCurrentLocation: GpsCoordinate,
  allAvailableTruckStops: TruckStop[],
  searchRadiusMiles: number,
): TruckStop | null {
  const nearbyTruckStops = findNearbyTruckStopsSortedByDistance(
    driverCurrentLocation,
    allAvailableTruckStops,
    searchRadiusMiles,
  );

  const stopsWithKnownFuelPrices = nearbyTruckStops.filter(
    (truckStop) => truckStop.dieselPricePerGallon !== null,
  );

  if (stopsWithKnownFuelPrices.length === 0) {
    return null;
  }

  return stopsWithKnownFuelPrices.reduce(
    (cheapestStopSoFar, currentTruckStop) =>
      (currentTruckStop.dieselPricePerGallon as number) <
      (cheapestStopSoFar.dieselPricePerGallon as number)
        ? currentTruckStop
        : cheapestStopSoFar,
  );
}
