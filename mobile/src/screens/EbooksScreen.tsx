import React from 'react';
import { Image, Linking } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useEbooks } from '../api/hooks';

export function EbooksScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { data: ebooks } = useEbooks();

  return (
    <ScreenScaffold title={t('ebooks')}>
      <CardStack>
        <AppText size={12.5} color={colors.t70} style={{ lineHeight: 18, paddingHorizontal: 2 }}>{t('ebooksIntro')}</AppText>

        {ebooks?.length === 0 && (
          <Card>
            <AppText size={13.5} color={colors.t70}>{t('noEbooks')}</AppText>
          </Card>
        )}

        {(ebooks ?? []).map((e) => (
          <Card key={e.id} padded={false}>
            {e.coverImageUrl ? (
              <Image source={{ uri: e.coverImageUrl }} style={{ height: 140, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }} resizeMode="cover" />
            ) : (
              <PlaceholderImage height={140} label={field(e.titleEn, e.titleHi, e.titleUr)} rounded={false} />
            )}
            <AppText weight="display" size={18} color={colors.text} style={{ padding: 16, paddingBottom: 6 }}>
              {field(e.titleEn, e.titleHi, e.titleUr)}
            </AppText>
            <AppText size={13} color={colors.t70} style={{ paddingHorizontal: 16, lineHeight: 19 }}>
              {field(e.descEn, e.descHi, e.descUr)}
            </AppText>
            <Button
              label={t('openEbook')}
              variant="primary"
              icon="external"
              block
              style={{ margin: 16, marginTop: 14 }}
              onPress={() => Linking.openURL(e.driveUrl)}
            />
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
