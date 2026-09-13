import React, { useEffect, useMemo, useState } from 'react';
import { View, type DimensionValue } from 'react-native';
import * as Location from 'expo-location';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { LocationBar } from '../components/LocationBar';
import { Icon } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppLocation } from '../location/LocationContext';
import { computeDistanceToKaabaKm, computeQiblaBearing } from '../utils/qibla';

const DIAL_SIZE = 240;

const RING_LABELS: { dir: string; style: { top?: number; bottom?: number; left?: DimensionValue; right?: number; marginLeft?: number; marginTop?: number } }[] = [
  { dir: 'N', style: { top: 10, left: '50%', marginLeft: -6 } },
  { dir: 'E', style: { top: DIAL_SIZE / 2 - 8, right: 12 } },
  { dir: 'S', style: { bottom: 10, left: '50%', marginLeft: -6 } },
  { dir: 'W', style: { top: DIAL_SIZE / 2 - 8, left: 12 } },
];

export function QiblaScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { location } = useAppLocation();
  const [heading, setHeading] = useState<number | null>(null);
  const [headingError, setHeadingError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let cancelled = false;
    (async () => {
      // Don't assume permission is already granted just because a location is set — it
      // could have come from typing a city manually, which never touches permissions at
      // all. Request (or confirm) it explicitly before subscribing to heading updates.
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== 'granted') {
        setHeadingError('Location permission is off, so the compass can’t get your device’s heading.');
        return;
      }
      try {
        const sub = await Location.watchHeadingAsync((h) => {
          setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
        });
        if (cancelled) sub.remove();
        else subscription = sub;
      } catch (err) {
        if (!cancelled) setHeadingError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  const qiblaBearing = useMemo(() => (location ? computeQiblaBearing(location.lat, location.lng) : null), [location]);
  const distanceKm = useMemo(() => (location ? computeDistanceToKaabaKm(location.lat, location.lng) : null), [location]);

  const dialRotation = heading != null ? -heading : 0;
  const needleRotation = (qiblaBearing ?? 0) - (heading ?? 0);

  return (
    <ScreenScaffold title={t('qibla')}>
      <CardStack>
        <LocationBar />

        {!location && (
          <Card>
            <AppText size={13.5} color={colors.t70}>{t('setLocationFirst')}</AppText>
          </Card>
        )}

        {location && (
          <>
            <AppText size={12.5} color={colors.t70} style={{ lineHeight: 18, paddingHorizontal: 2 }}>{t('qiblaIntro')}</AppText>

            <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
              <View style={{ width: DIAL_SIZE, height: DIAL_SIZE, alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    position: 'absolute',
                    width: DIAL_SIZE,
                    height: DIAL_SIZE,
                    borderRadius: DIAL_SIZE / 2,
                    borderWidth: 2,
                    borderColor: colors.hairline,
                    transform: [{ rotate: `${dialRotation}deg` }],
                  }}
                >
                  {RING_LABELS.map((l) => (
                    <View key={l.dir} style={[{ position: 'absolute' }, l.style]}>
                      <AppText weight="semibold" size={13} color={l.dir === 'N' ? colors.accent : colors.t50}>{l.dir}</AppText>
                    </View>
                  ))}
                </View>

                <View
                  style={{
                    position: 'absolute',
                    width: DIAL_SIZE,
                    height: DIAL_SIZE,
                    alignItems: 'center',
                    transform: [{ rotate: `${needleRotation}deg` }],
                  }}
                >
                  <Icon name="pin" size={30} color={colors.gold} strokeWidth={2} />
                </View>

                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent }} />
              </View>

              <AppText weight="display" size={22} color={colors.text} style={{ marginTop: 22 }}>
                {Math.round(qiblaBearing ?? 0)}° {t('fromNorth')}
              </AppText>
              {distanceKm != null && (
                <AppText size={12.5} color={colors.t50} style={{ marginTop: 4 }}>
                  {distanceKm.toLocaleString()} km {t('toKaaba')}
                </AppText>
              )}
              {heading == null && (
                <AppText size={12} color={colors.t50} style={{ marginTop: 14, textAlign: 'center', lineHeight: 17 }}>
                  {t('compassUnavailable')}{headingError ? ` (${headingError})` : ''}
                </AppText>
              )}
            </Card>
          </>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
