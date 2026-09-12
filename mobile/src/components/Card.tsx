import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, shadow } from '../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
}

/** The premium redesign's base surface: a rounded, softly-shadowed card floating on the
 * warm ivory ground — replacing the handoff's edge-to-edge sections divided by flat rules. */
export function Card({ children, style, padded = true, elevation = 'md' }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: padded ? 16 : 0,
          overflow: 'hidden',
        },
        shadow(colors, elevation),
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Page-level wrapper: consistent side margins + vertical rhythm between stacked cards. */
export function CardStack({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ padding: 16, gap: 16 }, style]}>{children}</View>;
}
