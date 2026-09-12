import { TranslatedListEditor, type ResourceConfig } from '../components/TranslatedListEditor';
import type { VaccineItem } from '../api/types';

const config: ResourceConfig<VaccineItem> = {
  path: '/vaccines',
  title: 'Vaccines',
  fields: [
    { key: 'name', label: 'Name', translated: true },
    { key: 'status', label: 'Status (e.g. Mandatory)', translated: true },
    { key: 'desc', label: 'Description', translated: true, multiline: true },
  ],
  summary: (v) => `${v.nameEn} — ${v.statusEn}`,
  blank: { nameEn: '', nameHi: '', nameUr: '', statusEn: '', statusHi: '', statusUr: '', descEn: '', descHi: '', descUr: '' },
};

export function VaccinesPage() {
  return <TranslatedListEditor config={config} />;
}
