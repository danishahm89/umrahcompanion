import { TranslatedListEditor, type ResourceConfig } from '../components/TranslatedListEditor';
import type { FaqItem } from '../api/types';

const config: ResourceConfig<FaqItem> = {
  path: '/faq',
  title: 'FAQ',
  fields: [
    { key: 'question', label: 'Question', translated: true },
    { key: 'answer', label: 'Answer', translated: true, multiline: true },
  ],
  summary: (f) => f.questionEn,
  blank: { questionEn: '', questionHi: '', questionUr: '', answerEn: '', answerHi: '', answerUr: '' },
};

export function FaqPage() {
  return <TranslatedListEditor config={config} />;
}
