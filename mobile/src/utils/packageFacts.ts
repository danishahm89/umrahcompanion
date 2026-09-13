import type { Package } from '../api/types';
import type { StringKey } from '../i18n/strings';

interface Fact { k: string; v: string }

function hotelFact(stars: number, distM: number, remark: string, t: (key: StringKey) => string): string {
  const remarkLabel = remark === 'shuttle' ? t('shuttleShort') : t('walkingShort');
  return `${stars}★ · ${distM}m · ${remarkLabel}`;
}

/** Builds the 8-fact grid (nights, Makkah hotel, Madinah hotel, city, visa, meals, flight, type)
 * shared by the Packages list cards (first 6) and the Package detail screen (all 8). Full flight
 * routing/date/airline detail is NOT in this grid — see the dedicated Flight Details card on the
 * detail screen, built separately since it needs more room than a 2-column fact cell. */
export function buildPackageFacts(pkg: Package, t: (key: StringKey) => string, field: (en: string, hi: string, ur: string) => string): Fact[] {
  const typeLabel = pkg.type === 'private' ? t('typePrivate') : pkg.type === 'hajj' ? t('typeHajj') : t('typeGroup');
  return [
    { k: t('factNights'), v: String(pkg.nights) },
    { k: t('factMakkahHotel'), v: hotelFact(pkg.makkahHotelStars, pkg.makkahHotelDistM, pkg.makkahHotelRemark, t) },
    { k: t('factMadinahHotel'), v: hotelFact(pkg.madinahHotelStars, pkg.madinahHotelDistM, pkg.madinahHotelRemark, t) },
    { k: t('factCity'), v: field(pkg.cityEn, pkg.cityHi, pkg.cityUr) },
    { k: t('factVisa'), v: pkg.visaIncluded ? t('factYes') : '—' },
    { k: t('factMeals'), v: field(pkg.mealsEn, pkg.mealsHi, pkg.mealsUr) },
    { k: t('factFlight'), v: pkg.flightIncluded ? (pkg.flightConfirmLater ? '—' : t('factYes')) : '—' },
    { k: t('factType'), v: typeLabel },
  ];
}

/** The 4 room-sharing tiers that have a price set, in order — for the price-breakdown list on
 * the Package Detail screen. A package need not offer every tier. */
export function buildSharingPrices(pkg: Package, t: (key: StringKey) => string): Fact[] {
  const tiers: Array<[number | null, StringKey]> = [
    [pkg.price2Share, 'share2'],
    [pkg.price3Share, 'share3'],
    [pkg.price4Share, 'share4'],
    [pkg.price5Share, 'share5'],
  ];
  return tiers.filter(([price]) => typeof price === 'number').map(([price, key]) => ({ k: t(key), v: formatPriceInr(price as number) }));
}

export function formatPriceInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
