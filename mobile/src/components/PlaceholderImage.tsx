import React from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { AppText } from './AppText';
import { radius } from '../theme/tokens';

/**
 * Stands in for the design's grayscale hatched image slots. Per the handoff, real
 * photography is not supplied yet, so every photo spot in the app renders this.
 */
export function PlaceholderImage({ height, label, rounded = true }: { height: number; label: string; rounded?: boolean }) {
  const lines = [];
  const step = 18;
  for (let x = -height; x < 400; x += step) lines.push(x);

  return (
    <View style={{ height, borderRadius: rounded ? radius.lg : 0, backgroundColor: '#d3cdbd', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      <Svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {lines.map((x) => (
          <Line key={x} x1={x} y1={0} x2={x + height} y2={height} stroke="#b3ab95" strokeWidth={1} />
        ))}
      </Svg>
      <View style={{ backgroundColor: 'rgba(255,253,248,0.88)', paddingHorizontal: 14, paddingVertical: 7, maxWidth: '80%', borderRadius: radius.pill }}>
        <AppText size={11} color="#4a4636" center>{label}</AppText>
      </View>
    </View>
  );
}
