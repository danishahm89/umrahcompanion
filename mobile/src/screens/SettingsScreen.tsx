import React from 'react';
import { Linking, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { SegmentedRow } from '../components/SegmentedRow';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage, type Lang } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useContact } from '../api/hooks';
import { radius } from '../theme/tokens';

export function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const { row, rtlPref, setRtlPref } = useDirection();
  const { data: contact } = useContact();

  const sectionTitle = (label: string) => (
    <AppText weight="display" size={14} color={colors.text} style={{ marginBottom: 12 }}>{label}</AppText>
  );

  return (
    <ScreenScaffold title={t('settings')}>
      <CardStack>
        <Card>
          {sectionTitle(t('appearance'))}
          <SegmentedRow
            value={mode}
            onChange={(v) => setMode(v as 'light' | 'dark')}
            options={[{ value: 'light', label: t('light') }, { value: 'dark', label: t('dark') }]}
          />
        </Card>

        <Card>
          {sectionTitle(t('language'))}
          <SegmentedRow
            value={lang}
            onChange={(v) => setLang(v as Lang)}
            options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }, { value: 'ur', label: 'اردو' }]}
          />
        </Card>

        <Card>
          {sectionTitle(t('urduLayout'))}
          <AppText size={12.5} color={colors.t70} style={{ marginBottom: 12, lineHeight: 18, marginTop: -6 }}>{t('urduLayoutNote')}</AppText>
          <SegmentedRow
            value={rtlPref ? 'rtl' : 'ltr'}
            onChange={(v) => setRtlPref(v === 'rtl')}
            options={[{ value: 'rtl', label: 'RTL' }, { value: 'ltr', label: 'LTR' }]}
          />
        </Card>

        <Card>
          {sectionTitle(t('contact'))}
          {contact && [
            { k: 'WhatsApp', v: contact.whatsapp },
            { k: t('phone'), v: contact.phone },
            { k: t('email'), v: contact.primaryEmail },
            { k: t('website'), v: contact.website },
          ].map((c, i) => (
            <View key={c.k} style={{ flexDirection: row, justifyContent: 'space-between', gap: 10, paddingVertical: 9, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.hairline }}>
              <AppText size={13} color={colors.t50}>{c.k}</AppText>
              <AppText size={13} weight="semibold" color={colors.text} style={{ textAlign: 'left', writingDirection: 'ltr' }}>{c.v}</AppText>
            </View>
          ))}
        </Card>

        <Card>
          {sectionTitle(t('offices'))}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {(contact?.offices ?? []).map((office) => (
              <View key={office} style={{ flex: 1, backgroundColor: colors.neutral100, borderRadius: radius.md, padding: 12, paddingHorizontal: 10, minWidth: 90 }}>
                <AppText weight="display" size={14} color={colors.text}>{office}</AppText>
              </View>
            ))}
          </View>
          <Button label={contact?.website ?? ''} variant="secondary" block onPress={() => contact && Linking.openURL(`https://${contact.website}`)} />
        </Card>
      </CardStack>
    </ScreenScaffold>
  );
}
