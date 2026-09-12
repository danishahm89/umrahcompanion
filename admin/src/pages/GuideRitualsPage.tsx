import { TranslatedListEditor, type ResourceConfig } from '../components/TranslatedListEditor';
import type { GuideRitual } from '../api/types';

const config: ResourceConfig<GuideRitual> = {
  path: '/guide-rituals',
  title: 'Guide rituals',
  fields: [
    { key: 'title', label: 'Title', translated: true },
    { key: 'desc', label: 'Description', translated: true, multiline: true },
  ],
  summary: (r) => r.titleEn,
  blank: { titleEn: '', titleHi: '', titleUr: '', descEn: '', descHi: '', descUr: '' },
};

export function GuideRitualsPage() {
  return <TranslatedListEditor config={config} />;
}
