import React from 'react';
import { View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';

// No album content model exists yet (the design itself never wired real gallery data —
// its own "Next steps" note says real photography is still pending). Static placeholders
// stand in until the admin panel grows a Gallery collection to manage.
const THUMBS = ['Departure group photo', 'At the Haram', 'Hotel courtyard', 'Ziyarat stop'];

export function GalleryScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ScreenScaffold title={t('gallery')}>
      <CardStack>
        <Card>
          <AppText size={13} color={colors.t80} style={{ lineHeight: 20 }}>{t('galleryIntro')}</AppText>
        </Card>

        <Card padded={false} elevation="lg">
          <PlaceholderImage height={200} label="Drop a group photograph" rounded={false} />
          <AppText size={12} weight="semibold" color={colors.text} style={{ padding: 14 }}>Group departure — November 2026</AppText>
        </Card>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {THUMBS.map((caption) => (
            <View key={caption} style={{ width: '47%' }}>
              <Card padded={false}>
                <PlaceholderImage height={110} label="Drop a photo" rounded={false} />
                <AppText size={11.5} weight="semibold" color={colors.text} style={{ padding: 10 }}>{caption}</AppText>
              </Card>
            </View>
          ))}
        </View>

        <Button label={t('addPhotos')} variant="primary" icon="plus" block onPress={() => {}} />
        <AppText size={12} color={colors.t50} style={{ lineHeight: 17, paddingHorizontal: 2 }}>{t('galleryNote')}</AppText>
      </CardStack>
    </ScreenScaffold>
  );
}
