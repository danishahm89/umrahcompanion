import React, { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useHadithBook } from '../api/hadith';
import type { RootStackParamList } from '../navigation/types';

type ChapterRoute = RouteProp<RootStackParamList, 'HadithChapter'>;

export function HadithChapterScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLanguage();
  const route = useRoute<ChapterRoute>();
  const { bookId, chapterNumber, chapterName } = route.params;

  const { data, isLoading, isError } = useHadithBook(bookId, lang);

  const hadiths = useMemo(
    () => (data ? data.hadiths.filter((h) => h.reference.book === chapterNumber) : []),
    [data, chapterNumber]
  );

  return (
    <ScreenScaffold title={chapterName}>
      <CardStack>
        {isLoading && <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />}
        {isError && (
          <AppText size={13.5} color={colors.t70} style={{ padding: 16, textAlign: 'center' }}>
            {t('quranLoadError')}
          </AppText>
        )}
        {hadiths.map((h) => (
          <Card key={h.hadithnumber}>
            <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2 }}>
              #{h.hadithnumber}
            </AppText>
            <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
              {h.text}
            </AppText>
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
