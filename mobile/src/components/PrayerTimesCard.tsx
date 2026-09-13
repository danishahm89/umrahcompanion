import React, { useMemo } from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { Card } from './Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useAppLocation } from '../location/LocationContext';
import { computePrayerTimes, findNextPrayer, formatPrayerTime, type PrayerKey } from '../utils/prayerTimes';
import { radius } from '../theme/tokens';

const LABEL_KEYS: Record<PrayerKey, 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'> = {
  fajr: 'fajr',
  sunrise: 'sunrise',
  dhuhr: 'dhuhr',
  asr: 'asr',
  maghrib: 'maghrib',
  isha: 'isha',
};

export function PrayerTimesCard() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { row } = useDirection();
  const { location } = useAppLocation();

  const times = useMemo(() => (location ? computePrayerTimes(location.lat, location.lng) : null), [location]);
  const next = useMemo(() => (times ? findNextPrayer(times) : null), [times]);

  if (!location || !times) return null;

  return (
    <Card>
      <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'baseline' }}>
        <AppText weight="display" size={17} color={colors.text}>{t('prayerTimes')}</AppText>
        <AppText size={11} color={colors.t50}>{t('calcMethodNote')}</AppText>
      </View>

      <View style={{ marginTop: 14, gap: 2 }}>
        {times.map((entry) => {
          const isNext = next?.key === entry.key;
          return (
            <View
              key={entry.key}
              style={{
                flexDirection: row,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 9,
                paddingHorizontal: isNext ? 10 : 0,
                borderRadius: radius.md,
                backgroundColor: isNext ? colors.accent100 : 'transparent',
              }}
            >
              <View style={{ flexDirection: row, alignItems: 'center', gap: 8 }}>
                <AppText weight={isNext ? 'semibold' : 'regular'} size={14} color={isNext ? colors.accent : colors.text}>
                  {t(LABEL_KEYS[entry.key])}
                </AppText>
                {isNext && (
                  <AppText size={10} weight="semibold" color={colors.gold} style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {t('nextPrayerLabel')}
                  </AppText>
                )}
              </View>
              <AppText weight={isNext ? 'semibold' : 'regular'} size={14} color={isNext ? colors.accent : colors.t80}>
                {formatPrayerTime(entry.time)}
              </AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
