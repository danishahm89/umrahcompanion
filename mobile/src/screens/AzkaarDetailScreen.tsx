import React from 'react';
import { View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useAzkaar } from '../api/hooks';
import { radius } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type DetailRoute = RouteProp<RootStackParamList, 'AzkaarDetail'>;

export function AzkaarDetailScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const route = useRoute<DetailRoute>();
  const { data: categories } = useAzkaar();
  const category = categories?.find((c) => c.id === route.params.categoryId);
  const azkaar = category?.azkaar.find((a) => a.id === route.params.azkaarId);

  return (
    <ScreenScaffold title={category ? field(category.nameEn, category.nameHi, category.nameUr) : t('azkaar')}>
      <CardStack>
        {azkaar && (
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {category ? field(category.nameEn, category.nameHi, category.nameUr) : ''}
              </AppText>
              {azkaar.repeat > 1 && (
                <View
                  style={{
                    backgroundColor: colors.goldLight,
                    borderRadius: radius.pill,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                  }}
                >
                  <AppText size={11.5} weight="semibold" color={colors.goldDeep}>
                    {t('repeatTimes').replace('{n}', String(azkaar.repeat))}
                  </AppText>
                </View>
              )}
            </View>
            <ArabicText color={colors.text} style={{ marginTop: 14 }}>
              {azkaar.arabic}
            </ArabicText>
            <View
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.hairline,
              }}
            >
              <AppText
                size={12.5}
                color={colors.t50}
                style={{ fontStyle: 'italic', lineHeight: 19, textAlign: 'left', writingDirection: 'ltr' }}
              >
                {azkaar.transliteration}
              </AppText>
              <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                {field(azkaar.meaningEn, azkaar.meaningHi, azkaar.meaningUr)}
              </AppText>
            </View>
          </Card>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
