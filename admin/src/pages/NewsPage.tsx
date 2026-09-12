import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { NewsItem, NewsSource } from '../api/types';

const BLANK_SOURCE = { name: '', domain: '' };
const blankItem = (sourceId: string): Omit<NewsItem, 'id' | 'source'> => ({
  sourceId, publishedAt: new Date().toISOString(), titleEn: '', titleHi: '', titleUr: '', bodyEn: '', bodyHi: '', bodyUr: '', approved: false,
});

export function NewsPage() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSource, setEditingSource] = useState<(NewsSource & { isNew?: boolean }) | null>(null);
  const [editingItem, setEditingItem] = useState<(Omit<NewsItem, 'source'> & { isNew?: boolean }) | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.get<NewsSource[]>('/news/sources'), adminApi.get<NewsItem[]>('/news/items')]).then(([s, i]) => {
      setSources(s); setItems(i); setLoading(false);
    });
  };
  useEffect(load, []);

  const saveSource = async () => {
    if (!editingSource) return;
    const { id, isNew, ...fields } = editingSource;
    if (isNew) await adminApi.post('/news/sources', fields);
    else await adminApi.put(`/news/sources/${id}`, fields);
    setEditingSource(null);
    load();
  };
  const deleteSource = async (id: string) => {
    if (!confirm('Delete this source and its news items?')) return;
    await adminApi.delete(`/news/sources/${id}`);
    load();
  };

  const saveItem = async () => {
    if (!editingItem) return;
    const { id, isNew, ...fields } = editingItem;
    if (isNew) await adminApi.post('/news/items', fields);
    else await adminApi.put(`/news/items/${id}`, fields);
    setEditingItem(null);
    load();
  };
  const deleteItem = async (id: string) => {
    if (!confirm('Delete this news item?')) return;
    await adminApi.delete(`/news/items/${id}`);
    load();
  };
  const toggleApproved = async (item: NewsItem) => {
    await adminApi.put(`/news/items/${item.id}`, { approved: !item.approved });
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>News sources</h2>
        <button className="primary" onClick={() => setEditingSource({ ...BLANK_SOURCE, id: '', lastSyncedAt: null, isNew: true })}>New source</button>
      </div>
      <table style={{ marginBottom: 24 }}>
        <thead><tr><th>Name</th><th>Domain</th><th>Last synced</th><th /></tr></thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td><td>{s.domain}</td>
              <td>{s.lastSyncedAt ? new Date(s.lastSyncedAt).toLocaleString() : '—'}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="secondary" onClick={() => setEditingSource({ ...s })}>Edit</button>
                <button className="danger" onClick={() => deleteSource(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingSource && (
        <div style={{ marginBottom: 24, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editingSource.isNew ? 'New' : 'Edit'} source</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Name</label><input value={editingSource.name} onChange={(e) => setEditingSource({ ...editingSource, name: e.target.value })} /></div>
            <div><label>Domain</label><input value={editingSource.domain} onChange={(e) => setEditingSource({ ...editingSource, domain: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={saveSource}>Save</button>
            <button className="secondary" onClick={() => setEditingSource(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>News review queue</h2>
        <button className="primary" disabled={!sources.length} onClick={() => setEditingItem({ ...blankItem(sources[0]?.id ?? ''), id: '', isNew: true })}>
          New item
        </button>
      </div>
      <table>
        <thead><tr><th>Source</th><th>Title (EN)</th><th>Published</th><th>Approved</th><th /></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.source.name}</td>
              <td>{item.titleEn}</td>
              <td>{new Date(item.publishedAt).toLocaleString()}</td>
              <td>
                <button className={item.approved ? 'primary' : 'secondary'} onClick={() => toggleApproved(item)}>
                  {item.approved ? 'Approved' : 'Pending'}
                </button>
              </td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="secondary" onClick={() => setEditingItem({ ...item })}>Edit</button>
                <button className="danger" onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingItem && (
        <div style={{ marginTop: 16, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editingItem.isNew ? 'New' : 'Edit'} news item</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Source</label>
            <select value={editingItem.sourceId} onChange={(e) => setEditingItem({ ...editingItem, sourceId: e.target.value })}>
              {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Title (EN)</label><input value={editingItem.titleEn} onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })} /></div>
            <div><label>Title (HI)</label><input value={editingItem.titleHi} onChange={(e) => setEditingItem({ ...editingItem, titleHi: e.target.value })} /></div>
            <div><label>Title (UR)</label><input value={editingItem.titleUr} onChange={(e) => setEditingItem({ ...editingItem, titleUr: e.target.value })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Body (EN)</label><textarea value={editingItem.bodyEn} onChange={(e) => setEditingItem({ ...editingItem, bodyEn: e.target.value })} /></div>
            <div><label>Body (HI)</label><textarea value={editingItem.bodyHi} onChange={(e) => setEditingItem({ ...editingItem, bodyHi: e.target.value })} /></div>
            <div><label>Body (UR)</label><textarea value={editingItem.bodyUr} onChange={(e) => setEditingItem({ ...editingItem, bodyUr: e.target.value })} /></div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none', marginBottom: 12 }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={editingItem.approved} onChange={(e) => setEditingItem({ ...editingItem, approved: e.target.checked })} /> Approved (visible in app)
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={saveItem}>Save</button>
            <button className="secondary" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
