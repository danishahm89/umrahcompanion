import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { ItineraryItem, Package, PackageInclusion } from '../api/types';

const BLANK_ITIN = (order: number): ItineraryItem => ({ order, keyEn: '', keyHi: '', keyUr: '', textEn: '', textHi: '', textUr: '' });
const BLANK_INCL = (order: number): PackageInclusion => ({ order, textEn: '', textHi: '', textUr: '' });

const BLANK_PACKAGE: Omit<Package, 'id'> = {
  type: 'group',
  nameEn: '', nameHi: '', nameUr: '',
  priceInr: 0,
  price2Share: null,
  price3Share: null,
  price4Share: null,
  price5Share: null,
  departDate: new Date().toISOString().slice(0, 10),
  nights: 1,
  makkahHotelStars: 3,
  makkahHotelDistM: 0,
  makkahHotelRemark: 'walking',
  madinahHotelStars: 3,
  madinahHotelDistM: 0,
  madinahHotelRemark: 'walking',
  cityEn: '', cityHi: '', cityUr: '',
  mealsEn: '', mealsHi: '', mealsUr: '',
  visaIncluded: true,
  flightIncluded: true,
  flightConfirmLater: false,
  flightAirline: '',
  flightRouting: 'direct',
  flightViaCity: '',
  flightDepartureAt: null,
  flightReturnAt: null,
  hajjShifting: null,
  live: true,
  order: 0,
  itinerary: [],
  inclusions: [],
};

// Lowest set share price = the "from" price shown to the admin as a live preview; the server
// recomputes and stores this as priceInr on save, so this is read-only, informational.
function fromPrice(p: Pick<Package, 'price2Share' | 'price3Share' | 'price4Share' | 'price5Share'>): number | null {
  const vals = [p.price2Share, p.price3Share, p.price4Share, p.price5Share].filter((v): v is number => typeof v === 'number');
  return vals.length ? Math.min(...vals) : null;
}

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" with no timezone/seconds.
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Type</label>
              <select value={editing.type} onChange={(e) => set('type', e.target.value)}>
                <option value="group">Group</option>
                <option value="private">Private</option>
                <option value="hajj">Hajj</option>
              </select>
            </div>
            <div><label>Nights</label><input type="number" value={editing.nights} onChange={(e) => set('nights', Number(e.target.value))} /></div>
            <div><label>Departs</label><input type="date" value={editing.departDate.slice(0, 10)} onChange={(e) => set('departDate', e.target.value)} /></div>
          </div>

          <h4 style={{ marginBottom: 8 }}>Room-sharing prices (₹ per person)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div><label>2 sharing</label><input type="number" value={editing.price2Share ?? ''} onChange={(e) => set('price2Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
            <div><label>3 sharing</label><input type="number" value={editing.price3Share ?? ''} onChange={(e) => set('price3Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
            <div><label>4 sharing</label><input type="number" value={editing.price4Share ?? ''} onChange={(e) => set('price4Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
            <div><label>5 sharing</label><input type="number" value={editing.price5Share ?? ''} onChange={(e) => set('price5Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted, #888)', marginBottom: 16 }}>
            Leave a tier blank if it isn't offered. "From" price shown in the app and list below is auto-set to the lowest tier filled in
            {fromPrice(editing) != null ? ` — currently ₹${fromPrice(editing)!.toLocaleString('en-IN')}.` : ' — fill in at least one tier.'}
          </p>

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

          <h4 style={{ marginBottom: 8 }}>Makkah hotel</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Stars</label>
              <select value={editing.makkahHotelStars} onChange={(e) => set('makkahHotelStars', Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star</option>)}
              </select>
            </div>
            <div><label>Distance from Haram (m)</label><input type="number" value={editing.makkahHotelDistM} onChange={(e) => set('makkahHotelDistM', Number(e.target.value))} /></div>
            <div><label>Access</label>
              <select value={editing.makkahHotelRemark} onChange={(e) => set('makkahHotelRemark', e.target.value)}>
                <option value="walking">Walking distance</option>
                <option value="shuttle">Shuttle service</option>
              </select>
            </div>
          </div>

          <h4 style={{ marginBottom: 8 }}>Madinah hotel</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Stars</label>
              <select value={editing.madinahHotelStars} onChange={(e) => set('madinahHotelStars', Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star</option>)}
              </select>
            </div>
            <div><label>Distance from Haram (m)</label><input type="number" value={editing.madinahHotelDistM} onChange={(e) => set('madinahHotelDistM', Number(e.target.value))} /></div>
            <div><label>Access</label>
              <select value={editing.madinahHotelRemark} onChange={(e) => set('madinahHotelRemark', e.target.value)}>
                <option value="walking">Walking distance</option>
                <option value="shuttle">Shuttle service</option>
              </select>
            </div>
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

          <h4 style={{ marginBottom: 8 }}>Flight details</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none', fontSize: 13, marginBottom: 8 }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={editing.flightConfirmLater}
              onChange={(e) => set('flightConfirmLater', e.target.checked)}
            /> Flight not finalized yet — show "To be confirmed" instead of dates
          </label>
          {!editing.flightConfirmLater && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                <div><label>Airline</label><input value={editing.flightAirline ?? ''} onChange={(e) => set('flightAirline', e.target.value)} /></div>
                <div><label>Routing</label>
                  <select value={editing.flightRouting ?? 'direct'} onChange={(e) => set('flightRouting', e.target.value)}>
                    <option value="direct">Direct</option>
                    <option value="via">Via</option>
                  </select>
                </div>
                {editing.flightRouting === 'via' && (
                  <div><label>Via city</label><input value={editing.flightViaCity ?? ''} onChange={(e) => set('flightViaCity', e.target.value)} /></div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div><label>Departure date &amp; time</label>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(editing.flightDepartureAt)}
                    onChange={(e) => set('flightDepartureAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                  />
                </div>
                <div><label>Return date &amp; time</label>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(editing.flightReturnAt)}
                    onChange={(e) => set('flightReturnAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                  />
                </div>
              </div>
            </>
          )}

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
