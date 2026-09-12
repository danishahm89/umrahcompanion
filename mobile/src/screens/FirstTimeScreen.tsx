import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button, CheckBox } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useGuideSteps } from '../api/hooks';
import { usePersistentState } from '../storage/usePersistentState';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FirstTimeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: steps } = useGuideSteps();
  const [done, setDone] = usePersistentState<Record<number, boolean>>('guide-steps-done', {});

  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <ScreenScaffold title={t('firsttime')}>
      <CardStack>
        <Card>
          <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText size={12.5} color={colors.t70}>{t('tapDone')}</AppText>
            <AppText weight="semibold" size={13} color={colors.gold}>{doneCount}/{steps?.length ?? 6}</AppText>
          </View>
        </Card>

        <Card padded={false}>
          {(steps ?? []).map((s, i, arr) => {
            const isDone = !!done[i];
            return (
              <Pressable
                key={s.id}
                onPress={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                style={{ flexDirection: row, gap: 13, alignItems: 'flex-start', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.hairline }}
              >
                <CheckBox checked={isDone} color={colors.t50} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText size={10} color={colors.t50} style={{ letterSpacing: 1 }}>{`Step ${String(i + 1).padStart(2, '0')}`}</AppText>
                  <AppText weight="display" size={15.5} color={colors.text} style={{ marginTop: 6 }}>{field(s.titleEn, s.titleHi, s.titleUr)}</AppText>
                  <AppText size={12.5} color={colors.t70} style={{ marginTop: 4, lineHeight: 18 }}>{field(s.descEn, s.descHi, s.descUr)}</AppText>
                </View>
              </Pressable>
            );
          })}
        </Card>

        <Button label={t('duas')} variant="primary" icon="arrowRight" block onPress={() => navigation.navigate('Duas')} />
      </CardStack>
    </ScreenScaffold>
  );
}
