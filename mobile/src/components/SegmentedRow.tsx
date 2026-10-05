import React, { useRef, useEffect, useState } from 'react';
import { Pressable, View, Animated, LayoutChangeEvent } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { useDirection } from '../direction/DirectionContext';
import { radius } from '../theme/tokens';

interface Option { label: string; value: string }

/** A12: Animated sliding pill language/segment switcher */
export function SegmentedRow({ options, value, onChange }: { options: Option[]; value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  const { row } = useDirection();

  const pillAnim = useRef(new Animated.Value(0)).current;
  const [widths, setWidths] = useState<number[]>([]);
  const [offsets, setOffsets] = useState<number[]>([]);

  const activeIdx = options.findIndex(o => o.value === value);

  useEffect(() => {
    if (offsets.length === 0 || activeIdx < 0) return;
    Animated.spring(pillAnim, {
      toValue: offsets[activeIdx] ?? 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [activeIdx, offsets]);

  const pillW = widths[activeIdx] ?? 0;

  return (
    <View style={{ flexDirection: 'row', gap: 0, backgroundColor: colors.neutral100, borderRadius: radius.pill, padding: 4 }}>
      {/* A12: Sliding pill */}
      {pillW > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            width: pillW,
            borderRadius: radius.pill,
            backgroundColor: colors.accent,
            transform: [{ translateX: pillAnim }],
          }}
        />
      )}
      {options.map((opt, idx) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onLayout={(e: LayoutChangeEvent) => {
              const { x, width } = e.nativeEvent.layout;
              setWidths(prev => { const n = [...prev]; n[idx] = width; return n; });
              setOffsets(prev => { const n = [...prev]; n[idx] = x; return n; });
            }}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 9,
              paddingHorizontal: 6,
              borderRadius: radius.pill,
            }}
          >
            <AppText size={13} weight={on ? 'semibold' : 'regular'} color={on ? '#fff' : colors.text}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
