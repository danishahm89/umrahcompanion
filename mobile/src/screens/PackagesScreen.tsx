import React, { useMemo, useState } from 'react';
import { Linking, Pressable, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Tag } from '../components/Tag';
import { SegmentedRow } from '../components/SegmentedRow';
import { FactGrid } from '../components/FactGrid';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useContact, usePackages } from '../api/hooks';
import { buildPackageFacts, formatDate, formatPriceInr } from '../utils/packageFacts';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PackagesScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: packages, refetch, isRefetching } = usePackages();
  const { data: contact } = useContact();
  const [filter, setFilter] = useState('all');
  const [hajjMovement, setHajjMovement] = useState('all');
  const [hajjDuration, setHajjDuration] = useState('all');

  const filtered = useMemo(
    () =>
      (packages ?? []).filter((p) => {
        if (filter !== 'all' && p.type !== filter) return false;
        if (filter === 'hajj') {
          if (hajjMovement !== 'all' && p.hajjShifting !== (hajjMovement === 'shifting')) return false;
          if (hajjDuration === '20' && p.nights > 25) return false;
          if (hajjDuration === '30plus' && p.nights <= 25) return false;
        }
        return true;
      }),
    [packages, filter, hajjMovement, hajjDuration],
  );

  return (
    <ScreenScaffold
      title={t('packages')}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
    >
      <CardStack>
        <AppText size={12.5} color={colors.t70} style={{ lineHeight: 18, paddingHorizontal: 2 }}>{t('pkgNote')}</AppText>

        <SegmentedRow
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: t('filterAll') },
            { value: 'group', label: t('typeGroup') },
            { value: 'private', label: t('typePrivate') },
            { value: 'hajj', label: t('typeHajj') },
          ]}
        />

        {filter === 'hajj' && (
          <View style={{ gap: 8 }}>
            <SegmentedRow
              value={hajjMovement}
              onChange={setHajjMovement}
              options={[
                { value: 'all', label: t('filterAll') },
                { value: 'shifting', label: t('shifting') },
                { value: 'non_shifting', label: t('nonShifting') },
              ]}
            />
            <SegmentedRow
              value={hajjDuration}
              onChange={setHajjDuration}
              options={[
                { value: 'all', label: t('filterAll') },
                { value: '20', label: t('days20') },
                { value: '30plus', label: t('days30plus') },
              ]}
            />
          </View>
        )}

        {filtered.map((p) => {
          const facts = buildPackageFacts(p, t, field).slice(0, 6);
          const name = field(p.nameEn, p.nameHi, p.nameUr);
          const isPremium = p.type === 'private';
          const waUrl = contact
            ? buildWhatsAppUrl(contact.whatsapp, `Assalamu alaikum, I am interested in ${p.nameEn} (${formatPriceInr(p.priceInr)}, departs ${formatDate(p.departDate)}). Please share details.`)
            : undefined;

          return (
            <Card key={p.id} padded={false} elevation={isPremium ? 'lg' : 'md'}>
              <Pressable onPress={() => navigation.navigate('PackageDetail', { id: p.id })} style={{ padding: 18, paddingBottom: 14 }}>
                <View style={{ flexDirection: row, justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <Tag variant={isPremium ? 'gold' : 'accent'} label={p.type === 'private' ? t('typePrivate') : p.type === 'hajj' ? t('typeHajj') : t('typeGroup')} />
                  <AppText size={10} color={colors.t50} style={{ letterSpacing: 0.4, textTransform: 'uppercase', textAlign: 'left', writingDirection: 'ltr' }}>
                    {formatDate(p.departDate)}
                  </AppText>
                </View>
                <AppText weight="display" size={19} color={colors.text} style={{ marginTop: 12, lineHeight: 24 }}>{name}</AppText>
                <View style={{ flexDirection: row, alignItems: 'baseline', gap: 7, marginTop: 10 }}>
                  <AppText size={11} color={colors.t50}>{t('from')}</AppText>
                  <AppText weight="displayBlack" size={26} color={colors.gold}>{formatPriceInr(p.priceInr)}</AppText>
                  <AppText size={11} color={colors.t50}>{t('perPerson')}</AppText>
                </View>
                <View style={{ marginTop: 16 }}>
                  <FactGrid facts={facts} />
                </View>
              </Pressable>
              <View style={{ flexDirection: row, gap: 10, paddingHorizontal: 18, paddingBottom: 18 }}>
                <Button label={t('enquire')} variant="primary" style={{ flex: 1 }} onPress={() => waUrl && Linking.openURL(waUrl)} />
                <Button label={t('details')} variant="secondary" onPress={() => navigation.navigate('PackageDetail', { id: p.id })} />
              </View>
            </Card>
          );
        })}

        <Button label={t('customize')} variant="secondary" block onPress={() => navigation.navigate('Customize')} />
      </CardStack>
    </ScreenScaffold>
  );
}
