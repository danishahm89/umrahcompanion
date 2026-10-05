import React, { useRef, useState } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useAzkaar } from '../api/hooks';
import { radius } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type DetailRoute = RouteProp<RootStackParamList, 'AzkaarDetail'>;

export function AzkaarDetailScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const route = useRoute<DetailRoute>();
  const { data: categories } = useAzkaar();
  const category = categories?.find((c) => c.id === route.params.categoryId);
  const azkaar = category?.azkaar.find((a) => a.id === route.params.azkaarId);

  // A9: Counter state + bounce animation
  const [count, setCount] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const completedAnim = useRef(new Animated.Value(1)).current;

  const target = azkaar?.repeat ?? 1;
  const isComplete = count >= target;
  const progress = Math.min(count / target, 1);

  const handleCounterTap = () => {
    if (isComplete) return;
    const next = count + 1;
    setCount(next);

    // A9: Bounce animation
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.18, useNativeDriver: true, tension: 250, friction: 4 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 8 }),
    ]).start();

    if (next >= target) {
      // Completion pulse
      Animated.sequence([
        Animated.timing(completedAnim, { toValue: 1.08, duration: 160, useNativeDriver: true }),
        Animated.timing(completedAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleReset = () => {
    setCount(0);
    Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 8 }).start();
  };

  return (
    <ScreenScaffold title={category ? field(category.nameEn, category.nameHi, category.nameUr) : t('azkaar')}>
      <CardStack>
        {azkaar && (
          <>
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  {category ? field(category.nameEn, category.nameHi, category.nameUr) : ''}
                </AppText>
                {azkaar.repeat > 1 && (
                  <View style={{ backgroundColor: colors.goldLight, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}>
                    <AppText size={11.5} weight="semibold" color={colors.goldDeep}>
                      {t('repeatTimes').replace('{n}', String(azkaar.repeat))}
                    </AppText>
                  </View>
                )}
              </View>
              <ArabicText color={colors.text} style={{ marginTop: 14 }}>
                {azkaar.arabic}
              </ArabicText>
              <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.hairline }}>
                <AppText size={12.5} color={colors.t50} style={{ fontStyle: 'italic', lineHeight: 19, textAlign: 'left', writingDirection: 'ltr' }}>
                  {azkaar.transliteration}
                </AppText>
                <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                  {field(azkaar.meaningEn, azkaar.meaningHi, azkaar.meaningUr)}
                </AppText>
              </View>
            </Card>

            {/* A9: Interactive counter */}
            <Animated.View style={{ transform: [{ scale: completedAnim }] }}>
              <Card style={{ alignItems: 'center' }}>
                {/* Progress arc */}
                <View style={{ marginBottom: 16, width: '100%', height: 6, borderRadius: radius.pill, backgroundColor: colors.neutral100 }}>
                  <View style={{
                    width: `${progress * 100}%`,
                    height: 6,
                    borderRadius: radius.pill,
                    backgroundColor: isComplete ? colors.gold : colors.accent,
                  }} />
                </View>

                {/* Big counter button */}
                <Pressable onPress={handleCounterTap} disabled={isComplete}>
                  <Animated.View style={{
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    backgroundColor: isComplete ? colors.goldLight : colors.accent100,
                    borderWidth: 3,
                    borderColor: isComplete ? colors.gold : colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ scale: bounceAnim }],
                  }}>
                    <AppText weight="display" size={44} color={isComplete ? colors.goldDeep : colors.accent}>
                      {count}
                    </AppText>
                    <AppText size={11} color={isComplete ? colors.goldDeep : colors.accent} style={{ marginTop: -4 }}>
                      / {target}
                    </AppText>
                  </Animated.View>
                </Pressable>

                <AppText size={13} color={colors.t70} style={{ marginTop: 16 }}>
                  {isComplete ? (t('azkaarComplete') || '✓ Completed!') : (t('tapToCount') || 'Tap to count')}
                </AppText>

                {count > 0 && (
                  <Pressable onPress={handleReset} style={{ marginTop: 10 }}>
                    <AppText size={12} color={colors.t50}>{t('reset') || 'Reset'}</AppText>
                  </Pressable>
                )}
              </Card>
            </Animated.View>
          </>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
