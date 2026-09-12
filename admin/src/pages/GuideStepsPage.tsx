import { TranslatedListEditor, type ResourceConfig } from '../components/TranslatedListEditor';
import type { FirstTimeStep } from '../api/types';

const config: ResourceConfig<FirstTimeStep> = {
  path: '/guide-steps',
  title: 'First-time steps',
  fields: [
    { key: 'title', label: 'Title', translated: true },
    { key: 'desc', label: 'Description', translated: true, multiline: true },
  ],
  summary: (r) => r.titleEn,
  blank: { titleEn: '', titleHi: '', titleUr: '', descEn: '', descHi: '', descUr: '' },
};

export function GuideStepsPage() {
  return <TranslatedListEditor config={config} />;
}
