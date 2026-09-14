import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { ListRow } from '../components/ListRow';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDuaStages } from '../api/hooks';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type CategoryRoute = RouteProp<RootStackParamList, 'DuaCategory'>;

export function DuaCategoryScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const navigation = useNavigation<Nav>();
  const route = useRoute<CategoryRoute>();
  const { data: stages } = useDuaStages();
  const stage = stages?.find((s) => s.id === route.params.stageId);

  return (
    <ScreenScaffold title={stage ? field(stage.nameEn, stage.nameHi, stage.nameUr) : t('duas')}>
      <CardStack>
        {stage && (stage.noteEn || stage.noteHi || stage.noteUr) && (
          <AppText size={12.5} color={colors.t70} style={{ paddingHorizontal: 4, lineHeight: 19 }}>
            {field(stage.noteEn, stage.noteHi, stage.noteUr)}
          </AppText>
        )}
        <Card padded={false}>
          {(stage?.duas ?? []).map((d, i, arr) => (
            <ListRow
              key={d.id}
              icon="duas"
              label={field(d.whenEn, d.whenHi, d.whenUr)}
              sublabel={field(d.meaningEn, d.meaningHi, d.meaningUr).slice(0, 72)}
              divider={i < arr.length - 1}
              onPress={() =>
                navigation.navigate('DuaDetail', { stageId: route.params.stageId, duaId: d.id })
              }
            />
          ))}
        </Card>
      </CardStack>
    </ScreenScaffold>
  );
}
