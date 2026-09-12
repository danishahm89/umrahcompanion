import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { Dua, DuaStage } from '../api/types';

const BLANK_STAGE = { order: 0, nameEn: '', nameHi: '', nameUr: '', noteEn: '', noteHi: '', noteUr: '' };
const BLANK_DUA = { order: 0, arabic: '', transliteration: '', whenEn: '', whenHi: '', whenUr: '', meaningEn: '', meaningHi: '', meaningUr: '' };

export function DuasPage() {
  const [stages, setStages] = useState<DuaStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStage, setEditingStage] = useState<(DuaStage & { isNew?: boolean }) | null>(null);
  const [editingDua, setEditingDua] = useState<{ stageId: string; dua: Dua & { isNew?: boolean } } | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<DuaStage[]>('/duas').then((data) => { setStages(data.sort((a, b) => a.order - b.order)); setLoading(false); });
  };
  useEffect(load, []);

  const saveStage = async () => {
    if (!editingStage) return;
    const { id, isNew, duas, ...fields } = editingStage;
    if (isNew) await adminApi.post('/duas/stages', fields);
    else await adminApi.put(`/duas/stages/${id}`, fields);
    setEditingStage(null);
    load();
  };

  const deleteStage = async (id: string) => {
    if (!confirm('Delete this stage and all its duas?')) return;
    await adminApi.delete(`/duas/stages/${id}`);
    load();
  };

  const saveDua = async () => {
    if (!editingDua) return;
    const { stageId, dua } = editingDua;
    const { id, isNew, ...fields } = dua;
    if (isNew) await adminApi.post(`/duas/stages/${stageId}/duas`, fields);
    else await adminApi.put(`/duas/${id}`, fields);
    setEditingDua(null);
    load();
  };

  const deleteDua = async (id: string) => {
    if (!confirm('Delete this dua?')) return;
    await adminApi.delete(`/duas/${id}`);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Duas</h2>
        <button className="primary" onClick={() => setEditingStage({ ...BLANK_STAGE, id: '', duas: [], order: stages.length, isNew: true })}>New stage</button>
      </div>

      {stages.map((stage) => (
        <div key={stage.id} style={{ marginBottom: 24, border: '2px solid var(--color-divider-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--color-surface)' }}>
            <div><strong>{stage.nameEn}</strong> <span style={{ color: 'var(--t50)', fontSize: 12 }}>({stage.duas.length} duas)</span></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="secondary" onClick={() => setEditingStage({ ...stage })}>Edit stage</button>
              <button className="danger" onClick={() => deleteStage(stage.id)}>Delete stage</button>
              <button className="secondary" onClick={() => setEditingDua({ stageId: stage.id, dua: { ...BLANK_DUA, id: '', order: stage.duas.length, isNew: true } })}>Add dua</button>
            </div>
          </div>
          <table>
            <thead><tr><th>When</th><th>Arabic</th><th>Meaning (EN)</th><th /></tr></thead>
            <tbody>
              {stage.duas.map((d) => (
                <tr key={d.id}>
                  <td>{d.whenEn}</td>
                  <td dir="rtl" style={{ fontSize: 15 }}>{d.arabic}</td>
                  <td>{d.meaningEn}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="secondary" onClick={() => setEditingDua({ stageId: stage.id, dua: { ...d } })}>Edit</button>
                    <button className="danger" onClick={() => deleteDua(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {editingStage && (
        <div style={{ marginTop: 16, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editingStage.isNew ? 'New' : 'Edit'} stage</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Name (EN)</label><input value={editingStage.nameEn} onChange={(e) => setEditingStage({ ...editingStage, nameEn: e.target.value })} /></div>
            <div><label>Name (HI)</label><input value={editingStage.nameHi} onChange={(e) => setEditingStage({ ...editingStage, nameHi: e.target.value })} /></div>
            <div><label>Name (UR)</label><input value={editingStage.nameUr} onChange={(e) => setEditingStage({ ...editingStage, nameUr: e.target.value })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Note (EN)</label><textarea value={editingStage.noteEn} onChange={(e) => setEditingStage({ ...editingStage, noteEn: e.target.value })} /></div>
            <div><label>Note (HI)</label><textarea value={editingStage.noteHi} onChange={(e) => setEditingStage({ ...editingStage, noteHi: e.target.value })} /></div>
            <div><label>Note (UR)</label><textarea value={editingStage.noteUr} onChange={(e) => setEditingStage({ ...editingStage, noteUr: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={saveStage}>Save</button>
            <button className="secondary" onClick={() => setEditingStage(null)}>Cancel</button>
          </div>
        </div>
      )}

      {editingDua && (
        <div style={{ marginTop: 16, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editingDua.dua.isNew ? 'New' : 'Edit'} dua</h3>
          <div style={{ marginBottom: 12 }}><label>Arabic</label><textarea dir="rtl" value={editingDua.dua.arabic} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, arabic: e.target.value } })} /></div>
          <div style={{ marginBottom: 12 }}><label>Transliteration</label><input value={editingDua.dua.transliteration} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, transliteration: e.target.value } })} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>When (EN)</label><input value={editingDua.dua.whenEn} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, whenEn: e.target.value } })} /></div>
            <div><label>When (HI)</label><input value={editingDua.dua.whenHi} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, whenHi: e.target.value } })} /></div>
            <div><label>When (UR)</label><input value={editingDua.dua.whenUr} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, whenUr: e.target.value } })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Meaning (EN)</label><textarea value={editingDua.dua.meaningEn} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, meaningEn: e.target.value } })} /></div>
            <div><label>Meaning (HI)</label><textarea value={editingDua.dua.meaningHi} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, meaningHi: e.target.value } })} /></div>
            <div><label>Meaning (UR)</label><textarea value={editingDua.dua.meaningUr} onChange={(e) => setEditingDua({ ...editingDua, dua: { ...editingDua.dua, meaningUr: e.target.value } })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={saveDua}>Save</button>
            <button className="secondary" onClick={() => setEditingDua(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
