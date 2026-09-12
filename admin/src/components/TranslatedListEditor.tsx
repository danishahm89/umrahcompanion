import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';

export interface FieldConfig {
  key: string; // 'title' -> titleEn/titleHi/titleUr when translated; exact key otherwise
  label: string;
  translated: boolean;
  multiline?: boolean;
}

export interface ResourceConfig<T extends { id: string; order: number }> {
  path: string;
  title: string;
  fields: FieldConfig[];
  summary: (item: T) => string;
  blank: Record<string, unknown>;
  /** Optional hooks for fields that need a non-1:1 API shape (e.g. Service.tags as JSON). */
  fromApi?: (row: Row) => Row;
  toApi?: (row: Row) => Row;
}

export type Row = Record<string, unknown> & { id: string; order: number };

function fieldKeys(f: FieldConfig): string[] {
  return f.translated ? [`${f.key}En`, `${f.key}Hi`, `${f.key}Ur`] : [f.key];
}

function FieldInputs({ field, values, onChange }: { field: FieldConfig; values: Row; onChange: (key: string, v: string) => void }) {
  const keys = fieldKeys(field);
  const Tag = field.multiline ? 'textarea' : 'input';
  return (
    <div style={{ marginBottom: 12 }}>
      <label>{field.label}{field.translated ? ' (EN / HI / UR)' : ''}</label>
      <div style={{ display: 'grid', gridTemplateColumns: field.translated ? '1fr 1fr 1fr' : '1fr', gap: 8 }}>
        {keys.map((k) => (
          <Tag
            key={k}
            value={(values[k] as string) ?? ''}
            onChange={(e) => onChange(k, e.target.value)}
            rows={field.multiline ? 3 : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function TranslatedListEditor<T extends { id: string; order: number }>({ config }: { config: ResourceConfig<T> }) {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<Row[]>(config.path).then((data) => {
      const rows = config.fromApi ? data.map(config.fromApi) : data;
      setItems(rows.sort((a, b) => a.order - b.order));
      setLoading(false);
    }).catch((e) => { setError(String(e)); setLoading(false); });
  };

  useEffect(load, [config.path]);

  const save = async () => {
    if (!editing) return;
    setError(null);
    try {
      const payload = config.toApi ? config.toApi(editing) : editing;
      if (items.some((i) => i.id === editing.id)) {
        await adminApi.put(`${config.path}/${editing.id}`, payload);
      } else {
        await adminApi.post(config.path, payload);
      }
      setEditing(null);
      load();
    } catch (e) {
      setError(String(e));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await adminApi.delete(`${config.path}/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>{config.title}</h2>
        <button className="primary" onClick={() => setEditing({ id: '', order: items.length, ...config.blank } as Row)}>
          New {config.title.replace(/s$/, '')}
        </button>
      </div>

      {loading ? <p>Loading…</p> : (
        <table>
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Summary</th>
              <th style={{ width: 140 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td>{config.summary(item as unknown as T)}</td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="secondary" onClick={() => setEditing(item)}>Edit</button>
                  <button className="danger" onClick={() => remove(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div style={{ marginTop: 24, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{items.some((i) => i.id === editing.id) ? 'Edit' : 'New'} {config.title.replace(/s$/, '')}</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Order</label>
            <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
          </div>
          {config.fields.map((f) => (
            <FieldInputs key={f.key} field={f} values={editing} onChange={(k, v) => setEditing({ ...editing, [k]: v })} />
          ))}
          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={save}>Save</button>
            <button className="secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
