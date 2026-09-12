import React from 'react';
import { View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { useTheme } from '../theme/ThemeContext';
import { radius } from '../theme/tokens';

/** A soft tinted circle behind an icon — the "boutique app" polish touch used in quick
 * access tiles, list rows, and numbered service cards instead of a bare icon on white. */
export function IconBadge({ name, size = 40, iconSize = 20, tone = 'accent' }: { name: IconName; size?: number; iconSize?: number; tone?: 'accent' | 'gold' }) {
  const { colors } = useTheme();
  const bg = tone === 'gold' ? colors.goldLight : colors.accent100;
  const fg = tone === 'gold' ? colors.goldDeep : colors.accent;
  return (
    <View style={{ width: size, height: size, borderRadius: radius.pill, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={iconSize} color={fg} strokeWidth={1.8} />
    </View>
  );
}
