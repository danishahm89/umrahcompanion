// "Elegant heritage" palette — deep emerald + gold-foil accents on a warm ivory ground,
// replacing the flat Modernist red/neutral system from the original handoff.
export const lightColors = {
  bg: '#FBF7EE',
  surface: '#FFFEFB',
  surfaceAlt: '#F3ECDC',
  text: '#16302A',
  accent: '#0B5E39',
  accentLight: '#1C7A4C',
  accentDeep: '#073F26',
  accent100: '#E4F0E7',
  accent800: '#073F26',
  neutral100: '#F0E9D8',
  neutral800: '#3A4B44',
  divider: 'rgba(22,48,42,0.12)',
  hairline: 'rgba(22,48,42,0.10)',
  gold: '#B8892A',
  goldLight: '#F0D98C',
  goldDeep: '#8B6914',
  shadow: 'rgba(20,40,32,0.20)',
  t80: 'rgba(22,48,42,0.82)',
  t70: 'rgba(22,48,42,0.68)',
  t50: 'rgba(22,48,42,0.52)',
  t20: 'rgba(22,48,42,0.20)',
};

export const darkColors = {
  bg: '#0A1B16',
  surface: '#12241D',
  surfaceAlt: '#16302A',
  text: '#F6EFDD',
  accent: '#2FAE72',
  accentLight: '#45C589',
  accentDeep: '#1F7A4E',
  accent100: '#16352A',
  accent800: '#BFE6CD',
  neutral100: '#1C332C',
  neutral800: '#D8D2C4',
  divider: 'rgba(246,239,221,0.14)',
  hairline: 'rgba(246,239,221,0.10)',
  gold: '#E8C874',
  goldLight: '#F5E3A8',
  goldDeep: '#C9A227',
  shadow: 'rgba(0,0,0,0.55)',
  t80: 'rgba(246,239,221,0.82)',
  t70: 'rgba(246,239,221,0.68)',
  t50: 'rgba(246,239,221,0.52)',
  t20: 'rgba(246,239,221,0.20)',
};

export type ColorTokens = typeof lightColors;

// Soft rounded shape language (a deliberate departure from the handoff's zero-radius system).
export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };
export const hairlineWidth = 1;

export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const;

type ShadowSize = 'sm' | 'md' | 'lg';

/** Elevation presets — shadowColor depends on the active theme, so this takes `colors`. */
export function shadow(colors: ColorTokens, size: ShadowSize) {
  const specs = {
    sm: { offset: 1, opacity: 0.10, radius: 4, elevation: 2 },
    md: { offset: 4, opacity: 0.14, radius: 12, elevation: 5 },
    lg: { offset: 10, opacity: 0.18, radius: 26, elevation: 10 },
  }[size];
  return {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: specs.offset },
    shadowOpacity: specs.opacity,
    shadowRadius: specs.radius,
    elevation: specs.elevation,
  };
}

export const fontFamilies = {
  en: 'Archivo_400Regular',
  enMedium: 'Archivo_500Medium',
  enSemibold: 'Archivo_600SemiBold',
  enBold: 'Archivo_800ExtraBold',
  hi: 'NotoSansDevanagari_400Regular',
  hiSemibold: 'NotoSansDevanagari_600SemiBold',
  hiBold: 'NotoSansDevanagari_700Bold',
  ur: 'NotoNastaliqUrdu_400Regular',
  urBold: 'NotoNastaliqUrdu_700Bold',
  ar: 'NotoNaskhArabic_400Regular',
  arBold: 'NotoNaskhArabic_700Bold',
  // Display serif for English headings/hero numbers only — Hindi/Urdu headings stay on
  // their own bold native font since Playfair Display carries no Devanagari/Arabic glyphs.
  displayEn: 'PlayfairDisplay_700Bold',
  displayEnBlack: 'PlayfairDisplay_900Black',
};
