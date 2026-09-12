import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { radius } from '../theme/tokens';

interface Fact { k: string; v: string }

// A 2-column key/value grid with hairline dividers between cells. Deliberately not using
// RN's `gap` here: `gap` + percentage `width` in a wrapping flex row don't combine the way
// CSS Grid's `gap` does (the design uses `display:grid`) — the gap eats into the second
// column's width, so it wraps onto its own row and the container's background shows through
// as a solid block. Hairline borders instead of `gap` sidestep that entirely.
export function FactGrid({ facts, columns = 2 }: { facts: Fact[]; columns?: number }) {
  const { colors } = useTheme();
  const lastRow = Math.floor((facts.length - 1) / columns);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.neutral100 }}>
      {facts.map((fa, i) => {
        const isLastCol = i % columns === columns - 1;
        const isLastRow = Math.floor(i / columns) === lastRow;
        return (
          <View
            key={fa.k}
            style={{
              width: `${100 / columns}%`,
              padding: 12,
              paddingHorizontal: 14,
              borderRightWidth: isLastCol ? 0 : 1,
              borderBottomWidth: isLastRow ? 0 : 1,
              borderColor: colors.hairline,
            }}
          >
            <AppText size={9.5} color={colors.t50} style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>{fa.k}</AppText>
            <AppText weight="semibold" size={13} color={colors.text} style={{ marginTop: 4, textAlign: 'left', writingDirection: 'ltr' }}>{fa.v}</AppText>
          </View>
        );
      })}
    </View>
  );
}
