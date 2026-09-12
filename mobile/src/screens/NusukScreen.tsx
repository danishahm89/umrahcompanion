import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { Icon } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useNusukLinks } from '../api/hooks';

export function NusukScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: links } = useNusukLinks();

  return (
    <ScreenScaffold title={t('nusuk')}>
      <CardStack>
        <Card>
          <AppText size={13} color={colors.t80} style={{ lineHeight: 20 }}>{t('nusukIntro')}</AppText>
        </Card>

        <Card padded={false}>
          {(links ?? []).map((l, i, arr) => (
            <Pressable
              key={l.id}
              onPress={() => Linking.openURL(l.url)}
              style={{ flexDirection: row, gap: 12, alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.hairline }}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText weight="display" size={15} color={colors.text}>{field(l.titleEn, l.titleHi, l.titleUr)}</AppText>
                <AppText size={12} color={colors.t50} style={{ marginTop: 4, textAlign: 'left', writingDirection: 'ltr' }}>{l.host}</AppText>
              </View>
              <Icon name="external" size={16} color={colors.accent} strokeWidth={2} />
            </Pressable>
          ))}
        </Card>
      </CardStack>
    </ScreenScaffold>
  );
}
