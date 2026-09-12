import type { Lang } from '../i18n/LanguageContext';

const UNITS: Record<Lang, { h: string; d: string }> = {
  en: { h: 'h', d: 'd' },
  hi: { h: 'घं', d: 'दि' },
  ur: { h: 'گھ', d: 'دن' },
};

/** Renders "2h" / "3d" style relative time, matching the design's news timestamps. */
export function relativeTime(iso: string, lang: Lang): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.round(diffMs / 3600_000));
  const unit = UNITS[lang];
  if (hours < 24) return `${hours}${unit.h}`;
  return `${Math.round(hours / 24)}${unit.d}`;
}
