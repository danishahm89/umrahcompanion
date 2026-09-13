import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from './client';
import type {
  AppSettings, ContactInfo, CustomizeEnquiryInput, DuaStage, Ebook, FaqItem, FirstTimeStep,
  GuideRitual, NearbyMosque, NewsItem, NusukLink, Package, PackingGroup, Service, TicketEnquiryInput, VaccineItem,
} from './types';

export const useSettings = () => useQuery({ queryKey: ['settings'], queryFn: () => apiGet<AppSettings>('/settings') });
export const useContact = () => useQuery({ queryKey: ['contact'], queryFn: () => apiGet<ContactInfo>('/contact') });

export const usePackages = (type?: string) =>
  useQuery({
    queryKey: ['packages', type ?? 'all'],
    queryFn: () => apiGet<Package[]>(`/packages${type ? `?type=${type}` : ''}`),
  });

export const usePackage = (id: string | undefined) =>
  useQuery({
    queryKey: ['package', id],
    queryFn: () => apiGet<Package>(`/packages/${id}`),
    enabled: !!id,
  });

export const useGuideRituals = () => useQuery({ queryKey: ['guide-rituals'], queryFn: () => apiGet<GuideRitual[]>('/guide/rituals') });
export const useGuideSteps = () => useQuery({ queryKey: ['guide-steps'], queryFn: () => apiGet<FirstTimeStep[]>('/guide/steps') });
export const useDuaStages = () => useQuery({ queryKey: ['duas'], queryFn: () => apiGet<DuaStage[]>('/duas') });
export const usePackingGroups = () => useQuery({ queryKey: ['packing'], queryFn: () => apiGet<PackingGroup[]>('/packing') });
export const useVaccines = () => useQuery({ queryKey: ['vaccines'], queryFn: () => apiGet<VaccineItem[]>('/vaccines') });
export const useNews = () => useQuery({ queryKey: ['news'], queryFn: () => apiGet<NewsItem[]>('/news') });
export const useNusukLinks = () => useQuery({ queryKey: ['nusuk-links'], queryFn: () => apiGet<NusukLink[]>('/nusuk-links') });
export const useFaq = () => useQuery({ queryKey: ['faq'], queryFn: () => apiGet<FaqItem[]>('/faq') });
export const useServices = () => useQuery({ queryKey: ['services'], queryFn: () => apiGet<Service[]>('/services') });
export const useEbooks = () => useQuery({ queryKey: ['ebooks'], queryFn: () => apiGet<Ebook[]>('/ebooks') });

export const useNearbyMosques = (lat: number | undefined, lng: number | undefined) =>
  useQuery({
    queryKey: ['nearby-mosques', lat, lng],
    queryFn: () => apiGet<NearbyMosque[]>(`/nearby-mosques?lat=${lat}&lng=${lng}`),
    enabled: lat != null && lng != null,
  });

export const useSubmitEnquiry = () =>
  useMutation({ mutationFn: (input: CustomizeEnquiryInput) => apiPost('/enquiries', input) });

export const useSubmitTicketEnquiry = () =>
  useMutation({ mutationFn: (input: TicketEnquiryInput) => apiPost('/ticket-enquiries', input) });
