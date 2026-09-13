import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { TextField } from './FormField';
import { Icon } from './Icon';
import { IconBadge } from './IconBadge';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useDirection } from '../direction/DirectionContext';
import { useAppLocation } from '../location/LocationContext';
import { radius } from '../theme/tokens';

/** Sits at the top of the dashboard: shows the set location, or lets the pilgrim grant GPS
 * permission or type a city — drives both the prayer-times card and nearby-mosque search. */
export function LocationBar() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { row } = useDirection();
  const { location, loading, error, useDeviceLocation, setManualCity } = useAppLocation();
  const [expanded, setExpanded] = useState(!location);
  const [city, setCity] = useState('');

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14 }}>
      <Pressable onPress={() => setExpanded((e) => !e)} style={{ flexDirection: row, alignItems: 'center', gap: 10 }}>
        <IconBadge name="pin" size={32} iconSize={16} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText size={10} color={colors.t50} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
            {location ? location.label : t('setLocation')}
          </AppText>
          {!location && <AppText size={12} color={colors.t70} style={{ marginTop: 2 }}>{t('setLocationNote')}</AppText>}
        </View>
        {location && (
          <AppText size={12} weight="semibold" color={colors.accent}>{t('changeLocation')}</AppText>
        )}
      </Pressable>

      {expanded && (
        <View style={{ marginTop: 14, gap: 10 }}>
          <Button
            label={loading ? t('locatingYou') : t('useMyLocation')}
            variant="primary"
            icon="pin"
            block
            disabled={loading}
            onPress={async () => {
              await useDeviceLocation();
              setExpanded(false);
            }}
          />
          <View style={{ flexDirection: row, gap: 8 }}>
            <View style={{ flex: 1 }}>
              <TextField placeholder={t('cityPlaceholder')} value={city} onChangeText={setCity} />
            </View>
            <Button
              label={t('search')}
              variant="secondary"
              disabled={loading || !city.trim()}
              onPress={async () => {
                await setManualCity(city);
                setExpanded(false);
              }}
            />
          </View>
          {loading && <ActivityIndicator color={colors.accent} />}
          {error && (
            <AppText size={12} color="#C0392B">
              {error === 'permission-denied' ? 'Location permission was denied — try entering your city instead.' : 'Could not find that location. Try a different spelling.'}
            </AppText>
          )}
        </View>
      )}
    </View>
  );
}
