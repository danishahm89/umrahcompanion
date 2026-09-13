import { TranslatedListEditor, type ResourceConfig } from '../components/TranslatedListEditor';
import type { Ebook } from '../api/types';

const config: ResourceConfig<Ebook> = {
  path: '/ebooks',
  title: 'Ebooks',
  fields: [
    { key: 'title', label: 'Title', translated: true },
    { key: 'desc', label: 'Short description', translated: true, multiline: true },
    { key: 'coverImageUrl', label: 'Cover image URL (optional)', translated: false },
    { key: 'driveUrl', label: 'Google Drive link', translated: false },
  ],
  summary: (e) => e.titleEn,
  blank: { titleEn: '', titleHi: '', titleUr: '', descEn: '', descHi: '', descUr: '', coverImageUrl: '', driveUrl: '' },
};

export function EbooksPage() {
  return <TranslatedListEditor config={config} />;
}
