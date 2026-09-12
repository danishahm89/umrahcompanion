import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { useDirection } from '../direction/DirectionContext';
import { radius } from '../theme/tokens';

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <AppText size={12} color={colors.t70}>{label}</AppText>
      {children}
    </View>
  );
}

export function TextField(props: TextInputProps) {
  const { colors } = useTheme();
  const { textAlign, writingDirection } = useDirection();
  return (
    <TextInput
      placeholderTextColor={colors.t50}
      style={[
        {
          minHeight: 46,
          paddingVertical: 10,
          paddingHorizontal: 14,
          fontSize: 14,
          color: colors.text,
          backgroundColor: colors.neutral100,
          borderRadius: radius.md,
          textAlign,
          writingDirection,
        },
        props.multiline && { minHeight: 96, textAlignVertical: 'top' },
      ]}
      {...props}
    />
  );
}
