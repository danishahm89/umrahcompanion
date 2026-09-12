import React, { createContext, useContext, useMemo, useState } from 'react';
import { STRINGS, type StringKey } from './strings';

export type Lang = 'en' | 'hi' | 'ur';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a static UI-chrome string key. */
  t: (key: StringKey) => string;
  /** Pick the current-language field out of an [en, hi, ur] tuple (used for admin-managed content). */
  pick: (tuple: [string, string, string]) => string;
  /** Same, for API rows shaped as separate enField/hiField/urField properties. */
  field: (en: string, hi: string, ur: string) => string;
  index: 0 | 1 | 2;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const index = lang === 'hi' ? 1 : lang === 'ur' ? 2 : 0;

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      index,
      t: (key) => STRINGS[key][index],
      pick: (tuple) => tuple[index] ?? tuple[0],
      field: (en, hi, ur) => [en, hi, ur][index] ?? en,
    }),
    [lang, index],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
