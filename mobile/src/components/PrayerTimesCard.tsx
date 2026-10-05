import React, { useMemo, useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
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

// A17: Color-coded by time of day
const PRAYER_COLORS: Record<PrayerKey, { bg: string; accent: string }> = {
  fajr:    { bg: 'rgba(59,130,246,0.13)',  accent: '#3B82F6' },
  sunrise: { bg: 'rgba(249,115,22,0.13)',  accent: '#F97316' },
  dhuhr:   { bg: 'rgba(234,179,8,0.13)',   accent: '#CA8A04' },
  asr:     { bg: 'rgba(245,158,11,0.13)',  accent: '#D97706' },
  maghrib: { bg: 'rgba(239,68,68,0.13)',   accent: '#DC2626' },
  isha:    { bg: 'rgba(139,92,246,0.13)',  accent: '#7C3AED' },
};

// A10: Skeleton placeholder row
function SkeletonRow({ colors }: { colors: any }) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });
  return (
    <Animated.View style={{ opacity, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
      <View style={{ width: 70, height: 14, borderRadius: radius.sm, backgroundColor: colors.neutral100 }} />
      <View style={{ width: 55, height: 14, borderRadius: radius.sm, backgroundColor: colors.neutral100 }} />
    </Animated.View>
  );
}

export function PrayerTimesCard() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { row } = useDirection();
  const { location } = useAppLocation();

  const times = useMemo(() => (location ? computePrayerTimes(location.lat, location.lng) : null), [location]);
  const next = useMemo(() => (times ? findNextPrayer(times) : null), [times]);

  // A5: Pulse animation for next prayer
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!next) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [next?.key]);

  return (
    <Card>
      <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'baseline' }}>
        <AppText weight="display" size={17} color={colors.text}>{t('prayerTimes')}</AppText>
        <AppText size={11} color={colors.t50}>{t('calcMethodNote')}</AppText>
      </View>

      <View style={{ marginTop: 14, gap: 2 }}>
        {!location || !times
          ? [0, 1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} colors={colors} />)
          : times.map((entry) => {
              const isNext = next?.key === entry.key;
              const pColor = PRAYER_COLORS[entry.key];
              return isNext ? (
                <Animated.View
                  key={entry.key}
                  style={{
                    flexDirection: row,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 9,
                    paddingHorizontal: 10,
                    borderRadius: radius.md,
                    backgroundColor: pColor.bg,
                    transform: [{ scale: pulseAnim }],
                  }}
                >
                  <View style={{ flexDirection: row, alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: pColor.accent }} />
                    <AppText weight="semibold" size={14} color={pColor.accent}>
                      {t(LABEL_KEYS[entry.key])}
                    </AppText>
                    <AppText size={10} weight="semibold" color={colors.gold} style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t('nextPrayerLabel')}
                    </AppText>
                  </View>
                  <AppText weight="semibold" size={14} color={pColor.accent}>
                    {formatPrayerTime(entry.time)}
                  </AppText>
                </Animated.View>
              ) : (
                <View
                  key={entry.key}
                  style={{
                    flexDirection: row,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 9,
                    paddingHorizontal: 0,
                    borderRadius: radius.md,
                    backgroundColor: 'transparent',
                  }}
                >
                  <AppText weight="regular" size={14} color={colors.text}>
                    {t(LABEL_KEYS[entry.key])}
                  </AppText>
                  <AppText weight="regular" size={14} color={colors.t80}>
                    {formatPrayerTime(entry.time)}
                  </AppText>
                </View>
              );
            })}
      </View>
    </Card>
  );
}
