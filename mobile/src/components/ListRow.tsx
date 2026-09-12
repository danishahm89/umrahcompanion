import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { IconBadge } from './IconBadge';
import { useTheme } from '../theme/ThemeContext';
import { useDirection } from '../direction/DirectionContext';

interface ListRowProps {
  icon: IconName;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  /** Draw a hairline under this row — pass false on the last row in a Card. */
  divider?: boolean;
}

export function ListRow({ icon, label, sublabel, onPress, divider = true }: ListRowProps) {
  const { colors } = useTheme();
  const { row } = useDirection();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: row, alignItems: 'center', gap: 13, paddingVertical: 13, borderBottomWidth: divider ? 1 : 0, borderBottomColor: colors.hairline, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <IconBadge name={icon} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText weight="semibold" size={14.5} color={colors.text}>{label}</AppText>
        {sublabel && <AppText size={12} color={colors.t50} style={{ marginTop: 3 }}>{sublabel}</AppText>}
      </View>
      <Icon name="chevronRight" size={16} color={colors.t50} strokeWidth={2} />
    </Pressable>
  );
}
