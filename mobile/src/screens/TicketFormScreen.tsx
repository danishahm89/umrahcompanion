import React, { useMemo, useState } from 'react';
import { Linking } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { FormField, TextField } from '../components/FormField';
import { SegmentedRow } from '../components/SegmentedRow';
import { Card, CardStack } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useContact, useSubmitTicketEnquiry } from '../api/hooks';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import type { RootStackParamList } from '../navigation/types';

type Route = RouteProp<RootStackParamList, 'TicketForm'>;

const AIR_CLASSES = ['Economy', 'Business'];
const TRAIN_CLASSES = ['Sleeper', '3AC', '2AC', '1AC'];

const INITIAL = {
  name: '', phone: '', fromPlace: '', toPlace: '', travelDate: '', returnDate: '',
  passengers: '1', classPref: '', tatkal: false, notes: '',
};

export function TicketFormScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { params } = useRoute<Route>();
  const { kind, serviceName } = params;
  const { data: contact } = useContact();
  const submitTicket = useSubmitTicketEnquiry();
  const [form, setForm] = useState({ ...INITIAL, classPref: kind === 'air' ? AIR_CLASSES[0] : TRAIN_CLASSES[0] });

  const classOptions = kind === 'air' ? AIR_CLASSES : TRAIN_CLASSES;

  const preview = useMemo(() => {
    const lines = [
      `Assalamu alaikum, I'd like to book a ${kind === 'air' ? 'flight' : 'train'} ticket.`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `From: ${form.fromPlace}`,
      `To: ${form.toPlace}`,
      `Travel date: ${form.travelDate}`,
      kind === 'air' && form.returnDate ? `Return date: ${form.returnDate}` : null,
      `Passengers: ${form.passengers}`,
      `Class: ${form.classPref}`,
      kind === 'train' && form.tatkal ? 'Tatkal booking: Yes' : null,
      form.notes ? `Notes: ${form.notes}` : null,
    ].filter(Boolean);
    return lines.join('\n');
  }, [form, kind]);

  const send = () => {
    submitTicket.mutate({
      kind,
      name: form.name,
      phone: form.phone,
      fromPlace: form.fromPlace,
      toPlace: form.toPlace,
      travelDate: form.travelDate,
      returnDate: kind === 'air' && form.returnDate ? form.returnDate : undefined,
      passengers: parseInt(form.passengers, 10) || 1,
      classPref: form.classPref,
      tatkal: kind === 'train' ? form.tatkal : undefined,
      notes: form.notes || undefined,
    });
    if (contact) Linking.openURL(buildWhatsAppUrl(contact.whatsapp, preview));
  };

  return (
    <ScreenScaffold title={kind === 'air' ? t('airTicketForm') : t('trainTicketForm')}>
      <CardStack>
        <Card>
          <AppText size={13} color={colors.t80} style={{ lineHeight: 20 }}>{serviceName}</AppText>
        </Card>

        <Card style={{ gap: 14 }}>
          <FormField label={t('fFullName')}>
            <TextField value={form.name} onChangeText={(name) => setForm((f) => ({ ...f, name }))} />
          </FormField>
          <FormField label={t('fPhone')}>
            <TextField keyboardType="phone-pad" value={form.phone} onChangeText={(phone) => setForm((f) => ({ ...f, phone }))} />
          </FormField>
          <FormField label={t('fFrom')}>
            <TextField value={form.fromPlace} onChangeText={(fromPlace) => setForm((f) => ({ ...f, fromPlace }))} />
          </FormField>
          <FormField label={t('fTo')}>
            <TextField value={form.toPlace} onChangeText={(toPlace) => setForm((f) => ({ ...f, toPlace }))} />
          </FormField>
          <FormField label={t('fTravelDate')}>
            <TextField placeholder="2027-06-01" value={form.travelDate} onChangeText={(travelDate) => setForm((f) => ({ ...f, travelDate }))} />
          </FormField>
          {kind === 'air' && (
            <FormField label={t('fReturnDate')}>
              <TextField placeholder="2027-06-15" value={form.returnDate} onChangeText={(returnDate) => setForm((f) => ({ ...f, returnDate }))} />
            </FormField>
          )}
          <FormField label={t('fPassengers')}>
            <TextField keyboardType="number-pad" value={form.passengers} onChangeText={(passengers) => setForm((f) => ({ ...f, passengers }))} />
          </FormField>
          <FormField label={t('fClass')}>
            <SegmentedRow value={form.classPref} onChange={(classPref) => setForm((f) => ({ ...f, classPref }))} options={classOptions.map((c) => ({ value: c, label: c }))} />
          </FormField>
          {kind === 'train' && (
            <FormField label={t('fTatkal')}>
              <SegmentedRow
                value={form.tatkal ? 'yes' : 'no'}
                onChange={(v) => setForm((f) => ({ ...f, tatkal: v === 'yes' }))}
                options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
              />
            </FormField>
          )}
          <FormField label={t('fNotes')}>
            <TextField multiline placeholder={t('notesHint')} value={form.notes} onChangeText={(notes) => setForm((f) => ({ ...f, notes }))} />
          </FormField>
        </Card>

        <Card style={{ backgroundColor: colors.surfaceAlt }}>
          <AppText size={10} color={colors.t50} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>{t('preview')}</AppText>
          <AppText size={13} color={colors.text} style={{ marginTop: 9, lineHeight: 20 }}>{preview}</AppText>
        </Card>

        <Button label={t('submitEnquiry')} variant="primary" block onPress={send} />
      </CardStack>
    </ScreenScaffold>
  );
}
