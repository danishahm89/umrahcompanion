import React from 'react';
import { Linking, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { ListRow } from '../components/ListRow';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useContact } from '../api/hooks';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/whatsapp';
import { radius } from '../theme/tokens';

export function ContactUsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { data: contact } = useContact();

  return (
    <ScreenScaffold title={t('contactUs')}>
      <CardStack>
        <Card padded={false} style={{ paddingHorizontal: 16 }}>
          <ListRow
            icon="contact"
            label="WhatsApp"
            sublabel={contact?.whatsapp}
            divider
            onPress={() => contact && Linking.openURL(buildWhatsAppUrl(contact.whatsapp, 'Assalamu alaikum, I have a question.'))}
          />
          <ListRow
            icon="contact"
            label={t('phone')}
            sublabel={contact?.phone}
            divider
            onPress={() => contact && Linking.openURL(buildTelUrl(contact.phone))}
          />
          <ListRow
            icon="contact"
            label={t('email')}
            sublabel={contact?.primaryEmail}
            divider
            onPress={() => contact && Linking.openURL(`mailto:${contact.primaryEmail}`)}
          />
          <ListRow
            icon="contact"
            label={t('website')}
            sublabel={contact?.website}
            onPress={() => contact && Linking.openURL(`https://${contact.website}`)}
          />
        </Card>

        <Card>
          <AppText weight="display" size={14} color={colors.text} style={{ marginBottom: 12 }}>{t('offices')}</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(contact?.offices ?? []).map((office) => (
              <View key={office} style={{ flex: 1, backgroundColor: colors.neutral100, borderRadius: radius.md, padding: 12, paddingHorizontal: 10, minWidth: 90 }}>
                <AppText weight="display" size={14} color={colors.text}>{office}</AppText>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label={t('enquire')}
          variant="primary"
          block
          onPress={() => contact && Linking.openURL(buildWhatsAppUrl(contact.whatsapp, 'Assalamu alaikum, I have a question.'))}
        />
      </CardStack>
    </ScreenScaffold>
  );
}
