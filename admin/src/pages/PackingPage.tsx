import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { PackingGroup, PackingItem } from '../api/types';

const BLANK_GROUP = { order: 0, titleEn: '', titleHi: '', titleUr: '' };
const BLANK_ITEM = { order: 0, textEn: '', textHi: '', textUr: '' };

export function PackingPage() {
  const [groups, setGroups] = useState<PackingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<(PackingGroup & { isNew?: boolean }) | null>(null);
  const [editingItem, setEditingItem] = useState<{ groupId: string; item: PackingItem & { isNew?: boolean } } | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<PackingGroup[]>('/packing').then((data) => { setGroups(data.sort((a, b) => a.order - b.order)); setLoading(false); });
  };
  useEffect(load, []);

  const saveGroup = async () => {
    if (!editingGroup) return;
    const { id, isNew, items, ...fields } = editingGroup;
    if (isNew) await adminApi.post('/packing/groups', fields);
    else await adminApi.put(`/packing/groups/${id}`, fields);
    setEditingGroup(null);
    load();
  };
  const deleteGroup = async (id: string) => {
    if (!confirm('Delete this group and all its items?')) return;
    await adminApi.delete(`/packing/groups/${id}`);
    load();
  };
  const saveItem = async () => {
    if (!editingItem) return;
    const { groupId, item } = editingItem;
    const { id, isNew, ...fields } = item;
    if (isNew) await adminApi.post(`/packing/groups/${groupId}/items`, fields);
    else await adminApi.put(`/packing/items/${id}`, fields);
    setEditingItem(null);
    load();
  };
  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await adminApi.delete(`/packing/items/${id}`);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Packing checklist</h2>
        <button className="primary" onClick={() => setEditingGroup({ ...BLANK_GROUP, id: '', items: [], order: groups.length, isNew: true })}>New group</button>
      </div>

      {groups.map((group) => (
        <div key={group.id} style={{ marginBottom: 24, border: '2px solid var(--color-divider-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--color-surface)' }}>
            <strong>{group.titleEn}</strong>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="secondary" onClick={() => setEditingGroup({ ...group })}>Edit group</button>
              <button className="danger" onClick={() => deleteGroup(group.id)}>Delete group</button>
              <button className="secondary" onClick={() => setEditingItem({ groupId: group.id, item: { ...BLANK_ITEM, id: '', order: group.items.length, isNew: true } })}>Add item</button>
            </div>
          </div>
          <table>
            <thead><tr><th>Item (EN)</th><th>HI</th><th>UR</th><th /></tr></thead>
            <tbody>
              {group.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.textEn}</td><td>{item.textHi}</td><td>{item.textUr}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="secondary" onClick={() => setEditingItem({ groupId: group.id, item: { ...item } })}>Edit</button>
                    <button className="danger" onClick={() => deleteItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {editingGroup && (
        <div style={{ marginTop: 16, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editingGroup.isNew ? 'New' : 'Edit'} group</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Title (EN)</label><input value={editingGroup.titleEn} onChange={(e) => setEditingGroup({ ...editingGroup, titleEn: e.target.value })} /></div>
            <div><label>Title (HI)</label><input value={editingGroup.titleHi} onChange={(e) => setEditingGroup({ ...editingGroup, titleHi: e.target.value })} /></div>
            <div><label>Title (UR)</label><input value={editingGroup.titleUr} onChange={(e) => setEditingGroup({ ...editingGroup, titleUr: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={saveGroup}>Save</button>
            <button className="secondary" onClick={() => setEditingGroup(null)}>Cancel</button>
          </div>
        </div>
      )}

      {editingItem && (
        <div style={{ marginTop: 16, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editingItem.item.isNew ? 'New' : 'Edit'} item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Text (EN)</label><input value={editingItem.item.textEn} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, textEn: e.target.value } })} /></div>
            <div><label>Text (HI)</label><input value={editingItem.item.textHi} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, textHi: e.target.value } })} /></div>
            <div><label>Text (UR)</label><input value={editingItem.item.textUr} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, textUr: e.target.value } })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={saveItem}>Save</button>
            <button className="secondary" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
