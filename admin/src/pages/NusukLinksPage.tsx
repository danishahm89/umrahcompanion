import { TranslatedListEditor, type ResourceConfig } from '../components/TranslatedListEditor';
import type { NusukLink } from '../api/types';

const config: ResourceConfig<NusukLink> = {
  path: '/nusuk-links',
  title: 'Nusuk links',
  fields: [
    { key: 'title', label: 'Title', translated: true },
    { key: 'host', label: 'Host label (e.g. nusuk.sa)', translated: false },
    { key: 'url', label: 'URL', translated: false },
  ],
  summary: (l) => `${l.titleEn} → ${l.url}`,
  blank: { titleEn: '', titleHi: '', titleUr: '', host: '', url: '' },
};

export function NusukLinksPage() {
  return <TranslatedListEditor config={config} />;
}
