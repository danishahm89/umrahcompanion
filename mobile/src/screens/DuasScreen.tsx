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
import { useDuaStages } from '../api/hooks';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STAGE_ICON: Record<string, IconName> = {
  'Setting Out': 'external',
  Ihram: 'check',
  'Entering Masjid al-Haram': 'mosque',
  Tawaf: 'compass',
  'At the Multazam': 'duas',
  Sai: 'arrowRight',
  'Drinking Zamzam': 'vaccine',
  Halq: 'minus',
};

export function DuasScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const navigation = useNavigation<Nav>();
  const { data: stages, isLoading } = useDuaStages();

  return (
    <ScreenScaffold title={t('duas')}>
      <CardStack>
        <AppText size={12.5} color={colors.t70} style={{ paddingHorizontal: 4, lineHeight: 19 }}>
          {t('duasIntro')}
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {(stages ?? []).map((s) => (
            <Pressable
              key={s.id}
              onPress={() => navigation.navigate('DuaCategory', { stageId: s.id })}
              style={{ width: '47%' }}
            >
              <Card style={{ alignItems: 'flex-start', gap: 10, minHeight: 148 }}>
                <IconBadge name={STAGE_ICON[s.nameEn] ?? 'duas'} />
                <AppText weight="display" size={14.5} color={colors.text} style={{ lineHeight: 19 }}>
                  {field(s.nameEn, s.nameHi, s.nameUr)}
                </AppText>
                <AppText size={11.5} color={colors.t70} style={{ lineHeight: 16 }}>
                  {field(s.noteEn, s.noteHi, s.noteUr)}
                </AppText>
                <AppText size={10.5} color={colors.accent} weight="semibold" style={{ marginTop: 'auto' }}>
                  {t('duasCount').replace('{n}', String(s.duas.length))}
                </AppText>
              </Card>
            </Pressable>
          ))}
        </View>
        {isLoading && (
          <AppText size={13} color={colors.t70} style={{ textAlign: 'center', marginTop: 12 }}>
            {t('loading') ?? '...'}
          </AppText>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
