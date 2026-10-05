import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { Card, CardStack } from '../components/Card';
import { AppText } from '../components/AppText';
import { ArabicText } from '../components/AppText';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDuaStages } from '../api/hooks';
import { Icon } from '../components/Icon';

type DetailRoute = { params: { stageId: string; duaId: string } };

export function DuaDetailScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const route = useRoute<any>();
  const { data: stages } = useDuaStages();
  const stage = stages?.find((s: any) => s.id === route.params.stageId);
  const duas = stage?.duas ?? [];
  const initialIdx = duas.findIndex((d: any) => d.id === route.params.duaId);
  const [idx, setIdx] = useState(initialIdx >= 0 ? initialIdx : 0);
  const dua = duas[idx];

  const slideAnim = useRef(new Animated.Value(0)).current;

  const navigateTo = (newIdx: number, dir: number) => {
    if (newIdx < 0 || newIdx >= duas.length) return;
    Animated.timing(slideAnim, { toValue: -dir * 60, duration: 120, useNativeDriver: true }).start(() => {
      slideAnim.setValue(dir * 60);
      setIdx(newIdx);
      Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 10, useNativeDriver: true }).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dy) < 30,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -40) navigateTo(idx + 1, 1);
        else if (g.dx > 40) navigateTo(idx - 1, -1);
      },
    })
  ).current;

  return (
    <ScreenScaffold title={dua ? field(dua.whenEn, dua.whenHi, dua.whenUr) : t('duas')}>
      <CardStack>
        {dua && (
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }} {...panResponder.panHandlers}>
            <Card>
              <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {field(dua.whenEn, dua.whenHi, dua.whenUr)}
              </AppText>
              <ArabicText color={colors.text} style={{ marginTop: 14 }}>{dua.arabic}</ArabicText>
              <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.hairline }}>
                <AppText size={12.5} color={colors.t50} style={{ fontStyle: 'italic', lineHeight: 19, textAlign: 'left', writingDirection: 'ltr' }}>
                  {dua.transliteration}
                </AppText>
                <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                  {field(dua.meaningEn, dua.meaningHi, dua.meaningUr)}
                </AppText>
              </View>
            </Card>
          </Animated.View>
        )}
        {duas.length > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 }}>
            <Pressable
              onPress={() => navigateTo(idx - 1, -1)}
              style={{ padding: 10, opacity: idx === 0 ? 0.3 : 1 }}
            >
              <Icon name="back" size={20} color={colors.accent} />
            </Pressable>
            <AppText size={12} color={colors.t50}>{idx + 1} / {duas.length}</AppText>
            <Pressable
              onPress={() => navigateTo(idx + 1, 1)}
              style={{ padding: 10, opacity: idx === duas.length - 1 ? 0.3 : 1, transform: [{ scaleX: -1 }] }}
            >
              <Icon name="back" size={20} color={colors.accent} />
            </Pressable>
          </View>
        )}
      </CardStack>
    </ScreenScaffold>
  );
}
