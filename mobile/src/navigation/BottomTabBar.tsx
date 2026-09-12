import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Icon, type IconName } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { radius, shadow } from '../theme/tokens';
import type { RootStackParamList, TabSection } from './types';
import { navigate } from './navigationRef';

const TABS: { section: TabSection; icon: IconName; labelKey: 'tHome' | 'tGuide' | 'tPack' | 'tNews' | 'tMore'; target: keyof RootStackParamList }[] = [
  { section: 'home', icon: 'navHome', labelKey: 'tHome', target: 'Home' },
  { section: 'guide', icon: 'navGuide', labelKey: 'tGuide', target: 'GuideHub' },
  { section: 'packages', icon: 'packages', labelKey: 'tPack', target: 'Packages' },
  { section: 'news', icon: 'navNews', labelKey: 'tNews', target: 'News' },
  { section: 'more', icon: 'navMore', labelKey: 'tMore', target: 'More' },
];

export function BottomTabBar({ active }: { active: TabSection }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.bg, paddingBottom: Math.max(insets.bottom, 10), paddingHorizontal: 12, paddingTop: 8 }}>
      <View style={[{ flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: 8, paddingHorizontal: 6 }, shadow(colors, 'lg')]}>
        {TABS.map((tab) => {
          const isActive = tab.section === active;
          return (
            <Pressable
              key={tab.section}
              onPress={() => navigate(tab.target as never)}
              accessibilityRole="button"
              accessibilityLabel={t(tab.labelKey)}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 8,
                  paddingHorizontal: isActive ? 14 : 10,
                  borderRadius: radius.pill,
                  backgroundColor: isActive ? colors.accent100 : 'transparent',
                }}
              >
                <Icon name={tab.icon} size={18} color={isActive ? colors.accent : colors.t50} strokeWidth={1.9} />
                {isActive && (
                  <AppText size={11.5} weight="semibold" color={colors.accent}>{t(tab.labelKey)}</AppText>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
