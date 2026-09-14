import React from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { ListRow } from '../components/ListRow';
import { useLanguage } from '../i18n/LanguageContext';
import { useContact } from '../api/hooks';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/whatsapp';
import type { RootStackParamList } from '../navigation/types';
import type { IconName } from '../components/Icon';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ROWS: { icon: IconName; labelKey: 'gallery' | 'faq' | 'services' | 'ebooks' | 'contactUs' | 'nusuk' | 'packing' | 'vaccine' | 'duas' | 'azkaar' | 'quran' | 'customize' | 'settings'; target: keyof RootStackParamList }[] = [
  { icon: 'gallery', labelKey: 'gallery', target: 'Gallery' },
  { icon: 'faq', labelKey: 'faq', target: 'Faq' },
  { icon: 'services', labelKey: 'services', target: 'Services' },
  { icon: 'book', labelKey: 'ebooks', target: 'Ebooks' },
  { icon: 'nusuk', labelKey: 'nusuk', target: 'Nusuk' },
  { icon: 'packing', labelKey: 'packing', target: 'Packing' },
  { icon: 'vaccine', labelKey: 'vaccine', target: 'Vaccine' },
  { icon: 'duas', labelKey: 'duas', target: 'Duas' }, { icon: 'duas', labelKey: 'azkaar', target: 'Azkaar' },
  { icon: 'book', labelKey: 'quran', target: 'Quran' },
  { icon: 'firstTime', labelKey: 'customize', target: 'Customize' },
  { icon: 'contact', labelKey: 'contactUs', target: 'ContactUs' },
  { icon: 'settings', labelKey: 'settings', target: 'Settings' },
];

export function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useLanguage();
  const { data: contact } = useContact();

  return (
    <ScreenScaffold title={t('more')}>
      <CardStack>
        <Card padded={false} style={{ paddingHorizontal: 16 }}>
          {ROWS.map((r, i) => (
            <ListRow key={r.target} icon={r.icon} label={t(r.labelKey)} onPress={() => navigation.navigate(r.target as never)} divider={i < ROWS.length - 1} />
          ))}
        </Card>
        <Button
          label={t('enquire')}
          variant="primary"
          block
          onPress={() => contact && Linking.openURL(buildWhatsAppUrl(contact.whatsapp, 'Assalamu alaikum, I have a question about Umrah packages.'))}
        />
        <Button label={t('call')} variant="secondary" block onPress={() => contact && Linking.openURL(buildTelUrl(contact.phone))} />
      </CardStack>
    </ScreenScaffold>
  );
}
