import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card, CardStack } from '../components/Card';
import { Icon } from '../components/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useContact, useFaq } from '../api/hooks';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export function FaqScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { row } = useDirection();
  const { data: faq } = useFaq();
  const { data: contact } = useContact();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ScreenScaffold title={t('faq')}>
      <CardStack>
        <Card padded={false}>
          {(faq ?? []).map((f, i, arr) => {
            const isOpen = open === f.id;
            return (
              <View key={f.id} style={{ borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.hairline }}>
                <Pressable
                  onPress={() => setOpen(isOpen ? null : f.id)}
                  style={{ flexDirection: row, gap: 12, alignItems: 'flex-start', padding: 16 }}
                >
                  <AppText weight="display" size={15} color={colors.text} style={{ flex: 1 }}>{field(f.questionEn, f.questionHi, f.questionUr)}</AppText>
                  <Icon name={isOpen ? 'minus' : 'plus'} size={16} color={colors.accent} strokeWidth={2.5} />
                </Pressable>
                {isOpen && (
                  <AppText size={13} color={colors.t80} style={{ paddingHorizontal: 16, paddingBottom: 16, lineHeight: 20 }}>
                    {field(f.answerEn, f.answerHi, f.answerUr)}
                  </AppText>
                )}
              </View>
            );
          })}
        </Card>

        <Button
          label={t('enquire')}
          variant="primary"
          block
          onPress={() => contact && Linking.openURL(buildWhatsAppUrl(contact.whatsapp, 'Assalamu alaikum, I have a question about Umrah packages.'))}
        />
      </CardStack>
    </ScreenScaffold>
  );
}
