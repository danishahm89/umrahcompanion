import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { IconBadge } from '../components/IconBadge';
import type { IconName } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useAzkaar } from '../api/hooks';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ICON: Record<string, IconName> = {
  'Morning Azkaar': 'sun',
  'Evening Azkaar': 'moon',
  'After Every Salah': 'check',
};

export function AzkaarScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const navigation = useNavigation<Nav>();
  const { data: categories } = useAzkaar();

  return (
    <ScreenScaffold title={t('azkaar')}>
      <CardStack>
        <AppText size={12.5} color={colors.t70} style={{ paddingHorizontal: 4, lineHeight: 19 }}>
          {t('azkarIntro')}
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {(categories ?? []).map((c) => (
            <Pressable
              key={c.id}
              onPress={() => navigation.navigate('AzkaarCategory', { categoryId: c.id })}
              style={{ width: '47%' }}
            >
              <Card style={{ alignItems: 'flex-start', gap: 10, minHeight: 148 }}>
                <IconBadge name={CATEGORY_ICON[c.nameEn] ?? 'duas'} tone="gold" />
                <AppText weight="display" size={14.5} color={colors.text} style={{ lineHeight: 19 }}>
                  {field(c.nameEn, c.nameHi, c.nameUr)}
                </AppText>
                <AppText size={11.5} color={colors.t70} style={{ lineHeight: 16 }}>
                  {field(c.noteEn, c.noteHi, c.noteUr)}
                </AppText>
                <AppText size={10.5} color={colors.accent} weight="semibold" style={{ marginTop: 'auto' }}>
                  {t('azkarCount').replace('{n}', String(c.azkaar.length))}
                </AppText>
              </Card>
            </Pressable>
          ))}
        </View>
      </CardStack>
    </ScreenScaffold>
  );
}
