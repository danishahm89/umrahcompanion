export interface AppSettings {
  id: number;
  companyName: string;
  appName: string;
}

export interface ContactInfo {
  whatsapp: string;
  phone: string;
  website: string;
  primaryEmail: string;
  secondaryEmail: string;
  offices: string[];
}

export interface ItineraryItem {
  id: string;
  order: number;
  keyEn: string; keyHi: string; keyUr: string;
  textEn: string; textHi: string; textUr: string;
}

export interface PackageInclusion {
  id: string;
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
  hajjShifting: boolean | null;
  live: boolean;
  order: number;
  itinerary?: ItineraryItem[];
  inclusions?: PackageInclusion[];
}

export interface GuideRitual {
  id: string; order: number;
  titleEn: string; titleHi: string; titleUr: string;
  descEn: string; descHi: string; descUr: string;
}

export interface FirstTimeStep {
  id: string; order: number;
  titleEn: string; titleHi: string; titleUr: string;
  descEn: string; descHi: string; descUr: string;
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
  id: string; order: number;
  nameEn: string; nameHi: string; nameUr: string;
  noteEn: string; noteHi: string; noteUr: string;
  duas: Dua[];
}

export interface PackingItem {
  id: string; order: number;
  textEn: string; textHi: string; textUr: string;
}

export interface PackingGroup {
  id: string; order: number;
  titleEn: string; titleHi: string; titleUr: string;
  items: PackingItem[];
}

export interface VaccineItem {
  id: string; order: number;
  nameEn: string; nameHi: string; nameUr: string;
  statusEn: string; statusHi: string; statusUr: string;
  descEn: string; descHi: string; descUr: string;
}

export interface NewsItem {
  id: string;
  publishedAt: string;
  titleEn: string; titleHi: string; titleUr: string;
  bodyEn: string; bodyHi: string; bodyUr: string;
  approved: boolean;
  source: { id: string; name: string; domain: string };
}

export interface NusukLink {
  id: string; order: number;
  titleEn: string; titleHi: string; titleUr: string;
  host: string;
  url: string;
}

export interface FaqItem {
  id: string; order: number;
  questionEn: string; questionHi: string; questionUr: string;
  answerEn: string; answerHi: string; answerUr: string;
}

export interface Service {
  id: string; order: number;
  nameEn: string; nameHi: string; nameUr: string;
  descEn: string; descHi: string; descUr: string;
  tags: string[];
  formType: string | null;
}

export interface Ebook {
  id: string; order: number;
  titleEn: string; titleHi: string; titleUr: string;
  descEn: string; descHi: string; descUr: string;
  coverImageUrl: string | null;
  driveUrl: string;
}

export interface NearbyMosque {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceM: number;
}

export interface TicketEnquiryInput {
  kind: 'air' | 'train';
  name: string;
  phone: string;
  fromPlace: string;
  toPlace: string;
  travelDate: string;
  returnDate?: string;
  passengers: number;
  classPref: string;
  tatkal?: boolean;
  notes?: string;
}

export interface CustomizeEnquiryInput {
  city: string;
  pax: number;
  nights: number;
  month: string;
  hotel: string;
  notes?: string;
}
