import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { HADITH_BOOKS } from '../api/hadith';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HadithScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { row } = useDirection();
  const navigation = useNavigation<Nav>();

  return (
    <ScreenScaffold title={t('hadith')}>
      <CardStack>
        {HADITH_BOOKS.map((b) => (
          <Card key={b.id}>
            <Pressable
              onPress={() => navigation.navigate('HadithBook', { bookId: b.id, nameEn: b.nameEn })}
              style={{ flexDirection: row, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flex: 1 }}>
                <AppText size={14} weight="semibold" color={colors.text}>
                  {b.nameEn}
                </AppText>
              </View>
              <ArabicText color={colors.t70} style={{ fontSize: 18 }}>
                {b.nameAr}
              </ArabicText>
            </Pressable>
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
