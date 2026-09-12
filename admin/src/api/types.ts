export interface Translated3 {
  order: number;
}

export interface GuideRitual extends Translated3 {
  id: string;
  titleEn: string; titleHi: string; titleUr: string;
  descEn: string; descHi: string; descUr: string;
}

export type FirstTimeStep = GuideRitual;

export interface VaccineItem extends Translated3 {
  id: string;
  nameEn: string; nameHi: string; nameUr: string;
  statusEn: string; statusHi: string; statusUr: string;
  descEn: string; descHi: string; descUr: string;
}

export interface NusukLink extends Translated3 {
  id: string;
  titleEn: string; titleHi: string; titleUr: string;
  host: string; url: string;
}

export interface FaqItem extends Translated3 {
  id: string;
  questionEn: string; questionHi: string; questionUr: string;
  answerEn: string; answerHi: string; answerUr: string;
}

export interface Service extends Translated3 {
  id: string;
  nameEn: string; nameHi: string; nameUr: string;
  descEn: string; descHi: string; descUr: string;
  tags: string; // JSON-encoded string[]
}

export interface ItineraryItem {
  id?: string;
  order: number;
  keyEn: string; keyHi: string; keyUr: string;
  textEn: string; textHi: string; textUr: string;
}

export interface PackageInclusion {
  id?: string;
  order: number;
  textEn: string; textHi: string; textUr: string;
}

export interface Package {
  id: string;
  type: string;
  nameEn: string; nameHi: string; nameUr: string;
  priceInr: number;
  departDate: string;
  nights: number;
  hotelStars: string;
  hotelDistM: number;
  cityEn: string; cityHi: string; cityUr: string;
  mealsEn: string; mealsHi: string; mealsUr: string;
  visaIncluded: boolean;
  flightIncluded: boolean;
  live: boolean;
  order: number;
  itinerary: ItineraryItem[];
  inclusions: PackageInclusion[];
}

export interface Dua {
  id: string;
  order: number;
  arabic: string;
  transliteration: string;
  whenEn: string; whenHi: string; whenUr: string;
  meaningEn: string; meaningHi: string; meaningUr: string;
}

export interface DuaStage {
  id: string;
  order: number;
  nameEn: string; nameHi: string; nameUr: string;
  noteEn: string; noteHi: string; noteUr: string;
  duas: Dua[];
}

export interface PackingItem {
  id: string;
  order: number;
  textEn: string; textHi: string; textUr: string;
}

export interface PackingGroup {
  id: string;
  order: number;
  titleEn: string; titleHi: string; titleUr: string;
  items: PackingItem[];
}

export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  lastSyncedAt: string | null;
}

export interface NewsItem {
  id: string;
  sourceId: string;
  source: NewsSource;
  publishedAt: string;
  titleEn: string; titleHi: string; titleUr: string;
  bodyEn: string; bodyHi: string; bodyUr: string;
  approved: boolean;
}

export interface ContactInfo {
  whatsapp: string;
  phone: string;
  website: string;
  primaryEmail: string;
  secondaryEmail: string;
  offices: string[];
}

export interface AppSettings {
  id: number;
  companyName: string;
  appName: string;
}

export interface CustomizeEnquiry {
  id: string;
  city: string;
  pax: number;
  nights: number;
  month: string;
  hotel: string;
  notes: string | null;
  createdAt: string;
}
