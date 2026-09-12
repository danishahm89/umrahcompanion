import type { Package } from '../api/types';
import type { StringKey } from '../i18n/strings';

interface Fact { k: string; v: string }

/** Builds the 8-fact grid (nights, distance, stars, city, visa, meals, flight, type) shared by
 * the Packages list cards (first 6) and the Package detail screen (all 8). */
export function buildPackageFacts(pkg: Package, t: (key: StringKey) => string, field: (en: string, hi: string, ur: string) => string): Fact[] {
  const typeLabel = pkg.type === 'private' ? t('typePrivate') : pkg.type === 'hajj' ? t('typeHajj') : t('typeGroup');
  return [
    { k: t('factNights'), v: String(pkg.nights) },
    { k: t('factDist'), v: `${pkg.hotelDistM} m` },
    { k: t('factStars'), v: pkg.hotelStars },
    { k: t('factCity'), v: field(pkg.cityEn, pkg.cityHi, pkg.cityUr) },
    { k: t('factVisa'), v: pkg.visaIncluded ? t('factYes') : '—' },
    { k: t('factMeals'), v: field(pkg.mealsEn, pkg.mealsHi, pkg.mealsUr) },
    { k: t('factFlight'), v: pkg.flightIncluded ? t('factYes') : '—' },
    { k: t('factType'), v: typeLabel },
  ];
}

export function formatPriceInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
