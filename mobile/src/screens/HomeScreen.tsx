import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { IconBadge } from '../components/IconBadge';
import { LocationBar } from '../components/LocationBar';
import { PrayerTimesCard } from '../components/PrayerTimesCard';
import type { IconName } from '../components/Icon';
import { Tag } from '../components/Tag';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useGuideSteps, useNews } from '../api/hooks';
import { usePersistentState } from '../storage/usePersistentState';
import { relativeTime } from '../utils/relativeTime';
import { radius } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK: { icon: IconName; labelKey: 'firsttime' | 'duas' | 'azkaar' | 'packing' | 'vaccine' | 'nusuk' | 'packages' | 'nearbyMosques' | 'qibla'; target: keyof RootStackParamList }[] = [
  { icon: 'firstTime', labelKey: 'firsttime', target: 'FirstTime' },
  { icon: 'duas', labelKey: 'duas', target: 'Duas' }, { icon: 'duas', labelKey: 'azkaar', target: 'Azkaar' },
  { icon: 'packing', labelKey: 'packing', target: 'Packing' },
  { icon: 'vaccine', labelKey: 'vaccine', target: 'Vaccine' },
  { icon: 'nusuk', labelKey: 'nusuk', target: 'Nusuk' },
  { icon: 'packages', labelKey: 'packages', target: 'Packages' },
  { icon: 'mosque', labelKey: 'nearbyMosques', target: 'NearbyMosques' },
  { icon: 'compass', labelKey: 'qibla', target: 'Qibla' },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { t, lang, field } = useLanguage();
  const { row } = useDirection();
  const { data: news } = useNews();
  const { data: steps } = useGuideSteps();
  const [done] = usePersistentState<Record<number, boolean>>('guide-steps-done', {});

  const doneCount = Object.values(done).filter(Boolean).length;
  const totalSteps = steps?.length ?? 6;

  return (
    <ScreenScaffold title={t('home')} scroll contentContainerStyle={{ paddingBottom: 8 }}>
      <CardStack style={{ paddingBottom: 0 }}>
        <LocationBar />
        <PrayerTimesCard />

        <Card>
          <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'baseline' }}>
            <AppText weight="display" size={17} color={colors.text}>{t('progress')}</AppText>
            <AppText weight="semibold" size={12} color={colors.gold}>{doneCount}/{totalSteps}</AppText>
          </View>
          <View style={{ flexDirection: row, gap: 4, marginTop: 12, marginBottom: 16 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 7, borderRadius: radius.pill, backgroundColor: done[i] ? colors.accent : colors.neutral100 }} />
            ))}
          </View>
          <Button label={t('continueGuide')} variant="primary" icon="arrowRight" block onPress={() => navigation.navigate('FirstTime')} />
        </Card>

        <Card padded={false}>
          <AppText weight="display" size={16} color={colors.text} style={{ padding: 16, paddingBottom: 8 }}>{t('quick')}</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {QUICK.map((q) => (
              <Pressable
                key={q.target}
                onPress={() => navigation.navigate(q.target as never)}
                style={{ width: '50%', padding: 14, alignItems: 'flex-start', gap: 10 }}
              >
                <IconBadge name={q.icon} />
                <AppText weight="semibold" size={13.5} color={colors.text}>{t(q.labelKey)}</AppText>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card padded={false}>
          <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'baseline', padding: 16, paddingBottom: 8 }}>
            <AppText weight="display" size={16} color={colors.text}>{t('latest')}</AppText>
            <AppText size={12} weight="semibold" color={colors.accent} onPress={() => navigation.navigate('News')}>{t('viewAll')}</AppText>
          </View>
          {(news ?? []).slice(0, 2).map((n, i, arr) => (
            <View key={n.id} style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: i === 0 ? 1 : 0, borderColor: colors.hairline, borderBottomWidth: i < arr.length - 1 ? 1 : 0 }}>
              <View style={{ flexDirection: row, gap: 8, alignItems: 'center' }}>
                <Tag label={n.source.name} />
                <AppText size={10} color={colors.t50} style={{ textTransform: 'uppercase' }}>{relativeTime(n.publishedAt, lang)}</AppText>
              </View>
              <AppText weight="semibold" size={13.5} color={colors.text} style={{ marginTop: 8 }}>
                {field(n.titleEn, n.titleHi, n.titleUr)}
              </AppText>
            </View>
          ))}
        </Card>
      </CardStack>
    </ScreenScaffold>
  );
}
