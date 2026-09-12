import React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useTheme } from '../theme/ThemeContext';
import { useDirection } from '../direction/DirectionContext';
import { radius, shadow } from '../theme/tokens';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  block?: boolean;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'secondary', block, icon, disabled, style }: ButtonProps) {
  const { colors } = useTheme();
  const { row } = useDirection();

  const content = (
    <View style={{ flexDirection: row, alignItems: 'center', justifyContent: block ? 'space-between' : 'center', gap: 8 }}>
      <AppText weight="semibold" size={14.5} color={variant === 'primary' ? '#fff' : variant === 'ghost' ? colors.accent : colors.text}>{label}</AppText>
      {icon && <Icon name={icon} size={16} color={variant === 'primary' ? '#fff' : variant === 'ghost' ? colors.accent : colors.text} strokeWidth={2} />}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.9 : 1, width: block ? '100%' : undefined }, style]}>
        <LinearGradient
          colors={[colors.accentLight, colors.accent, colors.accentDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ paddingVertical: 13, paddingHorizontal: 20, borderRadius: radius.md }, shadow(colors, 'sm')]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          borderRadius: radius.md,
          paddingVertical: 13,
          paddingHorizontal: 20,
          width: block ? '100%' : undefined,
          backgroundColor: variant === 'secondary' ? colors.surface : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: colors.divider,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
        variant === 'secondary' ? shadow(colors, 'sm') : null,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

export function IconButton({ name, onPress, color, size = 20, accessibilityLabel }: { name: IconName; onPress?: () => void; color: string; size?: number; accessibilityLabel?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel} style={({ pressed }) => [{ padding: 4, opacity: pressed ? 0.6 : 1 }]}>
      <Icon name={name} color={color} size={size} strokeWidth={1.8} />
    </Pressable>
  );
}

export function CheckBox({ checked, color }: { checked: boolean; color: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: radius.sm,
        borderWidth: 2,
        borderColor: checked ? colors.accent : color,
        backgroundColor: checked ? colors.accent : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked && <Icon name="check" size={13} color="#fff" strokeWidth={3.5} />}
    </View>
  );
}
