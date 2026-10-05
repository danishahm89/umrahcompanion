import React, { useRef } from 'react';
import { View, Pressable, Animated, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radius, shadow } from '../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

/** The premium redesign's base surface: a rounded, softly-shadowed card floating on the
 * warm ivory ground — replacing the handoff's edge-to-edge sections divided by flat rules. */
export function Card({ children, style, padded = true, elevation = 'md', onPress }: CardProps) {
  const { colors } = useTheme();

  // A7: Press scale-down + spring-bounce
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 5,
    }).start();
  };

  const cardStyle = [
    {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: padded ? 16 : 0,
      overflow: 'hidden' as const,
    },
    shadow(colors, elevation),
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[...cardStyle, { transform: [{ scale: scaleAnim }] }]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Animated.View style={[...cardStyle, { transform: [{ scale: scaleAnim }] }]}>
      {children}
    </Animated.View>
  );
}

/** Page-level wrapper: consistent side margins + vertical rhythm between stacked cards. */
export function CardStack({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ padding: 16, gap: 16 }, style]}>{children}</View>;
}
