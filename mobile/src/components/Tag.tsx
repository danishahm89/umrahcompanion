import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { radius } from '../theme/tokens';

interface TagProps {
  label: string;
  variant?: 'accent' | 'neutral' | 'outline' | 'gold';
}

export function Tag({ label, variant = 'accent' }: TagProps) {
  const { colors } = useTheme();
  const styleFor = {
    accent: { backgroundColor: colors.accent100, color: colors.accent800, borderWidth: 0 },
    neutral: { backgroundColor: colors.neutral100, color: colors.neutral800, borderWidth: 0 },
    outline: { backgroundColor: 'transparent', color: colors.accent, borderWidth: 1, borderColor: colors.accent },
    gold: { backgroundColor: colors.goldLight, color: colors.goldDeep, borderWidth: 0 },
  }[variant];

  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: styleFor.backgroundColor, borderWidth: styleFor.borderWidth, borderColor: styleFor.borderColor, alignSelf: 'flex-start' }}>
      <AppText size={10.5} weight="semibold" color={styleFor.color} style={{ letterSpacing: 0.3 }}>{label}</AppText>
    </View>
  );
}
