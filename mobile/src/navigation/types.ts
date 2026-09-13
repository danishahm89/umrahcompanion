export type RootStackParamList = {
  Home: undefined;
  GuideHub: undefined;
  FirstTime: undefined;
  Duas: undefined;
  Packing: undefined;
  Vaccine: undefined;
  News: undefined;
  Nusuk: undefined;
  Faq: undefined;
  Packages: undefined;
  PackageDetail: { id: string };
  Customize: undefined;
  Services: undefined;
  Ebooks: undefined;
  ContactUs: undefined;
  NearbyMosques: undefined;
  Qibla: undefined;
  TicketForm: { kind: 'air' | 'train'; serviceName: string };
  More: undefined;
  Settings: undefined;
  Gallery: undefined;
};

export type TabSection = 'home' | 'guide' | 'packages' | 'news' | 'more' | null;

const GUIDE_SCREENS: (keyof RootStackParamList)[] = ['GuideHub', 'FirstTime', 'Duas', 'Packing', 'Vaccine'];
const PACKAGES_SCREENS: (keyof RootStackParamList)[] = ['Packages', 'PackageDetail', 'Customize'];
const NEWS_SCREENS: (keyof RootStackParamList)[] = ['News', 'Nusuk'];
const MORE_SCREENS: (keyof RootStackParamList)[] = ['More', 'Settings', 'Faq', 'Services', 'Ebooks', 'ContactUs', 'TicketForm'];

export function sectionForRoute(routeName: string | undefined): TabSection {
  if (routeName === 'Home' || routeName === 'NearbyMosques' || routeName === 'Qibla') return 'home';
  if (GUIDE_SCREENS.includes(routeName as keyof RootStackParamList)) return 'guide';
  if (PACKAGES_SCREENS.includes(routeName as keyof RootStackParamList)) return 'packages';
  if (NEWS_SCREENS.includes(routeName as keyof RootStackParamList)) return 'news';
  if (MORE_SCREENS.includes(routeName as keyof RootStackParamList)) return 'more';
  return null; // Gallery: no tab highlighted, matching the design.
}
