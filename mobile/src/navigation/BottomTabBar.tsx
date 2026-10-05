import React, { useRef, useEffect, useState } from 'react';
import { Pressable, View, Animated, LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Icon } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { radius, shadow } from '../theme/tokens';
import type { TabSection } from './types';
import { TAB_SCREEN_MAP } from './types';
import { navigate } from './navigationRef';

const TABS: { key: TabSection; labelKey: string; icon: string }[] = [
  { key: 'home',     screen: 'Home',     labelKey: 'navHome',    icon: 'navHome'     },
  { key: 'guide',    screen: 'GuideHub', labelKey: 'navGuide',   icon: 'navGuide'    },
  { key: 'packages', screen: 'Packages', labelKey: 'packages',   icon: 'packages' },
  { key: 'news',     screen: 'News',     labelKey: 'navNews',    icon: 'navNews'     },
  { key: 'more',     screen: 'More',     labelKey: 'navMore',    icon: 'navMore'     },
];

export function BottomTabBar({ active }: { active: TabSection }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  // A6: Animated pill indicator
  const pillAnim = useRef(new Animated.Value(0)).current;
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [tabOffsets, setTabOffsets] = useState<number[]>([]);

  const activeIndex = TABS.findIndex(t => t.key === active);

  useEffect(() => {
    if (tabOffsets.length === 0 || activeIndex < 0) return;
    const targetX = tabOffsets[activeIndex] ?? 0;
    Animated.spring(pillAnim, {
      toValue: targetX,
      useNativeDriver: true,
      tension: 68,
      friction: 11,
    }).start();
  }, [activeIndex, tabOffsets]);

  const pillWidth = tabWidths[activeIndex] ?? 0;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.hairline,
        paddingBottom: insets.bottom,
        ...shadow(colors, 'sm'),
      }}
    >
      {/* A6: Sliding pill background */}
      {pillWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 6,
            height: 40,
            width: pillWidth,
            borderRadius: radius.pill,
            backgroundColor: colors.accent100,
            transform: [{ translateX: pillAnim }],
          }}
        />
      )}

      <View style={{ flexDirection: 'row' }}>
        {TABS.map((tab, idx) => {
          const isActive = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onLayout={(e: LayoutChangeEvent) => {
                const { x, width } = e.nativeEvent.layout;
                setTabWidths(prev => {
                  const next = [...prev];
                  next[idx] = width;
                  return next;
                });
                setTabOffsets(prev => {
                  const next = [...prev];
                  next[idx] = x;
                  return next;
                });
              }}
              onPress={() => (navigate as any)(TAB_SCREEN_MAP[tab.key] ?? tab.key)}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 10, paddingTop: 14 }}
            >
              <Icon
                name={tab.icon as any}
                size={22}
                color={isActive ? colors.accent : colors.t50}
              />
              <AppText
                size={10}
                weight={isActive ? 'semibold' : 'regular'}
                color={isActive ? colors.accent : colors.t50}
                style={{ marginTop: 2 }}
              >
                {t(tab.labelKey as any)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
