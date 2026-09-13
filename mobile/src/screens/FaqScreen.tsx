import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CardStack } from '../components/Card';
import { IconBadge } from '../components/IconBadge';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useContact, useFaq } from '../api/hooks';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { radius } from '../theme/tokens';

export function FaqScreen() {
  const { colors } = useTheme();
  const { t, field } = useLanguage();
  const { isRTL } = useDirection();
  const { data: faq } = useFaq();
  const { data: contact } = useContact();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  return (
    <ScreenScaffold title={t('faq')}>
      <CardStack>
        {(faq ?? []).map((f) => {
          const isOpen = openIds.has(f.id);
          return (
            <View key={f.id} style={{ gap: 10 }}>
              {/* Question, styled as an outgoing chat bubble */}
              <Pressable
                onPress={() => toggle(f.id)}
                style={{
                  alignSelf: isRTL ? 'flex-start' : 'flex-end',
                  maxWidth: '86%',
                  backgroundColor: colors.accent,
                  borderRadius: radius.lg,
                  borderBottomRightRadius: isRTL ? radius.lg : 4,
                  borderBottomLeftRadius: isRTL ? 4 : radius.lg,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                }}
              >
                <AppText weight="semibold" size={14.5} color="#fff" style={{ lineHeight: 20 }}>
                  {field(f.questionEn, f.questionHi, f.questionUr)}
                </AppText>
              </Pressable>

              {/* Answer, styled as an incoming chat bubble from "Alzakwaan" */}
              {isOpen && (
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, maxWidth: '92%', alignSelf: isRTL ? 'flex-end' : 'flex-start' }}>
                  <IconBadge name="faq" tone="gold" size={30} iconSize={15} />
                  <View
                    style={{
                      flexShrink: 1,
                      backgroundColor: colors.surface,
                      borderRadius: radius.lg,
                      borderBottomLeftRadius: isRTL ? radius.lg : 4,
                      borderBottomRightRadius: isRTL ? 4 : radius.lg,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                    }}
                  >
                    <AppText size={13.5} color={colors.t80} style={{ lineHeight: 20 }}>
                      {field(f.answerEn, f.answerHi, f.answerUr)}
                    </AppText>
                  </View>
                </View>
              )}
            </View>
          );
        })}

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
