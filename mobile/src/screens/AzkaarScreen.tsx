import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useAzkaar } from '../api/hooks';
import { radius } from '../theme/tokens';

export function AzkaarScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: categories } = useAzkaar();
  const [categoryIndex, setCategoryIndex] = useState(0);

  const category = categories?.[categoryIndex];

  return (
    <ScreenScaffold title={t('azkaar')}>
      <CardStack>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 4, backgroundColor: colors.neutral100, borderRadius: radius.pill, padding: 4 }}
        >
          {(categories ?? []).map((c, i) => {
            const active = i === categoryIndex;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoryIndex(i)}
                style={{ alignItems: 'center', paddingVertical: 9, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: active ? colors.accent : 'transparent' }}
              >
                <AppText size={12.5} weight={active ? 'semibold' : 'regular'} color={active ? '#fff' : colors.text}>{field(c.nameEn, c.nameHi, c.nameUr)}</AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {category && (
          <AppText size={12.5} color={colors.t70} style={{ lineHeight: 19, paddingHorizontal: 4 }}>
            {field(category.noteEn, category.noteHi, category.noteUr)}
          </AppText>
        )}

        {(category?.azkaar ?? []).map((a) => (
          <Card key={a.id}>
            {a.repeat > 1 && (
              <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {t('repeatTimes').replace('{n}', String(a.repeat))}
              </AppText>
            )}
            <ArabicText color={colors.text} style={{ marginTop: a.repeat > 1 ? 6 : 0 }}>{a.arabic}</ArabicText>
            <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.hairline }}>
              <AppText
                size={12.5}
                color={colors.t50}
                style={{ fontStyle: 'italic', lineHeight: 19, textAlign: 'left', writingDirection: 'ltr' }}
              >
                {a.transliteration}
              </AppText>
              <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                {field(a.meaningEn, a.meaningHi, a.meaningUr)}
              </AppText>
            </View>
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
