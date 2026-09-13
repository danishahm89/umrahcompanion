import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from 'adhan';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeEntry {
  key: PrayerKey;
  time: Date;
}

// Umm al-Qura (Saudi Ministry of Islamic Affairs) calculation method, matching Saudi
// convention since this app is Umrah/Hajj focused regardless of the pilgrim's home city.
export function computePrayerTimes(lat: number, lng: number, date = new Date()): PrayerTimeEntry[] {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.UmmAlQura();
  const pt = new AdhanPrayerTimes(coordinates, date, params);
  return [
    { key: 'fajr', time: pt.fajr },
    { key: 'sunrise', time: pt.sunrise },
    { key: 'dhuhr', time: pt.dhuhr },
    { key: 'asr', time: pt.asr },
    { key: 'maghrib', time: pt.maghrib },
    { key: 'isha', time: pt.isha },
  ];
}

export function findNextPrayer(times: PrayerTimeEntry[], now = new Date()): PrayerTimeEntry {
  return times.find((t) => t.time.getTime() > now.getTime()) ?? times[0];
}

export function formatPrayerTime(time: Date): string {
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
