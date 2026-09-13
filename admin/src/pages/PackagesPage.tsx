import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { ItineraryItem, Package, PackageInclusion } from '../api/types';

const BLANK_ITIN = (order: number): ItineraryItem => ({ order, keyEn: '', keyHi: '', keyUr: '', textEn: '', textHi: '', textUr: '' });
const BLANK_INCL = (order: number): PackageInclusion => ({ order, textEn: '', textHi: '', textUr: '' });

const BLANK_PACKAGE: Omit<Package, 'id'> = {
  type: 'group',
  nameEn: '', nameHi: '', nameUr: '',
  priceInr: 0,
  departDate: new Date().toISOString().slice(0, 10),
  nights: 1,
  hotelStars: '3★',
  hotelDistM: 0,
  cityEn: '', cityHi: '', cityUr: '',
  mealsEn: '', mealsHi: '', mealsUr: '',
  visaIncluded: true,
  flightIncluded: true,
  hajjShifting: null,
  live: true,
  order: 0,
  itinerary: [],
  inclusions: [],
};

export function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<Package[]>('/packages').then((data) => { setPackages(data); setLoading(false); });
  };

  useEffect(load, []);

  const save = async () => {
    if (!editing) return;
    setError(null);
    try {
      const isNew = !packages.some((p) => p.id === editing.id);
      if (isNew) await adminApi.post('/packages', editing);
      else await adminApi.put(`/packages/${editing.id}`, editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(String(e));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    await adminApi.delete(`/packages/${id}`);
    load();
  };

  const set = <K extends keyof Package>(key: K, value: Package[K]) => setEditing((e) => (e ? { ...e, [key]: value } : e));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Packages</h2>
        <button className="primary" onClick={() => setEditing({ id: '', ...BLANK_PACKAGE, order: packages.length })}>New package</button>
      </div>

      {loading ? <p>Loading…</p> : (
        <table>
          <thead>
            <tr><th>Package</th><th>Price</th><th>Nights</th><th>Departs</th><th>Type</th><th>Live</th><th /></tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id}>
                <td>{p.nameEn}</td>
                <td>₹{p.priceInr.toLocaleString('en-IN')}</td>
                <td>{p.nights}</td>
                <td>{new Date(p.departDate).toLocaleDateString('en-GB')}</td>
                <td>{p.type}</td>
                <td><span className={`tag ${p.live ? '' : 'outline'}`}>{p.live ? 'On' : 'Off'}</span></td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="secondary" onClick={() => setEditing(p)}>Edit</button>
                  <button className="danger" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div style={{ marginTop: 24, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editing.id ? 'Edit' : 'New'} package</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Name (EN)</label><input value={editing.nameEn} onChange={(e) => set('nameEn', e.target.value)} /></div>
            <div><label>Name (HI)</label><input value={editing.nameHi} onChange={(e) => set('nameHi', e.target.value)} /></div>
            <div><label>Name (UR)</label><input value={editing.nameUr} onChange={(e) => set('nameUr', e.target.value)} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Type</label>
              <select value={editing.type} onChange={(e) => set('type', e.target.value)}>
                <option value="group">Group</option>
                <option value="private">Private</option>
                <option value="hajj">Hajj</option>
              </select>
            </div>
            <div><label>Price (INR)</label><input type="number" value={editing.priceInr} onChange={(e) => set('priceInr', Number(e.target.value))} /></div>
            <div><label>Nights</label><input type="number" value={editing.nights} onChange={(e) => set('nights', Number(e.target.value))} /></div>
            <div><label>Departs</label><input type="date" value={editing.departDate.slice(0, 10)} onChange={(e) => set('departDate', e.target.value)} /></div>
          </div>

          {editing.type === 'hajj' && (
            <div style={{ marginBottom: 12 }}>
              <label>Hajj movement (nights above sets the 20-day / 30+ day bucket shown in the app)</label>
              <select
                value={editing.hajjShifting === null ? '' : editing.hajjShifting ? 'shifting' : 'non_shifting'}
                onChange={(e) => set('hajjShifting', e.target.value === '' ? null : e.target.value === 'shifting')}
              >
                <option value="">Not set</option>
                <option value="shifting">Shifting</option>
                <option value="non_shifting">Non-shifting</option>
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Hotel stars</label><input value={editing.hotelStars} onChange={(e) => set('hotelStars', e.target.value)} /></div>
            <div><label>Distance from Haram (m)</label><input type="number" value={editing.hotelDistM} onChange={(e) => set('hotelDistM', Number(e.target.value))} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Departure city (EN)</label><input value={editing.cityEn} onChange={(e) => set('cityEn', e.target.value)} /></div>
            <div><label>City (HI)</label><input value={editing.cityHi} onChange={(e) => set('cityHi', e.target.value)} /></div>
            <div><label>City (UR)</label><input value={editing.cityUr} onChange={(e) => set('cityUr', e.target.value)} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Meals (EN)</label><input value={editing.mealsEn} onChange={(e) => set('mealsEn', e.target.value)} /></div>
            <div><label>Meals (HI)</label><input value={editing.mealsHi} onChange={(e) => set('mealsHi', e.target.value)} /></div>
            <div><label>Meals (UR)</label><input value={editing.mealsUr} onChange={(e) => set('mealsUr', e.target.value)} /></div>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={editing.visaIncluded} onChange={(e) => set('visaIncluded', e.target.checked)} /> Visa included
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={editing.flightIncluded} onChange={(e) => set('flightIncluded', e.target.checked)} /> Flight included
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={editing.live} onChange={(e) => set('live', e.target.checked)} /> Live in app
            </label>
          </div>

          <h4 style={{ marginBottom: 8 }}>Itinerary</h4>
          {editing.itinerary.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 2fr 2fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input placeholder="Day (EN)" value={it.keyEn} onChange={(e) => set('itinerary', editing.itinerary.map((x, j) => (j === i ? { ...x, keyEn: e.target.value } : x)))} />
              <input placeholder="Day (HI)" value={it.keyHi} onChange={(e) => set('itinerary', editing.itinerary.map((x, j) => (j === i ? { ...x, keyHi: e.target.value } : x)))} />
              <input placeholder="Day (UR)" value={it.keyUr} onChange={(e) => set('itinerary', editing.itinerary.map((x, j) => (j === i ? { ...x, keyUr: e.target.value } : x)))} />
              <input placeholder="Text (EN)" value={it.textEn} onChange={(e) => set('itinerary', editing.itinerary.map((x, j) => (j === i ? { ...x, textEn: e.target.value } : x)))} />
              <input placeholder="Text (HI)" value={it.textHi} onChange={(e) => set('itinerary', editing.itinerary.map((x, j) => (j === i ? { ...x, textHi: e.target.value } : x)))} />
              <input placeholder="Text (UR)" value={it.textUr} onChange={(e) => set('itinerary', editing.itinerary.map((x, j) => (j === i ? { ...x, textUr: e.target.value } : x)))} />
              <button className="danger" onClick={() => set('itinerary', editing.itinerary.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button className="secondary" style={{ marginBottom: 16 }} onClick={() => set('itinerary', [...editing.itinerary, BLANK_ITIN(editing.itinerary.length)])}>Add itinerary row</button>

          <h4 style={{ marginBottom: 8 }}>Inclusions</h4>
          {editing.inclusions.map((inc, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr auto', gap: 6, marginBottom: 6 }}>
              <input placeholder="EN" value={inc.textEn} onChange={(e) => set('inclusions', editing.inclusions.map((x, j) => (j === i ? { ...x, textEn: e.target.value } : x)))} />
              <input placeholder="HI" value={inc.textHi} onChange={(e) => set('inclusions', editing.inclusions.map((x, j) => (j === i ? { ...x, textHi: e.target.value } : x)))} />
              <input placeholder="UR" value={inc.textUr} onChange={(e) => set('inclusions', editing.inclusions.map((x, j) => (j === i ? { ...x, textUr: e.target.value } : x)))} />
              <button className="danger" onClick={() => set('inclusions', editing.inclusions.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button className="secondary" style={{ marginBottom: 16 }} onClick={() => set('inclusions', [...editing.inclusions, BLANK_INCL(editing.inclusions.length)])}>Add inclusion row</button>

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
