import React, { createContext, useContext, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface DirectionContextValue {
  /** User's RTL-vs-LTR preference for Urdu script (Settings toggle). Ignored for en/hi. */
  rtlPref: boolean;
  setRtlPref: (v: boolean) => void;
  /** Effective direction for the current screen: rtl only when lang is Urdu AND rtlPref is on. */
  isRTL: boolean;
  row: 'row' | 'row-reverse';
  textAlign: 'left' | 'right';
  writingDirection: 'ltr' | 'rtl';
}

const DirectionContext = createContext<DirectionContextValue | null>(null);

// Deliberately NOT using React Native's I18nManager.forceRTL here: that flips native
// layout direction app-wide and requires a full reload to take effect, which would make
// the Settings screen's live RTL/LTR toggle impossible. Instead every screen reads this
// context and mirrors its own flex direction / text alignment on the fly.
export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const [rtlPref, setRtlPref] = useState(true);

  const value = useMemo<DirectionContextValue>(() => {
    const isRTL = lang === 'ur' && rtlPref;
    return {
      rtlPref,
      setRtlPref,
      isRTL,
      row: isRTL ? 'row-reverse' : 'row',
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    };
  }, [lang, rtlPref]);

  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirection(): DirectionContextValue {
  const ctx = useContext(DirectionContext);
  if (!ctx) throw new Error('useDirection must be used within a DirectionProvider');
  return ctx;
}
