import React from 'react';
import { Linking, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Tag } from '../components/Tag';
import { Icon } from '../components/Icon';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { FactGrid } from '../components/FactGrid';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useContact, usePackage } from '../api/hooks';
import { buildPackageFacts, formatPriceInr } from '../utils/packageFacts';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/whatsapp';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'PackageDetail'>;

export function PackageDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: pkg } = usePackage(params.id);
  const { data: contact } = useContact();

  if (!pkg) {
    return (
      <ScreenScaffold title={t('packages')}>
        <View style={{ padding: 16 }} />
      </ScreenScaffold>
    );
  }

  const name = field(pkg.nameEn, pkg.nameHi, pkg.nameUr);
  const facts = buildPackageFacts(pkg, t, field);
  const waUrl = contact ? buildWhatsAppUrl(contact.whatsapp, `Assalamu alaikum, I am interested in ${pkg.nameEn}. Please share details.`) : undefined;
  const telUrl = contact ? buildTelUrl(contact.phone) : undefined;

  return (
    <ScreenScaffold title={name}>
      <CardStack>
        <Card padded={false} elevation="lg">
          <PlaceholderImage height={180} label="Drop a hotel or Haram photograph" rounded={false} />
          <View style={{ padding: 18 }}>
            <Tag variant={pkg.type === 'private' ? 'gold' : 'accent'} label={pkg.type === 'private' ? t('typePrivate') : pkg.type === 'hajj' ? t('typeHajj') : t('typeGroup')} />
            <AppText weight="display" size={24} color={colors.text} style={{ marginTop: 12, lineHeight: 29 }}>{name}</AppText>
            <View style={{ flexDirection: row, alignItems: 'baseline', gap: 7, marginTop: 12 }}>
              <AppText size={11} color={colors.t50}>{t('from')}</AppText>
              <AppText weight="displayBlack" size={30} color={colors.gold}>{formatPriceInr(pkg.priceInr)}</AppText>
              <AppText size={11} color={colors.t50}>{t('perPerson')}</AppText>
            </View>
            <View style={{ marginTop: 16 }}>
              <FactGrid facts={facts} />
            </View>
          </View>
        </Card>

        <Card>
          <AppText weight="display" size={15} color={colors.text} style={{ marginBottom: 12 }}>{t('itinerary')}</AppText>
          {(pkg.itinerary ?? []).map((it, i, arr) => (
            <View key={it.id} style={{ flexDirection: row, gap: 12, paddingVertical: 10, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.hairline }}>
              <AppText weight="semibold" size={12} color={colors.accent} style={{ width: 54 }}>{field(it.keyEn, it.keyHi, it.keyUr)}</AppText>
              <AppText size={13} color={colors.text} style={{ flex: 1, lineHeight: 19 }}>{field(it.textEn, it.textHi, it.textUr)}</AppText>
            </View>
          ))}
        </Card>

        <Card>
          <AppText weight="display" size={15} color={colors.text} style={{ marginBottom: 10 }}>{t('included')}</AppText>
          {(pkg.inclusions ?? []).map((inc) => (
            <View key={inc.id} style={{ flexDirection: row, gap: 10, alignItems: 'flex-start', paddingVertical: 6 }}>
              <Icon name="check" size={14} color={colors.accent} strokeWidth={3} />
              <AppText size={13.5} color={colors.text} style={{ flex: 1, lineHeight: 19 }}>{field(inc.textEn, inc.textHi, inc.textUr)}</AppText>
            </View>
          ))}
        </Card>

        <View style={{ gap: 10 }}>
          <Button label={t('enquire')} variant="primary" block onPress={() => waUrl && Linking.openURL(waUrl)} />
          <Button label={t('call')} variant="secondary" block onPress={() => telUrl && Linking.openURL(telUrl)} />
          <Button label={t('customize')} variant="secondary" block onPress={() => navigation.navigate('Customize')} />
        </View>
      </CardStack>
    </ScreenScaffold>
  );
}
