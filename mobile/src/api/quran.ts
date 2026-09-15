import { useQuery } from '@tanstack/react-query';

const QURAN_BASE = 'https://api.alzakwaantours.com/api/quran';

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
}

export interface SurahEdition {
  identifier: string;
  language: string;
  englishName: string;
  ayahs: Ayah[];
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  editions: SurahEdition[];
}

async function quranGet<T>(path: string): Promise<T> {
  const res = await fetch(`${QURAN_BASE}${path}`);
  if (!res.ok) throw new Error(`Quran API error ${res.status}`);
  return (await res.json()) as T;
}

export const TRANSLATION_EDITIONS: Record<string, string> = {
  en: 'en.sahih',
  hi: 'hi.hindi',
  ur: 'ur.jalandhry',
};

export function useQuranSurahList() {
  return useQuery({
    queryKey: ['quran', 'surahs'],
    queryFn: () => quranGet<SurahMeta[]>('/surahs.json'),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useQuranSurah(number: number | undefined, translationEdition: string) {
  return useQuery({
    queryKey: ['quran', 'surah', number, translationEdition],
    queryFn: () =>
      quranGet<SurahDetail>(`/${number}.json`),
    enabled: !!number,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
