import React from 'react';
import { View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDuaStages } from '../api/hooks';
import type { RootStackParamList } from '../navigation/types';

type DetailRoute = RouteProp<RootStackParamList, 'DuaDetail'>;

export function DuaDetailScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const route = useRoute<DetailRoute>();
  const { data: stages } = useDuaStages();
  const stage = stages?.find((s) => s.id === route.params.stageId);
  const dua = stage?.duas.find((d) => d.id === route.params.duaId);

  return (
    <ScreenScaffold title={dua ? field(dua.whenEn, dua.whenHi, dua.whenUr) : t('duas')}>
      <CardStack>
        {dua && (
          <Card>
            <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {field(dua.whenEn, dua.whenHi, dua.whenUr)}
            </AppText>
            <ArabicText color={colors.text} style={{ marginTop: 14 }}>
              {dua.arabic}
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
                {dua.transliteration}
              </AppText>
              <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                {field(dua.meaningEn, dua.meaningHi, dua.meaningUr)}
              </AppText>
            </View>
          </Card>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
