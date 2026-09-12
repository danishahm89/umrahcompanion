import React from 'react';
import { Pressable, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { CheckBox } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Tag } from '../components/Tag';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useVaccines } from '../api/hooks';
import { usePersistentState } from '../storage/usePersistentState';

export function VaccineScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: vaccines } = useVaccines();
  const [checks, setChecks] = usePersistentState<Record<string, boolean>>('vaccine-checks', {});

  return (
    <ScreenScaffold title={t('vaccine')}>
      <CardStack>
        <Card>
          <AppText size={12.5} color={colors.t70} style={{ lineHeight: 19 }}>{t('vaxNote')}</AppText>
        </Card>

        <Card padded={false}>
          {(vaccines ?? []).map((v, i, arr) => {
            const checked = !!checks[v.id];
            return (
              <Pressable
                key={v.id}
                onPress={() => setChecks((c) => ({ ...c, [v.id]: !c[v.id] }))}
                style={{ flexDirection: row, alignItems: 'flex-start', gap: 12, padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.hairline }}
              >
                <View style={{ marginTop: 2 }}>
                  <CheckBox checked={checked} color={colors.t50} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: row, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <AppText weight="display" size={15} color={colors.text}>{field(v.nameEn, v.nameHi, v.nameUr)}</AppText>
                    <Tag variant="gold" label={field(v.statusEn, v.statusHi, v.statusUr)} />
                  </View>
                  <AppText size={12.5} color={colors.t70} style={{ marginTop: 5, lineHeight: 18 }}>
                    {field(v.descEn, v.descHi, v.descUr)}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </Card>
      </CardStack>
    </ScreenScaffold>
  );
}
