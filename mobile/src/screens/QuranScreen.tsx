import React from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useQuranSurahList } from '../api/quran';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function QuranScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLanguage();
  const { row } = useDirection();
  const navigation = useNavigation<Nav>();
  const { data: surahs, isLoading, isError } = useQuranSurahList();
  const hindiBlocked = lang === 'hi';

  return (
    <ScreenScaffold title={t('quran')}>
      <CardStack>
        {hindiBlocked && (
          <AppText size={13.5} color={colors.t70} style={{ padding: 16, textAlign: 'center' }}>
            {t('hindiNotSupported')}
          </AppText>
        )}
        {!hindiBlocked && isLoading && <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />}
        {!hindiBlocked && isError && (
          <AppText size={13.5} color={colors.t70} style={{ padding: 16, textAlign: 'center' }}>
            {t('quranLoadError')}
          </AppText>
        )}
        {!hindiBlocked && (surahs ?? []).map((s) => (
          <Card key={s.number}>
            <Pressable
              onPress={() => navigation.navigate('QuranSurah', { number: s.number })}
              style={{ flexDirection: row, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: row, alignItems: 'center', gap: 12, flex: 1 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.neutral100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppText size={11} weight="semibold" color={colors.t70}>
                    {s.number}
                  </AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText size={14} weight="semibold" color={colors.text}>
                    {s.englishName}
                  </AppText>
                  <AppText size={12} color={colors.t70} style={{ marginTop: 2 }}>
                    {s.englishNameTranslation} · {s.numberOfAyahs} {t('ayahs')}
                  </AppText>
                </View>
              </View>
              <AppText size={16} color={colors.text}>
                {s.name}
              </AppText>
            </Pressable>
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
