import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { fontFamilies } from '../theme/tokens';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'display' | 'displayBlack';

interface AppTextProps extends TextProps {
  weight?: Weight;
  color?: string;
  size?: number;
  lineHeight?: number;
  letterSpacing?: number;
  center?: boolean;
}

// Playfair Display (the "display"/"displayBlack" weights) carries no Devanagari or
// Arabic glyphs, so Hindi/Urdu headings fall back to their own boldest native weight.
function familyFor(lang: 'en' | 'hi' | 'ur', weight: Weight): string {
  if (lang === 'hi') return weight === 'regular' ? fontFamilies.hi : weight === 'bold' || weight === 'display' || weight === 'displayBlack' ? fontFamilies.hiBold : fontFamilies.hiSemibold;
  if (lang === 'ur') return weight === 'regular' ? fontFamilies.ur : fontFamilies.urBold;
  if (weight === 'display') return fontFamilies.displayEn;
  if (weight === 'displayBlack') return fontFamilies.displayEnBlack;
  if (weight === 'regular') return fontFamilies.en;
  if (weight === 'medium') return fontFamilies.enMedium;
  if (weight === 'semibold') return fontFamilies.enSemibold;
  return fontFamilies.enBold;
}

/** Text that auto-selects the right typeface for the current language and mirrors for RTL. */
export function AppText({ weight = 'regular', color, size = 15, lineHeight, letterSpacing, center, style, ...rest }: AppTextProps) {
  const { lang } = useLanguage();
  const { textAlign, writingDirection } = useDirection();
  return (
    <Text
      style={[
        {
          fontFamily: familyFor(lang, weight),
          color,
          fontSize: size,
          lineHeight,
          letterSpacing,
          textAlign: center ? 'center' : textAlign,
          writingDirection,
        },
        style,
      ]}
      {...rest}
    />
  );
}

/** Dua Arabic text always renders in Noto Naskh Arabic, regardless of UI language. */
export function ArabicText({ bold, color, size = 23, style, ...rest }: TextProps & { bold?: boolean; color?: string; size?: number }) {
  return (
    <Text
      style={[
        { fontFamily: bold ? fontFamilies.arBold : fontFamilies.ar, color, fontSize: size, lineHeight: size * 1.95, textAlign: 'right', writingDirection: 'rtl' },
        style,
      ]}
      {...rest}
    />
  );
}
