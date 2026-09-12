import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Tag } from '../components/Tag';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useNews } from '../api/hooks';
import { relativeTime } from '../utils/relativeTime';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NewsScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { t, lang, field } = useLanguage();
  const { row } = useDirection();
  const { data: news } = useNews();

  return (
    <ScreenScaffold title={t('news')}>
      <CardStack>
        <Card>
          <View style={{ flexDirection: row, alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
            <AppText size={11.5} color={colors.t70} style={{ flex: 1 }}>{t('syncNote')}</AppText>
          </View>
        </Card>

        {(news ?? []).map((n) => (
          <Card key={n.id}>
            <View style={{ flexDirection: row, gap: 8, alignItems: 'center' }}>
              <Tag label={n.source.name} />
              <AppText size={10} color={colors.t50} style={{ letterSpacing: 0.5, textTransform: 'uppercase' }}>{relativeTime(n.publishedAt, lang)}</AppText>
            </View>
            <AppText weight="display" size={17} color={colors.text} style={{ marginTop: 10, lineHeight: 23 }}>
              {field(n.titleEn, n.titleHi, n.titleUr)}
            </AppText>
            <AppText size={13} color={colors.t70} style={{ marginTop: 6, lineHeight: 19 }}>
              {field(n.bodyEn, n.bodyHi, n.bodyUr)}
            </AppText>
          </Card>
        ))}

        <Button label={t('nusuk')} variant="secondary" block onPress={() => navigation.navigate('Nusuk')} />
      </CardStack>
    </ScreenScaffold>
  );
}
