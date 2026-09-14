import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranSurah, TRANSLATION_EDITIONS } from '../api/quran';
import type { RootStackParamList } from '../navigation/types';

type SurahRoute = RouteProp<RootStackParamList, 'QuranSurah'>;

export function QuranSurahScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLanguage();
  const route = useRoute<SurahRoute>();
  const { number } = route.params;
  const edition = TRANSLATION_EDITIONS[lang] ?? TRANSLATION_EDITIONS.en;
  const { data: surah, isLoading, isError } = useQuranSurah(number, edition);

  const arabicEdition = surah?.editions.find((e) => e.identifier === 'quran-uthmani');
  const translationEditionData = surah?.editions.find((e) => e.identifier === edition);

  return (
    <ScreenScaffold title={surah ? `${surah.number}. ${surah.englishName}` : t('quran')}>
      <CardStack>
        {isLoading && <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />}
        {isError && (
          <AppText size={13.5} color={colors.t70} style={{ padding: 16, textAlign: 'center' }}>
            {t('quranLoadError')}
          </AppText>
        )}
        {surah && (
          <AppText size={12.5} color={colors.t70} style={{ paddingHorizontal: 4, marginBottom: 4 }}>
            {surah.englishNameTranslation} · {surah.revelationType} · {surah.numberOfAyahs} {t('ayahs')}
          </AppText>
        )}
        {arabicEdition?.ayahs.map((ayah, i) => (
          <Card key={ayah.number}>
            <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2 }}>
              {surah?.number}:{ayah.numberInSurah}
            </AppText>
            <ArabicText color={colors.text} style={{ marginTop: 10, lineHeight: 34 }}>
              {ayah.text}
            </ArabicText>
            <View
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: colors.hairline,
              }}
            >
              <AppText size={13.5} color={colors.text} style={{ lineHeight: 20 }}>
                {translationEditionData?.ayahs[i]?.text}
              </AppText>
            </View>
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
