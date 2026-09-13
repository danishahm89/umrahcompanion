import React from 'react';
import { Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Tag } from '../components/Tag';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useContact, useServices } from '../api/hooks';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ServicesScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const navigation = useNavigation<Nav>();
  const { data: services } = useServices();
  const { data: contact } = useContact();

  return (
    <ScreenScaffold title={t('services')}>
      <CardStack>
        {(services ?? []).map((s, i) => (
          <Card key={s.id}>
            <AppText weight="displayBlack" size={13} color={colors.goldDeep} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              {String(i + 1).padStart(2, '0')}
            </AppText>
            <AppText weight="display" size={22} color={colors.text} style={{ marginTop: 8 }}>{field(s.nameEn, s.nameHi, s.nameUr)}</AppText>
            <AppText size={13} color={colors.t70} style={{ marginTop: 6, lineHeight: 19 }}>{field(s.descEn, s.descHi, s.descUr)}</AppText>
            <View style={{ flexDirection: row, flexWrap: 'wrap', gap: 6, marginTop: 14, marginBottom: 14 }}>
              {s.tags.map((tag) => (
                <Tag key={tag} label={tag} variant="outline" />
              ))}
            </View>
            <Button
              label={t('enquire')}
              variant="primary"
              block
              onPress={() =>
                s.formType === 'air' || s.formType === 'train'
                  ? navigation.navigate('TicketForm', { kind: s.formType, serviceName: field(s.nameEn, s.nameHi, s.nameUr) })
                  : contact && Linking.openURL(buildWhatsAppUrl(contact.whatsapp, `Assalamu alaikum, I need help with ${s.nameEn}.`))
              }
            />
          </Card>
        ))}
      </CardStack>
    </ScreenScaffold>
  );
}
