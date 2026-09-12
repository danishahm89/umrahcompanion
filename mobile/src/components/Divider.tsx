import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/** A quiet hairline, used only *within* a card between rows — cards themselves (not
 * flat rules) now carry the page's structure. */
export function Divider({ thick = false }: { thick?: boolean }) {
  const { colors } = useTheme();
  return <View style={{ height: thick ? 2 : 1, backgroundColor: colors.hairline }} />;
}
