import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { useDirection } from '../direction/DirectionContext';
import { radius } from '../theme/tokens';

interface Option { label: string; value: string }

export function SegmentedRow({ options, value, onChange }: { options: Option[]; value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  const { row } = useDirection();

  return (
    <View style={{ flexDirection: row, gap: 4, backgroundColor: colors.neutral100, borderRadius: radius.pill, padding: 4 }}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 9,
              paddingHorizontal: 6,
              borderRadius: radius.pill,
              backgroundColor: on ? colors.accent : 'transparent',
            }}
          >
            <AppText size={13} weight={on ? 'semibold' : 'regular'} color={on ? '#fff' : colors.text}>{opt.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
