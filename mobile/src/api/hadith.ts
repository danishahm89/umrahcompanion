import { useQuery } from '@tanstack/react-query';

const HADITH_BASE = 'https://api.alzakwaantours.com/api/hadith';

export interface HadithBookMeta {
  id: string;
  nameEn: string;
  nameAr: string;
  nameHi: string;
  nameUr: string;
}

export const HADITH_BOOKS: HadithBookMeta[] = [
  { id: 'bukhari', nameEn: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري', nameHi: 'सहीह अल-बुखारी', nameUr: 'صحیح بخاری' },
  { id: 'muslim', nameEn: 'Sahih Muslim', nameAr: 'صحيح مسلم', nameHi: 'सहीह मुस्लिम', nameUr: 'صحیح مسلم' },
  { id: 'abudawud', nameEn: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', nameHi: 'सुनन अबू दाوूद', nameUr: 'سنن ابو داود' },
  { id: 'tirmidhi', nameEn: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', nameHi: 'जामे तिरमिजी', nameUr: 'جامع ترمذی' },
  { id: 'nasai', nameEn: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', nameHi: 'सुनन नसाई', nameUr: 'سنن نسائی' },
  { id: 'ibnmajah', nameEn: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', nameHi: 'सुनन इब्ने माजह', nameUr: 'سنن ابن ماجہ' },
];

export interface Hadith {
  hadithnumber: number;
  arabicnumber?: number;
  text: string;
  reference: { book: number; hadith: number };
}

export interface HadithEditionData {
  metadata: {
    name: string;
    sections: Record<string, string>;
    section_details?: Record<string, { hadithnumber_first?: number; hadithnumber_last?: number }>;
  };
  hadiths: Hadith[];
}

/** Maps app language to the hadith-api language prefix; falls back to English (no Hindi edition available). */
export function hadithEditionFor(bookId: string, lang: string): string {
  const prefix = lang === 'ur' ? 'urd' : 'eng';
  return `${bookId}-${prefix}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Hadith API error ${res.status}`);
  return res.json() as Promise<T>;
}

export function useHadithBook(bookId: string | undefined, lang: string) {
  const edition = bookId ? hadithEditionFor(bookId, lang) : undefined;
  return useQuery({
    queryKey: ['hadith', 'book', edition],
    queryFn: () => fetchJson<HadithEditionData>(`${HADITH_BASE}/${edition}.json`),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
