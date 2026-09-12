import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { IconButton } from './Button';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage, type Lang } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { radius, shadow } from '../theme/tokens';

const LANG_LABEL: Record<Lang, string> = { en: 'EN', hi: 'हिं', ur: 'اردو' };

export function Header({ title, canBack, onBack }: { title: string; canBack?: boolean; onBack?: () => void }) {
  const { colors, isDark, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { row } = useDirection();
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ backgroundColor: colors.bg, paddingTop: insets.top + 8, zIndex: 2 }, shadow(colors, 'sm')]}>
      <View style={{ flexDirection: row, alignItems: 'flex-start', gap: 10, paddingHorizontal: 16, paddingBottom: 12 }}>
        {canBack ? (
          <IconButton name="back" color={colors.text} onPress={onBack} accessibilityLabel="Back" />
        ) : (
          <View style={{ width: 22 }} />
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="display" size={20} color={colors.text} style={{ letterSpacing: -0.2 }}>{title}</AppText>
          <AppText size={10} color={colors.t50} style={{ letterSpacing: 1, textTransform: 'uppercase', marginTop: 3 }}>
            {t('by')}
          </AppText>
        </View>
        <View style={{ flexDirection: row, gap: 6, alignItems: 'center' }}>
          <IconButton
            name={isDark ? 'moon' : 'sun'}
            color={colors.text}
            onPress={toggle}
            accessibilityLabel="Toggle theme"
          />
          <View style={{ flexDirection: row, backgroundColor: colors.neutral100, borderRadius: radius.pill, padding: 3, gap: 1 }}>
            {(['en', 'hi', 'ur'] as Lang[]).map((code) => {
              const active = lang === code;
              return (
                <Pressable
                  key={code}
                  onPress={() => setLang(code)}
                  style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: active ? colors.accent : 'transparent' }}
                >
                  <AppText size={11.5} weight={active ? 'semibold' : 'regular'} color={active ? '#fff' : colors.text}>
                    {LANG_LABEL[code]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
