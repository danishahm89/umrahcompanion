import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText, ArabicText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useDuaStages } from '../api/hooks';
import { radius } from '../theme/tokens';

export function DuasScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: stages } = useDuaStages();
  const [stageIndex, setStageIndex] = useState(0);

  const stage = stages?.[stageIndex];

  return (
    <ScreenScaffold title={t('duas')}>
      <CardStack>
        <View style={{ flexDirection: row, gap: 4, backgroundColor: colors.neutral100, borderRadius: radius.pill, padding: 4 }}>
          {(stages ?? []).map((s, i) => {
            const active = i === stageIndex;
            return (
              <Pressable
                key={s.id}
                onPress={() => setStageIndex(i)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.pill, backgroundColor: active ? colors.accent : 'transparent' }}
              >
                <AppText size={12.5} weight={active ? 'semibold' : 'regular'} color={active ? '#fff' : colors.text}>{field(s.nameEn, s.nameHi, s.nameUr)}</AppText>
              </Pressable>
            );
          })}
        </View>

        {stage && (
          <AppText size={12.5} color={colors.t70} style={{ lineHeight: 19, paddingHorizontal: 4 }}>
            {field(stage.noteEn, stage.noteHi, stage.noteUr)}
          </AppText>
        )}

        {(stage?.duas ?? []).map((d) => (
          <Card key={d.id}>
            <AppText size={10} color={colors.gold} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {field(d.whenEn, d.whenHi, d.whenUr)}
            </AppText>
            <ArabicText color={colors.text} style={{ marginTop: 14 }}>{d.arabic}</ArabicText>
            <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.hairline }}>
              <AppText
                size={12.5}
                color={colors.t50}
                style={{ fontStyle: 'italic', lineHeight: 19, textAlign: 'left', writingDirection: 'ltr' }}
              >
                {d.transliteration}
              </AppText>
              <AppText size={13.5} color={colors.text} style={{ marginTop: 8, lineHeight: 20 }}>
                {field(d.meaningEn, d.meaningHi, d.meaningUr)}
              </AppText>
            </View>
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
