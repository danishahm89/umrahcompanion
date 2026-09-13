import React from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { IconBadge } from '../components/IconBadge';
import { LocationBar } from '../components/LocationBar';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useAppLocation } from '../location/LocationContext';
import { useNearbyMosques } from '../api/hooks';

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function NearbyMosquesScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { row } = useDirection();
  const { location } = useAppLocation();
  const { data: mosques, isLoading, isError, error, refetch, isRefetching } = useNearbyMosques(location?.lat, location?.lng);

  return (
    <ScreenScaffold title={t('nearbyMosques')}>
      <CardStack>
        <LocationBar />

        {!location && (
          <Card>
            <AppText size={13.5} color={colors.t70}>{t('setLocationFirst')}</AppText>
          </Card>
        )}

        {location && (
          <AppText size={12.5} color={colors.t70} style={{ lineHeight: 18, paddingHorizontal: 2 }}>
            {t('nearbyMosquesIntro')}
          </AppText>
        )}

        {location && isLoading && (
          <Card>
            <ActivityIndicator color={colors.accent} />
          </Card>
        )}

        {location && isError && (
          <Card>
            <AppText size={13.5} color="#C0392B">
              Could not load nearby mosques: {error instanceof Error ? error.message : 'unknown error'}
            </AppText>
            <Button label={t('search')} variant="secondary" block style={{ marginTop: 12 }} disabled={isRefetching} onPress={() => refetch()} />
          </Card>
        )}

        {location && !isLoading && !isError && mosques?.length === 0 && (
          <Card>
            <AppText size={13.5} color={colors.t70}>{t('noMosquesFound')}</AppText>
          </Card>
        )}

        {(mosques ?? []).map((m) => (
          <Card key={m.id}>
            <View style={{ flexDirection: row, alignItems: 'center', gap: 12 }}>
              <IconBadge name="mosque" tone="gold" />
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText weight="semibold" size={15} color={colors.text}>{m.name}</AppText>
                <AppText size={12.5} color={colors.t50} style={{ marginTop: 2 }}>{formatDistance(m.distanceM)}</AppText>
              </View>
            </View>
            <Button
              label={t('getDirections')}
              variant="secondary"
              icon="external"
              block
              style={{ marginTop: 14 }}
              onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`)}
            />
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
