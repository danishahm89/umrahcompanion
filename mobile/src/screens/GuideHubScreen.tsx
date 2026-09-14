import React from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Icon } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useGuideRituals } from '../api/hooks';
import { radius } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function GuideHubScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: rituals } = useGuideRituals();

  return (
    <ScreenScaffold title={t('guide')}>
      <CardStack>
        <Card>
          <AppText size={13} color={colors.t80} style={{ lineHeight: 20 }}>{t('guideIntro')}</AppText>
        </Card>

        <Pressable onPress={() => navigation.navigate('FirstTime')}>
          <LinearGradient
            colors={[colors.accentLight, colors.accent, colors.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: radius.lg }}
          >
            <AppText weight="display" size={17} color="#fff">{t('firsttime')}</AppText>
            <Icon name="arrowRight" size={18} color="#fff" strokeWidth={2} />
          </LinearGradient>
        </Pressable>

        <Card padded={false}>
          {(rituals ?? []).map((r, i, arr) => (
            <View key={r.id} style={{ flexDirection: row, gap: 14, padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.hairline }}>
              <View style={{ width: 30, height: 30, borderRadius: radius.pill, backgroundColor: colors.accent100, alignItems: 'center', justifyContent: 'center' }}>
                <AppText weight="semibold" size={12} color={colors.accent}>{i + 1}</AppText>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText weight="display" size={15.5} color={colors.text}>{field(r.titleEn, r.titleHi, r.titleUr)}</AppText>
                <AppText size={12.5} color={colors.t70} style={{ marginTop: 4, lineHeight: 18 }}>{field(r.descEn, r.descHi, r.descUr)}</AppText>
              </View>
            </View>
          ))}
        </Card>

        <View style={{ gap: 10 }}>
          <Button label={t('duas')} variant="secondary" block onPress={() => navigation.navigate('Duas')} />
        <Button label={t('azkaar')} variant="secondary" block onPress={() => navigation.navigate('Azkaar')} />
        <Button label={t('quran')} variant="secondary" block onPress={() => navigation.navigate('Quran')} />
        <Button label={t('hadith')} variant="secondary" block onPress={() => navigation.navigate('Hadith')} />
          <Button label={t('packing')} variant="secondary" block onPress={() => navigation.navigate('Packing')} />
          <Button label={t('vaccine')} variant="secondary" block onPress={() => navigation.navigate('Vaccine')} />
        </View>
      </CardStack>
    </ScreenScaffold>
  );
}
