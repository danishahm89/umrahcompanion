import React from 'react';
import { Pressable, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { CheckBox } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { usePackingGroups } from '../api/hooks';
import { usePersistentState } from '../storage/usePersistentState';

export function PackingScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: groups } = usePackingGroups();
  const [checks, setChecks] = usePersistentState<Record<string, boolean>>('packing-checks', {});

  const totalItems = (groups ?? []).reduce((sum, g) => sum + g.items.length, 0);
  const doneCount = Object.values(checks).filter(Boolean).length;

  return (
    <ScreenScaffold title={t('packing')}>
      <CardStack>
        <Card>
          <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText size={12.5} color={colors.t70}>{t('packNote')}</AppText>
            <AppText weight="semibold" size={13} color={colors.gold}>{doneCount}/{totalItems}</AppText>
          </View>
        </Card>

        {(groups ?? []).map((g) => (
          <Card key={g.id} padded={false}>
            <AppText weight="display" size={14} color={colors.text} style={{ padding: 16, paddingBottom: 10 }}>
              {field(g.titleEn, g.titleHi, g.titleUr)}
            </AppText>
            {g.items.map((item, i, arr) => {
              const checked = !!checks[item.id];
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setChecks((c) => ({ ...c, [item.id]: !c[item.id] }))}
                  style={{ flexDirection: row, alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.hairline }}
                >
                  <CheckBox checked={checked} color={colors.t50} />
                  <AppText size={14} color={colors.text} style={{ flex: 1 }}>{field(item.textEn, item.textHi, item.textUr)}</AppText>
                </Pressable>
              );
            })}
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
