import React, { useRef, useEffect, useState } from 'react';
import { Pressable, View, Animated, Platform, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useGuideSteps, useNews, usePackages } from '../api/hooks';
import { usePersistentState } from '../storage/usePersistentState';
import { relativeTime } from '../utils/relativeTime';
import { radius } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK: { icon: IconName; labelKey: 'firsttime' | 'duas' | 'azkaar' | 'quran' | 'hadith' | 'packing' | 'vaccine' | 'nusuk' | 'packages' | 'nearbyMosques' | 'qibla'; target: keyof RootStackParamList }[] = [
  { icon: 'firstTime', labelKey: 'firsttime', target: 'FirstTime' },
  { icon: 'duas', labelKey: 'duas', target: 'Duas' },
  { icon: 'duas', labelKey: 'azkaar', target: 'Azkaar' },
  { icon: 'book', labelKey: 'quran', target: 'Quran' },
  { icon: 'contact', labelKey: 'hadith', target: 'Hadith' },
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
  const { data: packages } = usePackages();

  const doneCount = Object.values(done).filter(Boolean).length;
  const totalSteps = steps?.length ?? 6;

  // A3: Staggered card entrance animations
  const sectionAnims = useRef(
    [0, 1, 2, 3, 4].map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    const animations = sectionAnims.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 350,
          delay: 80 + i * 90,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          delay: 80 + i * 90,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(animations).start();
  }, []);

  // A4: Quick-grid staggered fade-in
  const quickAnims = useRef(QUICK.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const animations = quickAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 280,
        delay: 300 + i * 55,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, []);

  // A18: Quick grid item press state
  const [activeQuick, setActiveQuick] = useState<string | null>(null);

  // A19/A20: PWA install prompts (web only)
  const [showAndroidInstall, setShowAndroidInstall] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) return;
      const handler = (e: Event) => {
        e.preventDefault();
        deferredPromptRef.current = e;
        setShowAndroidInstall(true);
      };
      window.addEventListener('beforeinstallprompt', handler as EventListener);
      const ua = navigator.userAgent;
      const isIOS = /iphone|ipad|ipod/i.test(ua);
      const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
      if (isIOS && isSafari) setShowIosInstall(true);
      return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
    } catch (_) {}
  }, []);

  // A21-A25: 30s package popup
  const [showPackagePopup, setShowPackagePopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const popupAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (popupShown) return;
    const timer = setTimeout(() => {
      setPopupShown(true);
      setShowPackagePopup(true);
      Animated.spring(popupAnim, { toValue: 1, tension: 65, friction: 9, useNativeDriver: true }).start();
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const earliestPackage = packages?.[0] ?? null;
  const closePopup = () => {
    Animated.timing(popupAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setShowPackagePopup(false));
  };

  const animSection = (idx: number) => ({
    opacity: sectionAnims[idx].opacity,
    transform: [{ translateY: sectionAnims[idx].translateY }],
  });

  return (
    <ScreenScaffold title={t('home')} scroll contentContainerStyle={{ paddingBottom: 8 }}>
      <CardStack style={{ paddingBottom: 0 }}>
        {/* A19: Android install banner */}
        {showAndroidInstall && Platform.OS === 'web' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.md, padding: 12, gap: 10 }}>
            <AppText size={13} color="#fff" style={{ flex: 1 }}>{t('installAppBanner') || 'Add Umrah Companion to your home screen for quick access'}</AppText>
            <TouchableOpacity onPress={async () => {
              try {
                if (deferredPromptRef.current) {
                  await (deferredPromptRef.current as any).prompt();
                  setShowAndroidInstall(false);
                }
              } catch (_) {}
            }}>
              <AppText size={13} weight="semibold" color="#fff">{t('install') || 'Install'}</AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAndroidInstall(false)}>
              <AppText size={16} color="rgba(255,255,255,0.7)">✕</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* A20: iOS install tip */}
        {showIosInstall && Platform.OS === 'web' && (
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.hairline }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText weight="semibold" size={14} color={colors.text}>{t('installIosTip') || 'Add to Home Screen'}</AppText>
              <TouchableOpacity onPress={() => setShowIosInstall(false)}>
                <AppText size={16} color={colors.t50}>✕</AppText>
              </TouchableOpacity>
            </View>
            <AppText size={12} color={colors.t70} style={{ marginTop: 6 }}>
              {t('installIosInstructions') || 'Tap the share icon below, then "Add to Home Screen"'}
            </AppText>
          </View>
        )}

        <Animated.View style={animSection(0)}>
          <LocationBar />
        </Animated.View>

        <Animated.View style={animSection(1)}>
          <PrayerTimesCard />
        </Animated.View>

        {/* A16: Hero guide card with glassmorphism gradient */}
        <Animated.View style={animSection(2)}>
          <Card padded={false} style={{ overflow: 'hidden' }}>
            <LinearGradient
              colors={[colors.accent + '22', colors.goldLight + '18', colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16 }}
            >
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
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* A4: Quick grid with staggered fade-in + A18: glow on press */}
        <Animated.View style={animSection(3)}>
          <Card padded={false}>
            <AppText weight="display" size={16} color={colors.text} style={{ padding: 16, paddingBottom: 8 }}>{t('quick')}</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {QUICK.map((q, idx) => (
                <Animated.View key={q.target} style={{ width: '50%', opacity: quickAnims[idx] }}>
                  <Pressable
                    onPress={() => navigation.navigate(q.target as never)}
                    onPressIn={() => setActiveQuick(q.target)}
                    onPressOut={() => setActiveQuick(null)}
                    style={{
                      padding: 14,
                      alignItems: 'flex-start',
                      gap: 10,
                      backgroundColor: activeQuick === q.target ? colors.accent100 : 'transparent',
                      borderRadius: radius.md,
                      margin: 2,
                    }}
                  >
                    {/* A18: icon background tint + border glow on active */}
                    <View style={{
                      padding: 8,
                      borderRadius: radius.md,
                      backgroundColor: activeQuick === q.target ? colors.accent + '25' : colors.neutral100,
                      borderWidth: activeQuick === q.target ? 1.5 : 0,
                      borderColor: activeQuick === q.target ? colors.accent : 'transparent',
                    }}>
                      <IconBadge name={q.icon} />
                    </View>
                    <AppText weight="semibold" size={13.5} color={colors.text}>{t(q.labelKey)}</AppText>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={animSection(4)}>
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
        </Animated.View>
      </CardStack>

      {/* A21-A25: Package popup after 30s */}
      {showPackagePopup && earliestPackage && (
        <Modal transparent animationType="none" onRequestClose={closePopup}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={closePopup}>
            <Animated.View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.lg,
                borderTopRightRadius: radius.lg,
                padding: 24,
                transform: [{ translateY: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }],
              }}
            >
              <LinearGradient
                colors={[colors.goldLight + '30', 'transparent']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }}
              />
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.hairline, marginBottom: 20 }} />
                <AppText size={11} weight="semibold" color={colors.gold} style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {t('featuredPackage') || 'Featured Package'}
                </AppText>
                <AppText weight="display" size={20} color={colors.text} style={{ textAlign: 'center', marginBottom: 6 }}>
                  {field(earliestPackage.nameEn, earliestPackage.nameHi, earliestPackage.nameUr) }
                </AppText>
                {earliestPackage.priceInr && (
                  <AppText size={16} color={colors.accent} weight="semibold">
                    ₹{earliestPackage.priceInr?.toLocaleString('en-IN')}
                  </AppText>
                )}
                {earliestPackage.departDate && (
                  <AppText size={13} color={colors.t70} style={{ marginTop: 4 }}>
                    {t('departing') || 'Departing'} {earliestPackage.departDate}
                  </AppText>
                )}
              </View>
              <Button
                label={t('viewDetails') || 'View Details'}
                variant="primary"
                block
                onPress={() => { closePopup(); navigation.navigate('Packages'); }}
              />
              <TouchableOpacity onPress={closePopup} style={{ alignItems: 'center', marginTop: 14 }}>
                <AppText size={14} color={colors.t50}>{t('notNow') || 'Not now'}</AppText>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </ScreenScaffold>
  );
}
