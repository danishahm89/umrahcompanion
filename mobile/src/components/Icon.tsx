import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

// Path/circle data copied verbatim from the inline SVGs in the design
// (project/Umrah Companion.dc.html) so icons match pixel-for-pixel.
const ICONS = {
  back: { paths: ['M15 18l-6-6 6-6'] },
  sun: {
    circles: [{ cx: 12, cy: 12, r: 4 }],
    paths: ['M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19'],
  },
  moon: { paths: ['M20 13.5A8 8 0 1110.5 4a6.2 6.2 0 009.5 9.5z'] },
  arrowRight: { paths: ['M5 12h14M13 6l6 6-6 6'] },
  firstTime: { paths: ['M4 5h6a2 2 0 012 2v13H6a2 2 0 01-2-2z', 'M20 5h-6a2 2 0 00-2 2v13h6a2 2 0 002-2z'] },
  duas: { paths: ['M12 20s-7-4.6-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.4 12 20 12 20z'] },
  packing: { paths: ['M3 8h18v12H3zM9 8V4h6v4M3 14h18'] },
  vaccine: { paths: ['M12 3l7 3v6c0 4.2-3 6.8-7 8-4-1.2-7-3.8-7-8V6z', 'M9 12l2.2 2.2L15.5 10'] },
  nusuk: { circles: [{ cx: 12, cy: 12, r: 9 }], paths: ['M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z'] },
  packages: { paths: ['M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10'] },
  gallery: {
    circles: [{ cx: 8.5, cy: 9, r: 1.4 }],
    paths: ['M3 5h18v14H3z', 'M3 16l5-5 4 4 3-3 6 6'],
  },
  faq: { circles: [{ cx: 12, cy: 12, r: 9 }], paths: ['M9.5 9.2a2.6 2.6 0 015 .8c0 1.7-2.5 2-2.5 3.7', 'M12 17.2h.01'] },
  check: { paths: ['M20 6L9 17l-5-5'] },
  plus: { paths: ['M12 5v14M5 12h14'] },
  minus: { paths: ['M5 12h14'] },
  external: { paths: ['M7 17L17 7M9 7h8v8'] },
  navHome: { paths: ['M3 10.5L12 3l9 7.5V21H3z'] },
  navGuide: { paths: ['M4 4h7v16H4zM13 4h7v16h-7z'] },
  navNews: { paths: ['M4 5h16v14H4zM7 9h10M7 13h10M7 17h6'] },
  navMore: { paths: ['M4 6h16M4 12h16M4 18h16'] },
  chevronRight: { paths: ['M9 6l6 6-6 6'] },
  settings: {
    circles: [{ cx: 12, cy: 12, r: 3 }],
    paths: ['M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'],
  },
  services: { paths: ['M3 8a2 2 0 012-2h14a2 2 0 012 2 2 2 0 000 4 2 2 0 00-2 2v2H5a2 2 0 01-2-2 2 2 0 000-4z', 'M10 6v12'] },
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color, strokeWidth = 1.8 }: IconProps) {
  const spec = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {'circles' in spec &&
        spec.circles.map((c, i) => (
          <Circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} stroke={color} strokeWidth={strokeWidth} />
        ))}
      {spec.paths.map((d, i) => (
        <Path key={`p${i}`} d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </Svg>
  );
}
