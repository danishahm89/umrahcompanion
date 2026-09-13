import { Coordinates, Qibla } from 'adhan';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const EARTH_RADIUS_KM = 6371;

/** Bearing in degrees from true north to face for prayer, from the given location. */
export function computeQiblaBearing(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}

export function computeDistanceToKaabaKm(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(KAABA_LAT - lat);
  const dLng = toRad(KAABA_LNG - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLng / 2) ** 2;
  return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
