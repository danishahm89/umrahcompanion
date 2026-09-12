import React, { useMemo, useState } from 'react';
import { Linking, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { FormField, TextField } from '../components/FormField';
import { SegmentedRow } from '../components/SegmentedRow';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useContact, useSubmitEnquiry } from '../api/hooks';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/whatsapp';

const CITIES = ['Delhi', 'Lucknow', 'Patna', 'Kolkata'];
const HOTELS = ['3★', '4★', '5★'];

const PREVIEW_TEMPLATE = {
  en: (f: typeof INITIAL) =>
    `Assalamu alaikum, I want a customized Umrah package.\nFrom: ${f.city}\nTravellers: ${f.pax}\nNights: ${f.nights}\nMonth: ${f.month}\nHotel: ${f.hotel}${f.notes ? `\nNotes: ${f.notes}` : ''}`,
  hi: (f: typeof INITIAL) =>
    `अस्सलामु अलैकुम, मुझे कस्टमाइज़्ड उमराह पैकेज चाहिए।\nशहर: ${f.city}\nयात्री: ${f.pax}\nरातें: ${f.nights}\nमहीना: ${f.month}\nहोटल: ${f.hotel}${f.notes ? `\nनोट: ${f.notes}` : ''}`,
  ur: (f: typeof INITIAL) =>
    `السلام علیکم، مجھے کسٹمائزڈ عمرہ پیکج چاہیے۔\nشہر: ${f.city}\nمسافر: ${f.pax}\nراتیں: ${f.nights}\nمہینہ: ${f.month}\nہوٹل: ${f.hotel}${f.notes ? `\nنوٹ: ${f.notes}` : ''}`,
};

const INITIAL = { city: 'Delhi', pax: '2', nights: '10', month: 'Nov 2026', hotel: '4★', notes: '' };

export function CustomizeScreen() {
  const { colors } = useTheme();
  const { t, lang } = useLanguage();
  const { data: contact } = useContact();
  const submitEnquiry = useSubmitEnquiry();
  const [form, setForm] = useState(INITIAL);

  const preview = useMemo(() => PREVIEW_TEMPLATE[lang](form), [form, lang]);

  const send = () => {
    const pax = parseInt(form.pax, 10) || 1;
    const nights = parseInt(form.nights, 10) || 1;
    submitEnquiry.mutate({ city: form.city, pax, nights, month: form.month, hotel: form.hotel, notes: form.notes || undefined });
    if (contact) Linking.openURL(buildWhatsAppUrl(contact.whatsapp, preview));
  };

  return (
    <ScreenScaffold title={t('customize')}>
      <CardStack>
        <Card>
          <AppText size={13} color={colors.t80} style={{ lineHeight: 20 }}>
            {t('customIntro')}
          </AppText>
        </Card>

        <Card style={{ gap: 14 }}>
          <FormField label={t('fCity')}>
            <SegmentedRow value={form.city} onChange={(city) => setForm((f) => ({ ...f, city }))} options={CITIES.map((c) => ({ value: c, label: c }))} />
          </FormField>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label={t('fPax')}>
                <TextField keyboardType="number-pad" value={form.pax} onChangeText={(pax) => setForm((f) => ({ ...f, pax }))} />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label={t('fNights')}>
                <TextField keyboardType="number-pad" value={form.nights} onChangeText={(nights) => setForm((f) => ({ ...f, nights }))} />
              </FormField>
            </View>
          </View>
          <FormField label={t('fMonth')}>
            <TextField value={form.month} onChangeText={(month) => setForm((f) => ({ ...f, month }))} />
          </FormField>
          <FormField label={t('fHotel')}>
            <SegmentedRow value={form.hotel} onChange={(hotel) => setForm((f) => ({ ...f, hotel }))} options={HOTELS.map((h) => ({ value: h, label: h }))} />
          </FormField>
          <FormField label={t('fNotes')}>
            <TextField multiline placeholder={t('notesHint')} value={form.notes} onChangeText={(notes) => setForm((f) => ({ ...f, notes }))} />
          </FormField>
        </Card>

        <Card style={{ backgroundColor: colors.surfaceAlt }}>
          <AppText size={10} color={colors.t50} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>{t('preview')}</AppText>
          <AppText size={13} color={colors.text} style={{ marginTop: 9, lineHeight: 20 }}>{preview}</AppText>
        </Card>

        <View style={{ gap: 10 }}>
          <Button label={t('sendWa')} variant="primary" block onPress={send} />
          <Button label={t('call')} variant="secondary" block onPress={() => contact && Linking.openURL(buildTelUrl(contact.phone))} />
        </View>
      </CardStack>
    </ScreenScaffold>
  );
}
