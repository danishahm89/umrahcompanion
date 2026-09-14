import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Card, CardStack } from '../components/Card';
import { ListRow } from '../components/ListRow';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useAzkaar } from '../api/hooks';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type CategoryRoute = RouteProp<RootStackParamList, 'AzkaarCategory'>;

export function AzkaarCategoryScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const navigation = useNavigation<Nav>();
  const route = useRoute<CategoryRoute>();
  const { data: categories } = useAzkaar();
  const category = categories?.find((c) => c.id === route.params.categoryId);

  return (
    <ScreenScaffold title={category ? field(category.nameEn, category.nameHi, category.nameUr) : t('azkaar')}>
      <CardStack>
        {category && (category.noteEn || category.noteHi || category.noteUr) && (
          <AppText size={12.5} color={colors.t70} style={{ paddingHorizontal: 4, lineHeight: 19 }}>
            {field(category.noteEn, category.noteHi, category.noteUr)}
          </AppText>
        )}
        <Card padded={false}>
          {(category?.azkaar ?? []).map((a, i, arr) => (
            <ListRow
              key={a.id}
              icon="duas"
              label={field(a.meaningEn, a.meaningHi, a.meaningUr).slice(0, 48)}
              sublabel={t('repeatTimes').replace('{n}', String(a.repeat))}
              divider={i < arr.length - 1}
              onPress={() =>
                navigation.navigate('AzkaarDetail', { categoryId: route.params.categoryId, azkaarId: a.id })
              }
            />
          ))}
        </Card>
      </CardStack>
    </ScreenScaffold>
  );
}
