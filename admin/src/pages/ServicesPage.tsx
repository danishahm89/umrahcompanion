import { TranslatedListEditor, type ResourceConfig, type Row } from '../components/TranslatedListEditor';
import type { Service } from '../api/types';

const config: ResourceConfig<Service> = {
  path: '/services',
  title: 'Services',
  fields: [
    { key: 'name', label: 'Name', translated: true },
    { key: 'desc', label: 'Description', translated: true, multiline: true },
    { key: 'tags', label: 'Tags (comma-separated)', translated: false },
  ],
  summary: (s) => s.nameEn,
  blank: { nameEn: '', nameHi: '', nameUr: '', descEn: '', descHi: '', descUr: '', tags: '' },
  fromApi: (row: Row) => ({ ...row, tags: (JSON.parse((row.tags as string) || '[]') as string[]).join(', ') }),
  toApi: (row: Row) => ({ ...row, tags: JSON.stringify(String(row.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean)) }),
};

export function ServicesPage() {
  return <TranslatedListEditor config={config} />;
}
