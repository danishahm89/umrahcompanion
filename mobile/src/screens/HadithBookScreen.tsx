import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useHadithBook } from '../api/hadith';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type BookRoute = RouteProp<RootStackParamList, 'HadithBook'>;

export function HadithBookScreen() {
  const { colors } = useTheme();
  const { t, lang, field } = useLanguage();
  const { row, textAlign, writingDirection } = useDirection();
  const navigation = useNavigation<Nav>();
  const route = useRoute<BookRoute>();
  const { bookId, nameEn, nameHi, nameUr } = route.params;
  const [query, setQuery] = useState('');

  const { data, isLoading, isError } = useHadithBook(bookId, lang);
  const hindiBlocked = lang === 'hi';

  const sections = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.metadata.sections).filter(([num, name]) => num !== '0' && !!name);
  }, [data]);

  const searchResults = useMemo(() => {
    if (!data || query.trim().length < 3) return [];
    const q = query.trim().toLowerCase();
    return data.hadiths.filter((h) => h.text.toLowerCase().includes(q)).slice(0, 50);
  }, [data, query]);

  const showSearch = query.trim().length >= 3;

  return (
    <ScreenScaffold title={field(nameEn, nameHi ?? nameEn, nameUr ?? nameEn)}>
      <CardStack>
        {hindiBlocked && (
          <AppText size={12} color={colors.t70} style={{ padding: 12, textAlign: 'center' }}>
            {t('hindiNotSupported')}
          </AppText>
        )}
        {!hindiBlocked && isLoading && <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />}
        {!hindiBlocked && isError && (
          <AppText size={13.5} color={colors.t70} style={{ padding: 16, textAlign: 'center' }}>
            {t('quranLoadError')}
          </AppText>
        )}
        {!hindiBlocked && data && (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('hadithSearchPlaceholder')}
            placeholderTextColor={colors.t50}
            style={{
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              fontSize: 14,
              color: colors.text,
              textAlign,
              writingDirection,
              marginBottom: 4,
            }}
          />
        )}

        {!hindiBlocked && showSearch
          ? searchResults.map((h) => (
              <Card key={h.hadithnumber}>
                <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2 }}>
                  #{h.hadithnumber}
                </AppText>
                <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                  {h.text}
                </AppText>
              </Card>
            ))
          : sections.map(([num, name]) => (
              <Card key={num}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('HadithChapter', {
                      bookId,
                      nameEn,
                      chapterNumber: Number(num),
                      chapterName: name,
                    })
                  }
                  style={{ flexDirection: row, alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <View style={{ flex: 1, flexDirection: row, gap: 10, alignItems: 'center' }}>
                    <AppText size={11} weight="semibold" color={colors.t70}>
                      {num}.
                    </AppText>
                    <AppText size={13.5} color={colors.text} style={{ flex: 1 }}>
                      {name}
                    </AppText>
                  </View>
                </Pressable>
              </Card>
            ))}

        {showSearch && searchResults.length === 0 && (
          <AppText size={13} color={colors.t70} style={{ padding: 16, textAlign: 'center' }}>
            {t('hadithNoResults')}
          </AppText>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
