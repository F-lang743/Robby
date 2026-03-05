import { GpsCoordinate } from '../models/TruckStop';

const EARTH_RADIUS_MILES = 3958.8;

/**
 * Converts an angle expressed in degrees to its equivalent in radians.
 */
function convertDegreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the straight-line distance in miles between two GPS coordinates
 * using the Haversine formula.
 *
 * @param originCoordinate      - Starting GPS position.
 * @param destinationCoordinate - Ending GPS position.
 * @returns Distance in miles between the two coordinates.
 */
export function calculateStraightLineDistanceMiles(
  originCoordinate: GpsCoordinate,
  destinationCoordinate: GpsCoordinate,
): number {
  const latitudeDifferenceRadians = convertDegreesToRadians(
    destinationCoordinate.latitudeDecimalDegrees -
      originCoordinate.latitudeDecimalDegrees,
  );
  const longitudeDifferenceRadians = convertDegreesToRadians(
    destinationCoordinate.longitudeDecimalDegrees -
      originCoordinate.longitudeDecimalDegrees,
  );

  const haversineA =
    Math.sin(latitudeDifferenceRadians / 2) *
      Math.sin(latitudeDifferenceRadians / 2) +
    Math.cos(
      convertDegreesToRadians(originCoordinate.latitudeDecimalDegrees),
    ) *
      Math.cos(
        convertDegreesToRadians(
          destinationCoordinate.latitudeDecimalDegrees,
        ),
      ) *
      Math.sin(longitudeDifferenceRadians / 2) *
      Math.sin(longitudeDifferenceRadians / 2);

  const centralAngleRadians =
    2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

  return EARTH_RADIUS_MILES * centralAngleRadians;
}

/**
 * Determines whether a given GPS coordinate falls within a specified radius
 * of a reference location.
 *
 * @param referenceLocation - The center point to measure from.
 * @param candidateLocation - The location to test.
 * @param radiusMiles       - The maximum allowed distance in miles.
 * @returns `true` if the candidate is within the radius; `false` otherwise.
 */
export function isLocationWithinRadiusMiles(
  referenceLocation: GpsCoordinate,
  candidateLocation: GpsCoordinate,
  radiusMiles: number,
): boolean {
  const distanceMiles = calculateStraightLineDistanceMiles(
    referenceLocation,
    candidateLocation,
  );
  return distanceMiles <= radiusMiles;
}
